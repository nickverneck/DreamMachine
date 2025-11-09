export interface FrequencyPreset {
  name: string
  type: 'binaural' | 'isochronic'
  baseFrequency?: number
  beatFrequency?: number
  pulseFrequency?: number
  description?: string
}
