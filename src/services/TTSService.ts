/**
 * TTSService - Offline Text-to-Speech
 * Bridges to Android native TextToSpeech engine with support for Indian regional voices
 */

import { NativeModules, Platform } from 'react-native';

const { VaaniNativeModule } = NativeModules;

class TTSService {
  private isSpeakingFlag: boolean = false;
  private currentLanguage: string = 'hi-IN';

  async initialize(): Promise<void> {
    console.log('[TTSService] Initialized offline TTS engine');
  }

  async speak(text: string, languageCode: string = 'hi'): Promise<void> {
    if (!text || text.trim().length === 0) {return;}

    this.isSpeakingFlag = true;
    console.log(`[TTSService] Speaking (${languageCode}): "${text}"`);

    if (Platform.OS === 'android' && VaaniNativeModule?.speakText) {
      try {
        await VaaniNativeModule.speakText(text, languageCode);
      } catch (err) {
        console.warn('[TTSService] speakText failed:', err);
      }
    }

    const words = text.split(' ').length;
    const durationMs = Math.max(1200, words * 280);

    return new Promise((resolve) => {
      setTimeout(() => {
        this.isSpeakingFlag = false;
        resolve();
      }, durationMs);
    });
  }

  stop(): void {
    this.isSpeakingFlag = false;
    console.log('[TTSService] Stopped speaking');
    if (Platform.OS === 'android' && VaaniNativeModule?.stopSpeaking) {
      VaaniNativeModule.stopSpeaking().catch(() => {});
    }
  }

  setLanguage(languageCode: string): void {
    this.currentLanguage = languageCode;
  }

  isSpeaking(): boolean {
    return this.isSpeakingFlag;
  }
}

export default new TTSService();
