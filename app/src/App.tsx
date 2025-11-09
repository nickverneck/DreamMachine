import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import { VRButton, XR, createXRStore } from '@react-three/xr'
import { ControlPanel } from './ControlPanel'
import { SkySphere } from './SkySphere'
import type { FrequencyPreset } from './types'

const xrStore = createXRStore()

function Box(props: JSX.IntrinsicElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state, delta) => (ref.current.rotation.x += delta))
  return (
    <mesh {...props} ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'orange'} />
    </mesh>
  )
}

function App() {
  const [activePreset, setActivePreset] = useState<FrequencyPreset | null>(null)
  const [pulseEnabled, setPulseEnabled] = useState(true)

  return (
    <>
      <VRButton store={xrStore} />
      <ControlPanel
        setActivePreset={setActivePreset}
        pulseEnabled={pulseEnabled}
        onPulseToggle={setPulseEnabled}
      />
      <Canvas>
        <XR store={xrStore}>
          <SkySphere activePreset={activePreset} pulseEnabled={pulseEnabled} />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} />
        </XR>
      </Canvas>
    </>
  )
}

export default App
