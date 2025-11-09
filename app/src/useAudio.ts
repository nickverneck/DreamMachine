import { useCallback, useRef } from 'react'

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}

type AudioMode = 'binaural' | 'isochronic' | null

const DEFAULT_VOLUME = 0.35

const isScheduledSourceNode = (node: AudioNode): node is AudioScheduledSourceNode =>
  typeof (node as AudioScheduledSourceNode).stop === 'function'

export const useAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const managedNodesRef = useRef<AudioNode[]>([])
  const currentModeRef = useRef<AudioMode>(null)

  const ensureContext = useCallback(async () => {
    if (typeof window === 'undefined') {
      throw new Error('Web Audio API is not available in this environment.')
    }

    if (!audioContextRef.current) {
      const Ctor = window.AudioContext || window.webkitAudioContext
      if (!Ctor) {
        throw new Error('This browser does not support the Web Audio API.')
      }
      audioContextRef.current = new Ctor({ latencyHint: 'interactive' })
    }

    if (!masterGainRef.current) {
      const gain = audioContextRef.current.createGain()
      gain.gain.value = DEFAULT_VOLUME
      gain.connect(audioContextRef.current.destination)
      masterGainRef.current = gain
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume()
    }

    return {
      context: audioContextRef.current,
      masterGain: masterGainRef.current!,
    }
  }, [])

  const tearDownNodes = useCallback(() => {
    managedNodesRef.current.forEach((node) => {
      try {
        node.disconnect()
      } catch {
        // no-op
      }
      if (isScheduledSourceNode(node)) {
        try {
          node.stop()
        } catch {
          // node might already be stopped
        }
      }
    })
    managedNodesRef.current = []
    currentModeRef.current = null
  }, [])

  const playBinaural = useCallback(
    async (baseFrequency: number, beatFrequency: number) => {
      const { context, masterGain } = await ensureContext()
      tearDownNodes()

      const leftOsc = context.createOscillator()
      leftOsc.type = 'sine'
      leftOsc.frequency.setValueAtTime(baseFrequency, context.currentTime)

      const rightOsc = context.createOscillator()
      rightOsc.type = 'sine'
      rightOsc.frequency.setValueAtTime(baseFrequency + beatFrequency, context.currentTime)

      const merger = context.createChannelMerger(2)
      leftOsc.connect(merger, 0, 0)
      rightOsc.connect(merger, 0, 1)
      merger.connect(masterGain)

      leftOsc.start()
      rightOsc.start()

      managedNodesRef.current = [leftOsc, rightOsc, merger]
      currentModeRef.current = 'binaural'
    },
    [ensureContext, tearDownNodes],
  )

  const playIsochronic = useCallback(
    async (pulseFrequency: number, baseFrequency: number) => {
      const { context, masterGain } = await ensureContext()
      tearDownNodes()

      const carrierOsc = context.createOscillator()
      carrierOsc.type = 'sine'
      carrierOsc.frequency.setValueAtTime(baseFrequency, context.currentTime)

      const amplitudeGain = context.createGain()
      amplitudeGain.gain.setValueAtTime(0, context.currentTime)

      const lfo = context.createOscillator()
      lfo.type = 'square'
      lfo.frequency.setValueAtTime(pulseFrequency, context.currentTime)

      const lfoAttenuation = context.createGain()
      lfoAttenuation.gain.value = 0.5

      const lfoOffset = context.createConstantSource()
      lfoOffset.offset.value = 0.5

      lfo.connect(lfoAttenuation)
      lfoAttenuation.connect(amplitudeGain.gain)
      lfoOffset.connect(amplitudeGain.gain)

      carrierOsc.connect(amplitudeGain).connect(masterGain)

      carrierOsc.start()
      lfo.start()
      lfoOffset.start()

      managedNodesRef.current = [carrierOsc, amplitudeGain, lfo, lfoAttenuation, lfoOffset]
      currentModeRef.current = 'isochronic'
    },
    [ensureContext, tearDownNodes],
  )

  const stop = useCallback(async () => {
    tearDownNodes()
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      await audioContextRef.current.suspend().catch(() => {
        // ignore inability to suspend
      })
    }
  }, [tearDownNodes])

  return {
    playBinaural,
    playIsochronic,
    stop,
    get mode() {
      return currentModeRef.current
    },
  }
}
