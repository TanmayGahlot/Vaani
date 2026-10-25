/**
 * SpeechService - Real Microphone Speech-to-Text
 * Bridges to Android Native SpeechRecognizer for real-time mic audio recognition
 */

import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { VaaniNativeModule } = NativeModules;

export interface TranscriptionResult {
  text: string;
  language: string;
  confidence: number;
  durationMs: number;
}

class SpeechService {
  private isRecording: boolean = false;
  private currentLanguage: string = 'en';
  private lastRecognizedText: string = '';
  private eventEmitter: NativeEventEmitter | null = null;
  private startTime: number = 0;

  private onResultCallback: ((text: string) => void) | null = null;
  private onPartialCallback: ((text: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;

  constructor() {
    if (Platform.OS === 'android' && VaaniNativeModule) {
      this.eventEmitter = new NativeEventEmitter(VaaniNativeModule);
      this.setupEventListeners();
    }
  }

  private setupEventListeners(): void {
    if (!this.eventEmitter) {
      return;
    }

    this.eventEmitter.addListener('onSpeechResults', (event: { text?: string; matches?: string[] }) => {
      const text = (event.text || (event.matches && event.matches[0]) || '').trim();
      console.log(`[SpeechService] onSpeechResults: "${text}"`);
      this.lastRecognizedText = text;
      this.isRecording = false;

      if (this.onResultCallback) {
        this.onResultCallback(text);
      }
    });

    this.eventEmitter.addListener('onSpeechPartialResults', (event: { text?: string }) => {
      const partial = (event.text || '').trim();
      if (partial) {
        this.lastRecognizedText = partial;
        if (this.onPartialCallback) {
          this.onPartialCallback(partial);
        }
      }
    });

    this.eventEmitter.addListener('onSpeechError', (event: { code: number; message: string }) => {
      console.warn(`[SpeechService] onSpeechError: [${event.code}] ${event.message}`);
      this.isRecording = false;

      // If any words were already recognized during the session, process them!
      if (this.lastRecognizedText && this.lastRecognizedText.trim().length > 0) {
        console.log(`[SpeechService] Using captured partial speech despite error: "${this.lastRecognizedText}"`);
        if (this.onResultCallback) {
          this.onResultCallback(this.lastRecognizedText);
        }
        return;
      }

      if (this.onErrorCallback) {
        const userMsg = event.code === 7
          ? 'No speech detected. Tap a quick command or try speaking into your mic.'
          : (event.message || 'Speech recognition error');
        this.onErrorCallback(userMsg);
      }
    });
  }

  setOnResultListener(listener: ((text: string) => void) | null): void {
    this.onResultCallback = listener;
  }

  setOnPartialListener(listener: ((text: string) => void) | null): void {
    this.onPartialCallback = listener;
  }

  setOnErrorListener(listener: ((error: string) => void) | null): void {
    this.onErrorCallback = listener;
  }

  setLanguage(languageCode: string): void {
    this.currentLanguage = languageCode;
  }

  getLanguage(): string {
    return this.currentLanguage;
  }

  getIsRecording(): boolean {
    return this.isRecording;
  }

  /**
   * Start live microphone speech recognition
   */
  async startRecording(): Promise<void> {
    if (this.isRecording) {
      return;
    }

    this.isRecording = true;
    this.lastRecognizedText = '';
    this.startTime = Date.now();

    console.log(`[SpeechService] Starting microphone recognition for language: ${this.currentLanguage}`);

    if (Platform.OS === 'android' && VaaniNativeModule?.startSpeechRecognition) {
      try {
        await VaaniNativeModule.startSpeechRecognition(this.currentLanguage);
      } catch (err) {
        console.error('[SpeechService] startSpeechRecognition failed:', err);
        this.isRecording = false;
        if (this.onErrorCallback) {
          this.onErrorCallback('Could not open microphone');
        }
      }
    }
  }

  /**
   * Manually stop recording (forces recognition completion)
   */
  async stopRecording(): Promise<TranscriptionResult> {
    this.isRecording = false;
    console.log('[SpeechService] Stopping microphone recognition');

    if (Platform.OS === 'android' && VaaniNativeModule?.stopSpeechRecognition) {
      try {
        await VaaniNativeModule.stopSpeechRecognition();
      } catch (e) {
        console.warn('[SpeechService] stopSpeechRecognition warning:', e);
      }
    }

    return {
      text: this.lastRecognizedText,
      language: this.currentLanguage,
      confidence: this.lastRecognizedText ? 0.95 : 0.0,
      durationMs: Date.now() - this.startTime,
    };
  }

  async cleanup(): Promise<void> {
    this.isRecording = false;
    this.onResultCallback = null;
    this.onPartialCallback = null;
    this.onErrorCallback = null;
    if (Platform.OS === 'android' && VaaniNativeModule?.cancelSpeechRecognition) {
      try {
        await VaaniNativeModule.cancelSpeechRecognition();
      } catch (_e) {}
    }
  }
}

export default new SpeechService();
