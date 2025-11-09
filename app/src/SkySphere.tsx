import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { FrequencyPreset } from './types'

const BASE_COLOR = '#000000'
const PULSE_COLOR = '#ffffff'
const SKY_RADIUS = 500

export function SkySphere({ activePreset }: { activePreset: FrequencyPreset | null }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(({ camera, clock }) => {
    if (!meshRef.current || !materialRef.current) return

    meshRef.current.position.copy(camera.position)

    const pulseFrequency =
      activePreset?.type === 'isochronic'
        ? activePreset.pulseFrequency
        : activePreset?.beatFrequency

    if (pulseFrequency && pulseFrequency > 0) {
      const pulseTime = 1 / pulseFrequency
      const cycle = (clock.elapsedTime % pulseTime) / pulseTime
      materialRef.current.color.set(cycle < 0.5 ? PULSE_COLOR : BASE_COLOR)
    } else {
      materialRef.current.color.set(BASE_COLOR)
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[SKY_RADIUS, 60, 40]} />
      <meshBasicMaterial ref={materialRef} color={BASE_COLOR} side={THREE.BackSide} />
    </mesh>
  )
}
