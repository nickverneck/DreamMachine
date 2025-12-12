import { useState, useEffect, FormEvent } from 'react'
import type { FrequencyPreset } from './types'
import type { useAudio } from './useAudio'

type ControlPanelProps = {
  setActivePreset: (preset: FrequencyPreset | null) => void
  pulseEnabled: boolean
  onPulseToggle: (enabled: boolean) => void
  audio: ReturnType<typeof useAudio>
}

const DEFAULT_CUSTOM_PRESET: FrequencyPreset & { beatFrequency: number; pulseFrequency: number } = {
  name: '',
  type: 'binaural',
  baseFrequency: 200,
  beatFrequency: 4,
  pulseFrequency: 6,
}

export function ControlPanel({ setActivePreset, pulseEnabled, onPulseToggle, audio }: ControlPanelProps) {
  const [presets, setPresets] = useState<FrequencyPreset[]>([])
  const [selectedPreset, setSelectedPreset] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customPreset, setCustomPreset] = useState(DEFAULT_CUSTOM_PRESET)
  const [customError, setCustomError] = useState<string | null>(null)
  const { playBinaural, playIsochronic, stop } = audio

  useEffect(() => {
    fetch('/frequencies.json')
      .then((res) => res.json())
      .then((data) => {
        setPresets(data)
        setSelectedPreset(data[0]?.name || '')
      })
  }, [])

  const handlePlay = async () => {
    const preset = presets.find((p) => p.name === selectedPreset)
    if (!preset) return

    setActivePreset(preset)

    try {
      if (preset.type === 'binaural' && preset.baseFrequency && preset.beatFrequency) {
        await playBinaural(preset.baseFrequency, preset.beatFrequency)
      } else if (preset.type === 'isochronic' && preset.pulseFrequency && preset.baseFrequency) {
        await playIsochronic(preset.pulseFrequency, preset.baseFrequency)
      }
      setIsPlaying(true)
    } catch (error) {
      console.error('Unable to start audio', error)
    }
  }

  const handleStop = async () => {
    await stop()
    setIsPlaying(false)
    setActivePreset(null)
  }

  const handleCustomChange = (field: keyof typeof customPreset, value: string) => {
    setCustomPreset((prev) => ({
      ...prev,
      [field]: field === 'type' || field === 'name' ? value : Number(value),
    }))
  }

  const handleCustomSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmedName = customPreset.name.trim()
    const name = trimmedName || `Custom ${new Date().toLocaleTimeString()}`

    if (!customPreset.baseFrequency || customPreset.baseFrequency <= 0) {
      setCustomError('Base frequency must be greater than 0 Hz.')
      return
    }

    if (customPreset.type === 'binaural' && (!customPreset.beatFrequency || customPreset.beatFrequency <= 0)) {
      setCustomError('Provide a beat frequency (> 0 Hz) for binaural presets.')
      return
    }

    if (customPreset.type === 'isochronic' && (!customPreset.pulseFrequency || customPreset.pulseFrequency <= 0)) {
      setCustomError('Provide a pulse frequency (> 0 Hz) for isochronic presets.')
      return
    }

    const newPreset: FrequencyPreset = {
      name,
      type: customPreset.type,
      baseFrequency: customPreset.baseFrequency,
      ...(customPreset.type === 'binaural'
        ? { beatFrequency: customPreset.beatFrequency }
        : { pulseFrequency: customPreset.pulseFrequency }),
      description: 'Custom tone',
    }

    setPresets((prev) => [...prev.filter((p) => p.name !== newPreset.name), newPreset])
    setSelectedPreset(newPreset.name)
    setShowCustomForm(false)
    setCustomError(null)
    setCustomPreset(DEFAULT_CUSTOM_PRESET)
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        background: 'rgba(0,0,0,0.5)',
        padding: 16,
        borderRadius: 8,
        color: 'white',
        zIndex: 100,
        minWidth: 260,
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span>Preset</span>
        <select value={selectedPreset} onChange={(e) => setSelectedPreset(e.target.value)} disabled={isPlaying}>
          {presets.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={pulseEnabled}
          onChange={(event) => onPulseToggle(event.target.checked)}
        />
        <span>Pulse visual feedback</span>
      </label>
      <div style={{ display: 'flex', gap: 8 }}>
        {!isPlaying ? (
          <button onClick={handlePlay} style={{ flex: 1 }}>
            Play
          </button>
        ) : (
          <button onClick={handleStop} style={{ flex: 1 }}>
            Stop
          </button>
        )}
        <button onClick={() => setShowCustomForm((prev) => !prev)} style={{ flex: 1 }}>
          {showCustomForm ? 'Close' : 'Custom Tone'}
        </button>
      </div>
      {showCustomForm && (
        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            type="text"
            placeholder="Name"
            value={customPreset.name}
            onChange={(e) => handleCustomChange('name', e.target.value)}
          />
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>Type</span>
            <select value={customPreset.type} onChange={(e) => handleCustomChange('type', e.target.value)}>
              <option value="binaural">Binaural</option>
              <option value="isochronic">Isochronic</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>Base Frequency (Hz)</span>
            <input
              type="number"
              min={1}
              step={0.1}
              value={customPreset.baseFrequency}
              onChange={(e) => handleCustomChange('baseFrequency', e.target.value)}
            />
          </label>
          {customPreset.type === 'binaural' ? (
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span>Beat Frequency (Hz)</span>
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={customPreset.beatFrequency}
                onChange={(e) => handleCustomChange('beatFrequency', e.target.value)}
              />
            </label>
          ) : (
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span>Pulse Frequency (Hz)</span>
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={customPreset.pulseFrequency}
                onChange={(e) => handleCustomChange('pulseFrequency', e.target.value)}
              />
            </label>
          )}
          {customError && <span style={{ color: '#ffbcbc', fontSize: 12 }}>{customError}</span>}
          <button type="submit">Save Preset</button>
        </form>
      )}
    </div>
  )
}
