
# DreamMachine PWA - Task List

This document outlines the development tasks for creating the DreamMachine PWA using React and React Three Fiber.

| ID | Task | Status |
|:---|:---|:---|
| 1  | **Project Setup: Initialize React + Vite** <br> Create a new React project using Vite with the TypeScript template. | Done |
| 2  | **Project Setup: Install Dependencies** <br> Install `three`, `@react-three/fiber`, `@react-three/drei`, and `vite-plugin-pwa`. | Done |
| 3  | **Project Setup: Basic Cleanup** <br> Remove boilerplate code and CSS from the default Vite template. | Done |
| 4  | **PWA: Configuration** <br> Set up `vite-plugin-pwa` in the `vite.config.ts` file. | Done |
| 5  | **PWA: Create `manifest.json`** <br> Define app name, icons, start URL, display mode (`fullscreen`), and theme colors. | Done |
| 6  | **PWA: Create Icons** <br> Add app icons of various sizes to the `public` directory as specified in the manifest. | Done |
| 7  | **PWA: Service Worker** <br> Ensure the service worker is correctly configured for offline caching. | Done |
| 8  | **Data: Create `frequencies.json`** <br> Create the JSON file in the `public` directory with presets for binaural and isochronic tones. | Done |
| 9  | **Core Scene: Create VR Canvas** <br> Set up the main `<Canvas>` component from RTF and add the `<VRButton />` for entering VR mode. | Done |
| 10 | **Core Scene: Create Sky Sphere** <br> Build a React component for a large sphere with a material rendered on the inside (`THREE.BackSide`). | To Do |
| 11 | **Audio: Create Audio Manager** <br> Develop a service or hook (`useAudio`) to manage the Web Audio API `AudioContext` and oscillators. | Done |
| 12 | **Audio: Implement Binaural Beats** <br> Create a function within the audio manager to generate binaural beats from a base and beat frequency. | Done |
| 13 | **Audio: Implement Isochronic Tones** <br> Create a function to generate isochronic tones by pulsing a `GainNode` at a specific frequency. | Done |
| 14 | **UI: Build Control Panel** <br> Create UI components (e.g., dropdown, play/pause button, volume slider) to control the audio. | To Do |
| 15 | **State Management: Implement Core Logic** <br> Use React hooks (`useState`, `useContext`) to manage the app's state (current preset, play/pause status, etc.). | To Do |
| 16 | **Integration: Load Frequency Data** <br> Fetch `frequencies.json` and populate the UI controls. | To Do |
| 17 | **Integration: Connect UI to Audio** <br> Wire the UI controls to the audio manager to start, stop, and modify the tones. | To Do |
| 18 | **Integration: Synchronize Visuals** <br> In the `useFrame` hook, update the sky sphere's material color based on the isochronic pulse frequency. | To Do |
| 19 | **Deployment: Build Project** <br> Run the build command (`npm run build`) to generate the production assets. | To Do |
| 20 | **Deployment: Host Application** <br> Deploy the `dist` folder to a hosting provider with HTTPS (e.g., Vercel, Netlify). | To Do |
