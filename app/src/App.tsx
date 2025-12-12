import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useRef, useState, type ReactNode } from 'react'
import * as THREE from 'three'
import { VRButton, XR, createXRStore, useXR } from '@react-three/xr'
import { ControlPanel } from './ControlPanel'
import { SkySphere } from './SkySphere'
import type { FrequencyPreset } from './types'
import { useAudio } from './useAudio'

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

function PanelAnchor({ children }: { children: ReactNode }) {
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const { isPresenting } = useXR()
  const forward = useRef(new THREE.Vector3())

  useFrame(() => {
    if (!groupRef.current) return
    camera.getWorldDirection(forward.current)
    groupRef.current.position.copy(camera.position).add(forward.current.multiplyScalar(1.2))
    groupRef.current.quaternion.copy(camera.quaternion)
  })

  return (
    <group ref={groupRef} visible>
      <Html transform occlude={!isPresenting} distanceFactor={3}>
        {children}
      </Html>
    </group>
  )
}

function App() {
  const [activePreset, setActivePreset] = useState<FrequencyPreset | null>(null)
  const [pulseEnabled, setPulseEnabled] = useState(true)
  const audio = useAudio()

  return (
    <>
      <VRButton store={xrStore} />
      <Canvas camera={{ position: [0, 1.6, 4], fov: 70 }}>
        <XR store={xrStore}>
          <PanelAnchor>
            <ControlPanel
              setActivePreset={setActivePreset}
              pulseEnabled={pulseEnabled}
              onPulseToggle={setPulseEnabled}
              audio={audio}
            />
          </PanelAnchor>
          <SkySphere activePreset={activePreset} pulseEnabled={pulseEnabled} />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[-1.2, 1.6, -2]} />
          <Box position={[1.2, 1.6, -2]} />
        </XR>
      </Canvas>
    </>
  )
}

export default App
