import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { FrequencyPreset } from './types'

export function SkySphere({ activePreset }: { activePreset: FrequencyPreset | null }) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null!)

  useFrame((state) => {
    if (activePreset?.type === 'isochronic' && activePreset.pulseFrequency) {
      const pulseTime = 1 / activePreset.pulseFrequency;
      const cycle = (state.clock.elapsedTime % pulseTime) / pulseTime;
      materialRef.current.color.set(cycle < 0.5 ? '#330000' : '#000000');
    } else {
      materialRef.current.color.set('#000000');
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial ref={materialRef} color="#000000" side={THREE.BackSide} />
    </mesh>
  )
}
