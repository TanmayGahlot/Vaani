/**
 * ModelManager - Offline Model Downloader & Storage Lifecycle
 * Handles one-time on-device downloads for:
 * 1. OpenWakeWord "vaani" model (~5 MB)
 * 2. Whisper.rn Tiny Multilingual model (~75 MB)
 * 3. Gemma 4 E4B Q4_K_M GGUF (~2.1 GB)
 */

import { MODEL_URLS } from '../utils/constants';

export interface ModelInfo {
  id: 'wakeword' | 'whisper' | 'llm';
  name: string;
  size: string;
  sizeBytes: number;
  url: string;
  localPath: string;
  isDownloaded: boolean;
}

class ModelManager {
  private models: Record<string, ModelInfo> = {
    wakeword: {
      id: 'wakeword',
      name: 'Vaani Wake Word Model',
      size: '5.2 MB',
      sizeBytes: 5.2 * 1024 * 1024,
      url: MODEL_URLS.wakeword,
      localPath: 'assets/models/vaani_wakeword.onnx',
      isDownloaded: false,
    },
    whisper: {
      id: 'whisper',
      name: 'Whisper Multilingual STT',
      size: '75.4 MB',
      sizeBytes: 75.4 * 1024 * 1024,
      url: MODEL_URLS.whisper,
      localPath: 'assets/models/ggml-tiny-multilingual.bin',
      isDownloaded: false,
    },
    llm: {
      id: 'llm',
      name: 'Gemma 4 Edge LLM (Q4_K_M)',
      size: '2.14 GB',
      sizeBytes: 2.14 * 1024 * 1024 * 1024,
      url: MODEL_URLS.llm,
      localPath: 'assets/models/gemma-4-e4b-q4.gguf',
      isDownloaded: false,
    },
  };

  /**
   * Return list of models with their download status
   */
  async checkModels(): Promise<ModelInfo[]> {
    return Object.values(this.models);
  }

  /**
   * Download a single model with realistic progress callbacks
   */
  async downloadModel(
    modelId: 'wakeword' | 'whisper' | 'llm',
    onProgress: (progress: number) => void
  ): Promise<string> {
    const target = this.models[modelId];
    if (!target) {throw new Error(`Unknown model ${modelId}`);}

    console.log(`[ModelManager] Starting download for ${target.name}`);

    // In production, uses react-native-fs or expo-file-system downloadResumable
    // Simulated realistic stream download for progress demonstration
    return new Promise((resolve) => {
      let current = 0;
      const interval = setInterval(() => {
        current += modelId === 'wakeword' ? 0.25 : modelId === 'whisper' ? 0.12 : 0.05;
        if (current >= 1) {
          clearInterval(interval);
          target.isDownloaded = true;
          onProgress(1.0);
          resolve(target.localPath);
        } else {
          onProgress(parseFloat(current.toFixed(2)));
        }
      }, 120);
    });
  }

  /**
   * Download all 3 models in sequence
   */
  async downloadAllModels(
    onProgress: (modelId: 'wakeword' | 'whisper' | 'llm', progress: number) => void
  ): Promise<void> {
    await this.downloadModel('wakeword', (p) => onProgress('wakeword', p));
    await this.downloadModel('whisper', (p) => onProgress('whisper', p));
    await this.downloadModel('llm', (p) => onProgress('llm', p));
  }

  getModelPath(modelId: 'wakeword' | 'whisper' | 'llm'): string {
    return this.models[modelId]?.localPath || '';
  }

  async getStorageUsed(): Promise<number> {
    return Object.values(this.models).reduce((acc, m) => (m.isDownloaded ? acc + m.sizeBytes : acc), 0);
  }

  async deleteModel(modelId: string): Promise<void> {
    if (this.models[modelId]) {
      this.models[modelId].isDownloaded = false;
    }
  }
}

export default new ModelManager();
