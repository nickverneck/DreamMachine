import { useRef } from 'react'

export const useAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])
  const intervalRef = useRef<number | null>(null)

  const playBinaural = (baseFreq: number, beatFreq: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    const context = audioContextRef.current;

    const leftOsc = context.createOscillator();
    leftOsc.frequency.setValueAtTime(baseFreq, context.currentTime);

    const rightOsc = context.createOscillator();
    rightOsc.frequency.setValueAtTime(baseFreq + beatFreq, context.currentTime);

    const panner = context.createStereoPanner();
    panner.pan.value = -1;

    const panner2 = context.createStereoPanner();
    panner2.pan.value = 1;

    leftOsc.connect(panner).connect(context.destination);
    rightOsc.connect(panner2).connect(context.destination);

    leftOsc.start();
    rightOsc.start();

    oscillatorsRef.current = [leftOsc, rightOsc];
  }

  const playIsochronic = (pulseFreq: number, baseFreq: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    const context = audioContextRef.current;
    const osc = context.createOscillator();
    osc.frequency.setValueAtTime(baseFreq, context.currentTime);

    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0, context.currentTime);

    osc.connect(gainNode).connect(context.destination);
    osc.start();

    const pulseTime = 1 / pulseFreq;
    const pulse = () => {
      gainNode.gain.setValueAtTime(1, context.currentTime);
      gainNode.gain.setValueAtTime(0, context.currentTime + pulseTime / 2);
    };

    intervalRef.current = setInterval(pulse, pulseTime * 1000);

    oscillatorsRef.current = [osc];
  }

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    oscillatorsRef.current.forEach(osc => osc.stop());
    if (audioContextRef.current) {
      audioContextRef.current.close().then(() => {
        audioContextRef.current = null
      })
    }
    oscillatorsRef.current = [];
  }

  return { playBinaural, playIsochronic, stop }
}
