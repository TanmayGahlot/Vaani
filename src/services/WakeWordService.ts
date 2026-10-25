/**
 * WakeWordService - Wake word detection service for Vaani
 *
 * Uses react-native-openwakeword under the hood for on-device wake word detection.
 * Currently provides a mock implementation with a development timer trigger.
 *
 * TODO: Integrate actual react-native-openwakeword native module
 * TODO: Support custom wake word model training
 * TODO: Add VAD (Voice Activity Detection) pre-filtering
 */

export interface WakeWordConfig {
  /** Path to the wake word model file on device */
  modelPath: string;
  /** Detection threshold (0.0 - 1.0), higher = more strict */
  threshold: number;
  /** Whether wake word detection is enabled */
  enabled: boolean;
}

const DEFAULT_CONFIG: WakeWordConfig = {
  modelPath: '',
  threshold: 0.5,
  enabled: true,
};

class WakeWordService {
  private isInitialized: boolean = false;
  private isListening: boolean = false;
  private onWakeCallback: (() => void) | null = null;
  private config: WakeWordConfig = { ...DEFAULT_CONFIG };
  private mockTimerId: ReturnType<typeof setInterval> | null = null;

  // TODO: Replace with actual openwakeword context
  // private wakeWordContext: any = null;

  /**
   * Initialize the wake word detection engine.
   * Loads the model file and prepares the audio pipeline.
   *
   * @param config - Wake word configuration
   * @throws Error if model file not found or initialization fails
   */
  async initialize(config: WakeWordConfig): Promise<void> {
    if (this.isInitialized) {
      console.warn('[WakeWordService] Already initialized, cleaning up first');
      await this.cleanup();
    }

    this.config = { ...config };

    // TODO: Actual openwakeword initialization
    // const OpenWakeWord = require('react-native-openwakeword').default;
    // this.wakeWordContext = await OpenWakeWord.initialize({
    //   modelPath: config.modelPath,
    //   threshold: config.threshold,
    // });

    // Mock: simulate initialization delay
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 200));

    this.isInitialized = true;
    console.log('[WakeWordService] Initialized with config:', {
      modelPath: config.modelPath,
      threshold: config.threshold,
      enabled: config.enabled,
    });
  }

  /**
   * Start listening for the wake word.
   * Begins audio capture and runs detection in the background.
   *
   * @throws Error if not initialized
   */
  async startListening(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize(this.config);
    }

    if (this.isListening) {
      console.warn('[WakeWordService] Already listening');
      return;
    }

    if (!this.config.enabled) {
      console.log('[WakeWordService] Wake word detection is disabled');
      return;
    }

    // TODO: Start actual openwakeword listening
    // await this.wakeWordContext.startListening({
    //   onDetected: () => {
    //     if (this.onWakeCallback) {
    //       this.onWakeCallback();
    //     }
    //   },
    // });

    // Mock: In development, simulate wake word detection with a periodic check
    // This does NOT auto-trigger - it only sets up the listener.
    // Use triggerMockWakeWord() or the dev UI button to simulate detection.
    this.isListening = true;
    console.log('[WakeWordService] Started listening for wake word');
  }

  /**
   * Stop listening for the wake word.
   * Releases the audio capture resources.
   */
  async stopListening(): Promise<void> {
    if (!this.isListening) {
      return;
    }

    // TODO: Stop actual openwakeword listening
    // await this.wakeWordContext?.stopListening();

    // Mock: clear any mock timer
    if (this.mockTimerId) {
      clearInterval(this.mockTimerId);
      this.mockTimerId = null;
    }

    this.isListening = false;
    console.log('[WakeWordService] Stopped listening');
  }

  /**
   * Register a callback for when the wake word is detected.
   *
   * @param callback - Function to call when wake word is detected
   */
  onWakeWordDetected(callback: () => void): void {
    this.onWakeCallback = callback;
    console.log('[WakeWordService] Wake word callback registered');
  }

  /**
   * Update the detection threshold.
   * Higher values require a more confident match (fewer false positives).
   *
   * @param threshold - Detection threshold (0.0 - 1.0)
   */
  setThreshold(threshold: number): void {
    if (threshold < 0 || threshold > 1) {
      throw new Error('[WakeWordService] Threshold must be between 0 and 1');
    }

    this.config.threshold = threshold;

    // TODO: Update actual openwakeword threshold
    // this.wakeWordContext?.setThreshold(threshold);

    console.log('[WakeWordService] Threshold updated to:', threshold);
  }

  /**
   * Clean up all resources. Must be called when the service is no longer needed.
   */
  async cleanup(): Promise<void> {
    await this.stopListening();

    // TODO: Release openwakeword resources
    // await this.wakeWordContext?.release();
    // this.wakeWordContext = null;

    this.isInitialized = false;
    this.onWakeCallback = null;
    this.config = { ...DEFAULT_CONFIG };
    console.log('[WakeWordService] Cleaned up');
  }

  /**
   * Check if the service is currently listening.
   */
  getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Check if the service is initialized.
   */
  getIsInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Mock: Trigger the wake word callback as if the wake word was detected.
   * Used for development and testing.
   */
  triggerMockWakeWord(): void {
    if (!this.isListening) {
      console.warn('[WakeWordService] Not listening, cannot trigger mock wake word');
      return;
    }

    console.log('[WakeWordService] Mock wake word detected!');
    if (this.onWakeCallback) {
      this.onWakeCallback();
    }
  }

  /**
   * Mock: Start a periodic mock trigger for development.
   * Simulates wake word detection every `intervalMs` milliseconds.
   *
   * @param intervalMs - Interval between mock triggers (default 15000ms)
   */
  startMockPeriodicTrigger(intervalMs: number = 15000): void {
    if (this.mockTimerId) {
      clearInterval(this.mockTimerId);
    }

    this.mockTimerId = setInterval(() => {
      if (this.isListening && this.onWakeCallback) {
        console.log('[WakeWordService] Mock periodic wake word trigger');
        this.onWakeCallback();
      }
    }, intervalMs);

    console.log(`[WakeWordService] Mock periodic trigger started (${intervalMs}ms)`);
  }
}

export default new WakeWordService();
