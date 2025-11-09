import { useState, useEffect } from 'react';
import { useAudio } from './useAudio';
import type { FrequencyPreset } from './types';

export function ControlPanel({ setActivePreset }: { setActivePreset: (preset: FrequencyPreset | null) => void }) {
  const [presets, setPresets] = useState<FrequencyPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const { playBinaural, playIsochronic, stop } = useAudio();

  useEffect(() => {
    fetch('/frequencies.json')
      .then(res => res.json())
      .then(data => {
        setPresets(data);
        setSelectedPreset(data[0]?.name || "");
      });
  }, []);

  const handlePlay = () => {
    const preset = presets.find(p => p.name === selectedPreset);
    if (!preset) return;

    setActivePreset(preset);

    if (preset.type === 'binaural' && preset.baseFrequency && preset.beatFrequency) {
      playBinaural(preset.baseFrequency, preset.beatFrequency);
    } else if (preset.type === 'isochronic' && preset.pulseFrequency && preset.baseFrequency) {
      playIsochronic(preset.pulseFrequency, preset.baseFrequency);
    }
    setIsPlaying(true);
  };

  const handleStop = () => {
    stop();
    setIsPlaying(false);
    setActivePreset(null);
  };

  return (
    <div style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 5, color: 'white', zIndex: 100 }}>
      <select value={selectedPreset} onChange={e => setSelectedPreset(e.target.value)} disabled={isPlaying}>
        {presets.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
      </select>
      {!isPlaying ? (
        <button onClick={handlePlay}>Play</button>
      ) : (
        <button onClick={handleStop}>Stop</button>
      )}
    </div>
  );
}
