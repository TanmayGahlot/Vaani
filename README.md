# 🎙️ वाणी (Vaani) — Offline Voice Agent for Android

> **Your Voice. Your Language. Your Phone.**  
> An entirely offline, on-device AI voice agent powered by Google’s **Gemma 4**, designed for the millions of people who cannot reliably use a touchscreen.

---

## 🌟 Overview

Millions of people struggle with touchscreens due to physical, motor, or visual impairments, language barriers, or situational constraints. Mainstream voice assistants (Siri, Google Assistant, Alexa) are English-first, expensive, and require a constant internet connection that compromises privacy and fails in rural or disconnected environments.

**Vaani** is a completely offline, autonomous voice agent built with **React Native** and **Android Native Services**. It listens 24/7 for the spoken wake word **"Vaani"**, transcribes speech in your native Indian language, uses on-device **Gemma 4** reasoning to understand intent, and executes actions across your phone (WhatsApp messaging, phone calls, opening apps, setting alarms, navigating) via **Android Accessibility Services**—without touching the screen once.

---

## 🏗️ Architecture

```
                                 [ User Speaks "Vaani" ]
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │    Android 24/7 Foreground Service          │
                    │   (OpenWakeWord TFLite/ONNX — ~5% CPU)       │
                    └──────────────────────┬───────────────────────┘
                                           │ Wake Triggered
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │   Siri-Style Translucent Glow Overlay / UI   │
                    └──────────────────────┬───────────────────────┘
                                           │ Audio Stream
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │     Offline Multilingual Speech-to-Text      │
                    │     (whisper.rn / Vosk — Hindi, Tamil, etc.) │
                    └──────────────────────┬───────────────────────┘
                                           │ Transcribed Text
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │            Gemma 4 Edge LLM                  │
                    │     (llama.rn GGUF Q4_K_M via llama.cpp)     │
                    │       Extracts Structured JSON Intent        │
                    └──────────────┬───────────────────────────────┘
                                   │
                 ┌─────────────────┴─────────────────┐
                 ▼                                   ▼
┌─────────────────────────────────┐ ┌─────────────────────────────────┐
│ Android Accessibility Service   │ │ Offline Android TTS Engine      │
│ Automates clicks, gestures,     │ │ Speaks natural voice response   │
│ WhatsApp & phone dialler        │ │ back in user's mother tongue    │
└─────────────────────────────────┘ └─────────────────────────────────┘
```

---

## 📱 Models & Device Footprint

All models are downloaded once during initial setup and stored locally inside the app sandbox:

| Component | Model / Engine | Size | Format |
|---|---|---|---|
| **Wake Word Engine** | OpenWakeWord ("vaani") | ~5.2 MB | `.tflite` / `.onnx` |
| **Speech-to-Text** | Whisper Tiny Multilingual | ~75.4 MB | GGML quantized `.bin` |
| **Edge Brain** | Gemma 4 E4B Instruct | ~2.14 GB | GGUF `Q4_K_M` |
| **Text-to-Speech** | Android Native TTS | Built-in | System Voices |
| **Total Download** | | **~2.2 GB** | *One-time offline storage* |

---

## 🎨 UI Design (Inspired by Reference Concepts)

1. **Floating Glow Overlay (Siri Style)**:
   - Floating notification card displaying active messages (e.g. *"Aga sent you a message about Calathea..."*).
   - Bottom translucent glowing orb and waveform equalizer bar that illuminates when the user speaks.
2. **Main Dashboard**:
   - Modern glassmorphic cards: **Translate**, **Audio Chat**, **Voice Call**, **Phone Control**.
   - Interactive conversation bubble history with timestamps and assistant responses.
   - 2-column native Indian language selector (हिन्दी, தமிழ், తెలుగు, বাংলা, मराठी, etc.).

---

## 📂 Project Structure

```text
Vaani/
├── android/
│   └── app/src/main/
│       ├── AndroidManifest.xml                    # Permissions & service declarations
│       ├── res/xml/accessibility_service_config.xml
│       └── java/com/vaani/
│           ├── accessibility/
│           │   └── VaaniAccessibilityService.kt   # Hands-free phone control
│           ├── foreground/
│           │   ├── VaaniWakeWordService.kt        # 24/7 background "Vaani" listener
│           │   └── BootReceiver.kt                # Auto-start on device reboot
│           └── modules/
│               ├── VaaniNativeModule.kt           # React Native JSI bridge
│               └── VaaniPackage.kt
├── src/
│   ├── App.tsx                                    # Main entry component
│   ├── navigation/
│   │   └── AppNavigator.tsx                       # Onboarding & Main Stack navigation
│   ├── screens/
│   │   ├── WelcomeScreen.tsx                      # Intro & value prop
│   │   ├── LanguageSelectScreen.tsx               # Regional language grid
│   │   ├── ModelDownloadScreen.tsx                # One-time model manager & progress
│   │   ├── PermissionsScreen.tsx                  # Mic, Accessibility, Overlay setup
│   │   ├── SetupCompleteScreen.tsx                # Success & quick sample prompts
│   │   ├── HomeScreen.tsx                         # Glassmorphic Siri/card interface
│   │   └── SettingsScreen.tsx                     # Wake word sensitivity & storage
│   ├── components/
│   │   ├── VoiceOrb.tsx                           # Glowing pulsating microphone button
│   │   ├── ChatBubble.tsx                         # Translucent chat cards
│   │   ├── QuickActions.tsx                       # Action cards
│   │   ├── WaveformVisualizer.tsx                 # Animated equalizer bars
│   │   ├── LanguageCard.tsx                       # Language picker card
│   │   ├── ProgressBar.tsx                        # Gradient progress bar
│   │   └── GradientButton.tsx                     # Reusable glass CTA button
│   ├── services/
│   │   ├── WakeWordService.ts                     # OpenWakeWord engine interface
│   │   ├── SpeechService.ts                       # Whisper multilingual STT
│   │   ├── LLMService.ts                          # Gemma 4 intent extractor
│   │   ├── TTSService.ts                          # Regional voice speech synthesizer
│   │   ├── PhoneActionService.ts                  # Accessibility execution bridge
│   │   └── ModelManager.ts                        # Storage & model downloader
│   ├── hooks/
│   │   ├── useVoiceAgent.ts                       # Central reactive orchestrator
│   │   ├── useWakeWord.ts                         # Background wake word hook
│   │   └── useConversation.ts                     # Chat message state manager
│   ├── store/
│   │   └── appStore.ts                            # MMKV-backed Zustand store
│   ├── theme/
│   │   ├── theme.ts                               # Color palette, spacing, typography
│   │   └── glassmorphic.ts                        # Reusable frosted glass styles
│   └── utils/
│       ├── constants.ts                           # Supported languages & configs
│       └── prompts.ts                             # Gemma 4 structured intent prompts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- Android Studio with Android SDK 34 & NDK
- An Android Device (or Emulator with microphone enabled)

### Installation
```bash
cd Vaani
npm install
```

### Run on Android
```bash
npm run android
```

---

## 🏆 Hacktoberfest 2026 Entry

- **Challenge:** [Hacktoberfest Open-Source AI Challenge: Week 3 ("Slow and Steady")](https://dev.to/challenges/hf26)
- **Tag:** `#hf26challenge`
- **Category:** **Best Use of Gemma** ($200) & Overall Prize ($250)
- **Theme Fit:** A fully autonomous edge agent that eliminates phone friction, performing tedious device tasks so the user doesn't have to.
