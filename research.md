# DreamMachine PWA Research

This document outlines the findings and recommended technical approach for building the DreamMachine Progressive Web App (PWA) for VR headsets.

## 1. VR Framework: A-Frame vs. React Three Fiber

The core of the VR experience will be built on top of the WebXR API. Two popular libraries simplify this process: A-Frame and React Three Fiber (RTF).

### A-Frame
- **Approach:** An entity-component framework based on HTML. You build scenes declaratively, much like writing HTML.
- **Pros:**
    - Extremely easy to get started. The learning curve is very gentle.
    - Great for static scenes or simple interactions.
    - Large community and plenty of examples.
- **Cons:**
    - Can become cumbersome for complex applications with a lot of dynamic state.
    - Less flexible if you need to drop down to raw Three.js logic frequently.

**Example:**
```html
<a-scene>
  <a-sky id="blinking-sky" color="#000000"></a-sky>
</a-scene>
```

### React Three Fiber (RTF)
- **Approach:** A React renderer for Three.js. It lets you build a 3D scene with React components.
- **Pros:**
    - Leverages the entire React ecosystem (hooks for state management, components, etc.).
    - Excellent for dynamic, interactive applications where the scene changes based on application state.
    - Provides a more structured and scalable architecture for complex projects.
- **Cons:**
    - Requires knowledge of both React and Three.js concepts.
    - Steeper learning curve than A-Frame.

**Example:**
```jsx
import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'

function Scene() {
  return (
    <Canvas>
      <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
    </Canvas>
  )
}
```

### **Recommendation:**
**React Three Fiber (RTF)** is the recommended choice. While A-Frame is faster for a "hello world" prototype, DreamMachine's functionality (managing audio state, frequency, UI controls) will benefit greatly from React's state management capabilities. It is a more robust and scalable foundation.

---

## 2. Audio Generation: Binaural & Isochronic Tones

The **Web Audio API** is the standard for creating and processing audio in the browser. It is more than capable of generating the required tones.

### How to Create Binaural Beats
Binaural beats are a perceptual illusion created by playing two slightly different frequencies into each ear.

1.  **Create an `AudioContext`**.
2.  **Create two `OscillatorNode`s**.
3.  **Set Frequencies:** Set one oscillator to a base frequency (e.g., 136.1 Hz) and the other to the base frequency plus the desired beat (e.g., 136.1 + 10 Hz = 146.1 Hz for a 10 Hz alpha wave beat).
4.  **Pan the Audio:** Use a `StereoPannerNode` to pan the first oscillator to the left ear (`pan.value = -1`) and the second oscillator to the right ear (`pan.value = 1`).
5.  **Connect and Play:** Connect both panners to the `audioContext.destination` and start the oscillators.

### How to Create Isochronic Tones
Isochronic tones are single tones that are rapidly turned on and off. This creates a rhythmic pulse.

1.  **Create an `AudioContext`** and one **`OscillatorNode`**.
2.  **Create a `GainNode`:** This will act as our volume control.
3.  **Connect the Nodes:** Connect the oscillator to the `GainNode`, and the `GainNode` to the `audioContext.destination`.
4.  **Pulse the Gain:** In a timed loop (e.g., using `setInterval` or the render loop of the VR framework), rapidly change the `gain.value` of the `GainNode` between `1.0` (on) and `0.0` (off). The speed of this modulation determines the frequency of the pulse. For a 10 Hz pulse, you would turn the sound on and off 10 times per second.

---

## 3. Visual Blinking Effect in VR

The blinking background that covers the "VR dome" can be achieved by creating a large sphere (a "sky sphere") and placing the camera inside it.

1.  **Create a Sphere Geometry:** In Three.js (which RTF uses), this is a `SphereGeometry`.
2.  **Apply a Material:** Create a `MeshBasicMaterial` or `MeshStandardMaterial` for the sphere. The key is that the material's `side` property must be set to `THREE.BackSide` so it renders on the interior of the sphere.
3.  **Animate the Color:** In the application's render loop (`useFrame` in RTF), you will animate the material's color property (e.g., `material.color` or `material.emissive`).
4.  **Synchronization:** The logic that animates the color should be synchronized with the audio generation for the isochronic tones. When the `GainNode` is set to `1.0`, the sky color should be visible. When the `GainNode` is `0.0`, the sky color should be black.

---

## 4. Data Storage for Frequencies

**Yes, JSON is a perfect format for storing frequency presets.** It's lightweight, human-readable, and easily parsed in JavaScript.

A file like `frequencies.json` could be created and loaded into the application using the `fetch` API.

**Example `frequencies.json`:**
```json
[
  {
    "name": "Alpha Wave Focus",
    "type": "binaural",
    "baseFrequency": 136.1,
    "beatFrequency": 10,
    "description": "Promotes a state of relaxed focus and learning."
  },
  {
    "name": "Theta Meditation",
    "type": "isochronic",
    "pulseFrequency": 7,
    "description": "Encourages deep meditation and creativity."
  },
  {
    "name": "Delta Wave Sleep",
    "type": "binaural",
    "baseFrequency": 100,
    "beatFrequency": 3,
    "description": "Aids in deep, restorative sleep."
  }
]
```
