/**
 * Vaani App Constants
 */

export const APP_NAME = 'Vaani';

export const WAKE_WORD = 'vaani';

/** Placeholder model URLs — replace with actual hosted URLs before release */
export const MODEL_URLS = {
  /** Gemma 4 GGUF model for on-device LLM inference */
  llm: 'https://huggingface.co/google/gemma-4-placeholder/resolve/main/gemma-4.gguf',
  /** Whisper tiny multilingual model for speech-to-text */
  whisper:
    'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny-multilingual.bin',
  /** OpenWakeWord model for wake-word detection */
  wakeword:
    'https://github.com/dscripka/openWakeWord/releases/download/v0.6.0/vaani_wakeword.onnx',
} as const;

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  {code: 'hi', name: 'Hindi', nativeName: 'हिन्दी'},
  {code: 'en', name: 'English', nativeName: 'English'},
  {code: 'ta', name: 'Tamil', nativeName: 'தமிழ்'},
  {code: 'te', name: 'Telugu', nativeName: 'తెలుగు'},
  {code: 'bn', name: 'Bengali', nativeName: 'বাংলা'},
  {code: 'mr', name: 'Marathi', nativeName: 'मराठी'},
  {code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી'},
  {code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ'},
  {code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം'},
  {code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ'},
];

export const DEFAULT_LANGUAGE = 'hi';

/** LLM inference configuration */
export const LLM_CONFIG = {
  /** Context window size in tokens */
  n_ctx: 2048,
  /** Number of CPU threads for inference */
  n_threads: 4,
  /** Sampling temperature */
  temperature: 0.7,
  /** Maximum tokens to generate */
  max_tokens: 256,
} as const;
