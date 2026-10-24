/**
 * TTSService - Offline Text-to-Speech
 * Uses Android native TextToSpeech engine with support for Indian regional voices
 */

class TTSService {
  private isSpeakingFlag: boolean = false;
  private currentLanguage: string = 'hi-IN';
  private speechRate: number = 0.95; // slightly slower for better accessibility
  private pitch: number = 1.0;

  async initialize(): Promise<void> {
    console.log('[TTSService] Initialized offline TTS engine');
    // In production with react-native-tts:
    // Tts.setDefaultLanguage(this.currentLanguage);
    // Tts.setDefaultRate(this.speechRate);
  }

  async speak(text: string, languageCode: string = 'hi'): Promise<void> {
    if (!text || text.trim().length === 0) {return;}

    this.isSpeakingFlag = true;
    console.log(`[TTSService] Speaking (${languageCode}): "${text}"`);

    // In production:
    // const locale = this.mapLanguageToLocale(languageCode);
    // await Tts.setDefaultLanguage(locale);
    // await Tts.speak(text);

    // Simulated speech duration based on word count
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
    // Tts.stop();
  }

  setRate(rate: number): void {
    this.speechRate = rate;
  }

  setPitch(pitch: number): void {
    this.pitch = pitch;
  }

  setLanguage(languageCode: string): void {
    this.currentLanguage = this.mapLanguageToLocale(languageCode);
  }

  isSpeaking(): boolean {
    return this.isSpeakingFlag;
  }

  private mapLanguageToLocale(code: string): string {
    switch (code) {
      case 'hi':
        return 'hi-IN';
      case 'ta':
        return 'ta-IN';
      case 'te':
        return 'te-IN';
      case 'bn':
        return 'bn-IN';
      case 'mr':
        return 'mr-IN';
      case 'gu':
        return 'gu-IN';
      case 'kn':
        return 'kn-IN';
      case 'ml':
        return 'ml-IN';
      case 'pa':
        return 'pa-IN';
      default:
        return 'en-IN';
    }
  }
}

export default new TTSService();
