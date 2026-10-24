import {create} from 'zustand';
import {persist, createJSONStorage, StateStorage} from 'zustand/middleware';
import {MMKV} from 'react-native-mmkv';
import {DEFAULT_LANGUAGE} from '../utils/constants';

// ---------------------------------------------------------------------------
// MMKV-backed storage adapter for Zustand persist
// ---------------------------------------------------------------------------
const mmkv = new MMKV({id: 'vaani-app-store'});

const mmkvStorage: StateStorage = {
  getItem: (name: string) => mmkv.getString(name) ?? null,
  setItem: (name: string, value: string) => mmkv.set(name, value),
  removeItem: (name: string) => mmkv.delete(name),
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type MessageRole = 'user' | 'assistant' | 'system';

export interface ConversationMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export type ModelDownloadStatus = 'idle' | 'downloading' | 'done' | 'error';

export interface ModelProgress {
  progress: number; // 0 – 1
  status: ModelDownloadStatus;
}

export interface ModelDownloadProgress {
  whisper: ModelProgress;
  llm: ModelProgress;
  wakeword: ModelProgress;
}

export interface CurrentAction {
  type: string;
  params: Record<string, unknown>;
  responseText: string;
}

// ---------------------------------------------------------------------------
// State & Actions
// ---------------------------------------------------------------------------
export interface AppState {
  // Setup
  isSetupComplete: boolean;
  selectedLanguage: string;

  // Runtime flags
  isListening: boolean;
  isProcessing: boolean;
  isModelLoaded: boolean;
  wakeWordEnabled: boolean;

  // Conversation
  conversationHistory: ConversationMessage[];

  // Model download tracking
  modelDownloadProgress: ModelDownloadProgress;

  // Current action being executed
  currentAction: CurrentAction | null;

  // Actions
  setSetupComplete: (complete: boolean) => void;
  setLanguage: (language: string) => void;
  setListening: (listening: boolean) => void;
  setProcessing: (processing: boolean) => void;
  addMessage: (role: MessageRole, content: string) => void;
  clearHistory: () => void;
  updateModelProgress: (
    model: keyof ModelDownloadProgress,
    progress: number,
    status: ModelDownloadStatus,
  ) => void;
  setModelLoaded: (loaded: boolean) => void;
  setWakeWordEnabled: (enabled: boolean) => void;
  setCurrentAction: (action: CurrentAction | null) => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
const initialModelProgress: ModelDownloadProgress = {
  whisper: {progress: 0, status: 'idle'},
  llm: {progress: 0, status: 'idle'},
  wakeword: {progress: 0, status: 'idle'},
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      isSetupComplete: false,
      selectedLanguage: DEFAULT_LANGUAGE,
      isListening: false,
      isProcessing: false,
      isModelLoaded: false,
      wakeWordEnabled: true,
      conversationHistory: [],
      modelDownloadProgress: initialModelProgress,
      currentAction: null,

      // Actions
      setSetupComplete: (complete) => set({isSetupComplete: complete}),

      setLanguage: (language) => set({selectedLanguage: language}),

      setListening: (listening) => set({isListening: listening}),

      setProcessing: (processing) => set({isProcessing: processing}),

      addMessage: (role, content) =>
        set((state) => ({
          conversationHistory: [
            ...state.conversationHistory,
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
              role,
              content,
              timestamp: Date.now(),
            },
          ],
        })),

      clearHistory: () => set({conversationHistory: []}),

      updateModelProgress: (model, progress, status) =>
        set((state) => ({
          modelDownloadProgress: {
            ...state.modelDownloadProgress,
            [model]: {progress, status},
          },
        })),

      setModelLoaded: (loaded) => set({isModelLoaded: loaded}),

      setWakeWordEnabled: (enabled) => set({wakeWordEnabled: enabled}),

      setCurrentAction: (action) => set({currentAction: action}),
    }),
    {
      name: 'vaani-app-store',
      storage: createJSONStorage(() => mmkvStorage),
      // Only persist user preferences and setup state — not transient flags
      partialize: (state) => ({
        isSetupComplete: state.isSetupComplete,
        selectedLanguage: state.selectedLanguage,
        wakeWordEnabled: state.wakeWordEnabled,
        conversationHistory: state.conversationHistory,
      }),
    },
  ),
);
