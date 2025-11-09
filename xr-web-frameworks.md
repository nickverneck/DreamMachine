# XR Web Frameworks & Toolkits (updated November 9, 2025)

The WebXR stack leveled up in 2025: Chrome 135 now exposes WebGPU/WebXR bindings in stable builds, and open-source samples show how to mix compute shaders with immersive rendering, enabling richer visuals directly in spatial browsers.citeturn7search0turn7search1 This guide summarizes the frameworks shipping noteworthy XR web capabilities right now.

## Quick Comparison
| Framework / Toolkit | Latest Release | Stand-out Capabilities | Ideal Use Cases |
| --- | --- | --- | --- |
| Babylon.js | 8.0 (March 27, 2025)citeturn8search0 | Node Render Graph, Adobe co-built IBL shadows, WGSL-ready shader stack, Lightweight Viewer embeds.citeturn8search0 | Cross-device WebXR experiences that need built-in session helpers and first-class immersive support.citeturn15search7 |
| A-Frame | 1.7.0 (February 20, 2025)citeturn10search0 | ES-module build, new post-processing pipeline, WebGPU/TSL experiments, Logitech MX Ink input.citeturn10search2 | Declarative prototypes, education, and hackathon projects where HTML-like components speed iteration. |
| PlayCanvas | Engine 2.12.0 (October 9, 2025)citeturn5view0 | Streaming Gaussian Splat LODs, multi-draw, joystick-ready XR scripts, cloud-hosted editor.citeturn5view0turn11search0 | Distributed teams that co-edit XR scenes in-browser for configurators or brand activations. |
| Wonderland Engine | 1.4.7 (September 6, 2025)citeturn16search0 | WASM runtime tuned for mobile/iOS, rapid packaging + hot reload, profiler for FPS budgets.citeturn16search1 | Premium WebXR deployments needing console-like performance in tiny bundles. |
| Niantic 8th Wall / Studio | Mid-2025 updatesciteturn8search0turn14search3 | Niantic Maps for Web, multi-Space scene graph, AI-powered Asset Lab, Android APK export.citeturn8search0turn14search3 | Location-based or VPS AR campaigns spanning browser and native kiosk builds. |
| @react-three/xr | v6.6.0 (January 30, 2025)citeturn16search2 | Rewritten store API, default hands/controllers, new offer-session UX hooks, IWER emulator.citeturn16search2turn16search1 | React Three Fiber sites that must fluidly hand off between flat canvas and headset mode. |
| TresJS | 5.0 (September 22, 2025)citeturn6search1 | `create-tres` CLI, ESM-only core, experimental WebGPU renderer, Nuxt devtools scene inspector.citeturn6search1turn6search2 | Vue/Nuxt teams chasing high DX for immersive microsites with SSR fallbacks. |
| wgpuEngine | June 3, 2025 milestoneciteturn7search2 | First OSS engine validating WebGPU–WebXR bindings plus JS bridge for browser apps.citeturn7search2 | R&D labs exploring compute-heavy XR renders or custom shading pipelines. |

---

## Framework Profiles & Notes

### Babylon.js 8.0
- **Why it matters**: Node Render Graph, Adobe-authored lighting, RTV (real-time reflections) and WGSL shader upgrades arrive in one release, letting you design XR render pipelines without dropping into engine internals.citeturn8search0
- **XR workflow**: Babylon advertises out-of-the-box WebXR helpers and backwards-compatible WebXR viewer integrations, so immersive and flat builds share the same code.citeturn15search7
- **Tips**: Treat the Lightweight Viewer as an embed for product cards on 2D pages, then gate richer XR-only passes inside your custom render graph.

### A-Frame 1.7.0
- **Why it matters**: The release keeps A-Frame’s declarative `<a-entity>` model while layering modern rendering (post-processing, WebGPU & TSL experiments) plus pro input like Logitech MX Ink.citeturn10search2
- **Inputs & devices**: MX Ink support plus optional WebXR hit-test attributes mean pen-style annotations or sketch flows are achievable with minimal code.citeturn10search2
- **Tip**: Start with `npm init aframe` (ESM build) so you can tree-shake unused components when targeting lightweight mobile AR.

### PlayCanvas Engine 2.12.0
- **Why it matters**: Streaming Gaussian Splat LODs and multi-draw keep large photogrammetry or volumetric captures performant for XR browsers, while the engine adds joystick locomotion scripts to the built-in XR UI.citeturn5view0
- **Team workflows**: Official docs highlight WebXR templates, controller mapping, and cloud-hosted collaboration, letting designers preview Quest scenes directly from Chrome.citeturn11search0
- **Watch for**: Pin your project to a specific engine version before launch—new rendering features land frequently and can change shader defaults.citeturn5view0

### Wonderland Engine 1.4.7
- **Why it matters**: The September build stabilized editor crashes, improved Material Import, and tightened animation pipelines, giving XR teams reliable hot-reload loops.citeturn16search0
- **Performance edge**: Wonderland’s WASM runtime, CDN-ready hosting, and profiler are marketed for console-like performance across desktop, mobile, and standalone headsets.citeturn16search1
- **Tip**: Use the profiler to confirm 72/90 FPS budgets before packaging; Wonderland’s export wizard keeps build sizes deterministic for kiosk deployments.citeturn16search1

### Niantic 8th Wall / Studio
- **Why it matters**: February’s update introduced Niantic Maps for Web, Spaces (scene graph orchestration), and location triggers, while summer releases layered in Asset Lab (AI content) and native Android export.citeturn8search0turn14search3
- **Distribution**: Project-wide Input Manager, Spaces, and VPS anchors let you design one storyline but deploy across browser, kiosk, and APK builds without rebuilding logic.citeturn8search0turn14search3
- **Tip**: Treat each Space like a campaign stage—onboarding, map exploration, VPS gameplay—so analytics stay clean as audiences roam.citeturn8search0

### @react-three/xr (pmndrs)
- **Why it matters**: Version 6.6 refreshes the XR store API, gives default controller/hand objects, integrates offer-session hints, and exposes new actions such as `enterXR`, `exitXR`, and `nextInteraction`.citeturn16search2
- **Testing boost**: The Immersive React tooling ships an IWER (Inferred World Environment Reconstruction) emulator so you can test plane/mesh detection on desktop before deploying to headsets.citeturn16search1
- **Tip**: Co-locate `<XR>` and `<Canvas>` in the same React tree so state machines (zustand, jotai) can gate 2D vs XR UI from one store.citeturn16search2

### TresJS 5.0
- **Why it matters**: The release debuts a `create-tres` CLI, ESM-only distribution, experimental WebGPU renderer, rebuilt composables, and Nuxt DevTools overlays that visualize scene graphs and performance in real time.citeturn6search1turn6search2
- **DX perks**: Official docs now emphasize slot-based component composition and hot-module reloading, which shortens iteration loops for art teams porting designs from Figma.citeturn6search2
- **Tip**: Combine Tres’s composition API with Nuxt islands to serve WebGL/WebXR canvases only when the client hints that immersive mode is available.citeturn6search2

### wgpuEngine
- **Why it matters**: GTI’s research engine is the first OSS project to run WebGPU and WebXR together end-to-end, shipping compiler updates, WebXR scene samples, and documentation aimed at outside contributors.citeturn7search2
- **Bridging layers**: New JavaScript bindings mean you can embed wgpuEngine as a module in other frameworks (React, Svelte) instead of rewriting your renderer.citeturn7search2
- **Tip**: Expect to run Canary browsers with flags enabled; pair their sample scenes with Chrome’s WebXR sandbox to debug hardware quirks.citeturn7search2

## Choosing Your Stack
- **Match content scale to throughput**: Engines with Gaussian Splat LODs, multi-draw, or WebGPU bindings (PlayCanvas, Babylon.js, wgpuEngine) keep photogrammetry-heavy XR sites performant without external preprocess steps.citeturn5view0turn8search0turn7search2
- **Prioritize authoring experience**: Declarative stacks (A-Frame, TresJS, React Three) lower the learning curve for web teams, while Wonderland and Niantic favor editor-driven flows for non-coders.citeturn10search2turn6search2turn16search2turn16search1turn8search0
- **Plan distribution early**: If you need VPS/location AR or kiosk/native exports, Niantic Studio’s Maps + APK tooling covers that; if you need sub-megabyte builds for spatial browsers, Wonderland’s WASM pipeline is optimized for it.citeturn8search0turn14search3turn16search1
- **Prototype with WebGPU in mind**: Picking engines already experimenting with WGSL/WebGPU (Babylon, TresJS, wgpuEngine) makes it easier to flip on next-gen rendering once browsers graduate the APIs.citeturn8search0turn6search1turn7search2

---

**How to use this file**: Revisit quarterly, note release cadences, and align a framework’s strengths (render scale, authoring DX, distribution) with your XR site goals. Add TODO tables here if you need deeper comparisons (pricing, hosting, analytics).
