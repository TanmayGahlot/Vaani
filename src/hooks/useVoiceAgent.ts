/**
 * useVoiceAgent - Primary Orchestration Hook
 * Manages the full cycle:
 * [Wake Word "Vaani" / Mic Tap] -> [Offline STT] -> [Gemma 4 Intent] -> [Phone Action] -> [TTS Voice Response]
 */

import { useState, useCallback, useRef } from 'react';
import { useAppStore } from '../store/appStore';
import SpeechService from '../services/SpeechService';
import LLMService from '../services/LLMService';
import PhoneActionService from '../services/PhoneActionService';
import TTSService from '../services/TTSService';

export function useVoiceAgent() {
  const isListening = useAppStore((state) => state.isListening);
  const isProcessing = useAppStore((state) => state.isProcessing);
  const selectedLanguage = useAppStore((state) => state.selectedLanguage);
  const setListeningInStore = useAppStore((state) => state.setListening);
  const setProcessingInStore = useAppStore((state) => state.setProcessing);
  const addMessage = useAppStore((state) => state.addMessage);
  const setCurrentAction = useAppStore((state) => state.setCurrentAction);

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTranscript, setLastTranscript] = useState<string>('');

  const listeningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Process a text command directly (e.g. from chat input or STT)
   */
  const processVoiceCommand = useCallback(
    async (transcription: string) => {
      if (!transcription || !transcription.trim()) {return;}

      setError(null);
      setProcessingInStore(true);
      addMessage('user', transcription);

      try {
        // Step 1: LLM Reasoning with Gemma 4
        console.log(`[useVoiceAgent] Processing intent with Gemma 4: "${transcription}"`);
        const llmResult = await LLMService.parseIntent(transcription, selectedLanguage);

        // Step 2: Phone Action Execution (if action recognized)
        if (llmResult.action && llmResult.action.type) {
          setCurrentAction({
            type: llmResult.action.type,
            params: llmResult.action.params,
            responseText: llmResult.action.responseText,
          });

          await PhoneActionService.executeAction({
            type: llmResult.action.type,
            params: llmResult.action.params,
          });
        }

        // Step 3: Add Assistant message to chat
        const responseText = llmResult.text || 'काम पूरा हो गया।';
        addMessage('assistant', responseText);

        // Step 4: Speak back via Text-to-Speech
        setIsSpeaking(true);
        await TTSService.speak(responseText, selectedLanguage);
        setIsSpeaking(false);
      } catch (err: any) {
        console.error('[useVoiceAgent] Command processing error:', err);
        setError(err?.message || 'Failed to process command');
        addMessage('assistant', 'माफ़ कीजिए, मैं वह आदेश पूरा नहीं कर पाया।');
      } finally {
        setProcessingInStore(false);
        setCurrentAction(null);
      }
    },
    [selectedLanguage, addMessage, setCurrentAction, setProcessingInStore]
  );

  /**
   * Stop listening manually
   */
  const stopListening = useCallback(async () => {
    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current);
      listeningTimeoutRef.current = null;
    }

    try {
      setListeningInStore(false);
      await SpeechService.stopRecording();
    } catch (err: any) {
      console.error('[useVoiceAgent] Error during voice processing:', err);
      setListeningInStore(false);
      setProcessingInStore(false);
    }
  }, [setListeningInStore, setProcessingInStore]);

  /**
   * Start listening to voice from mic
   */
  const startListening = useCallback(async () => {
    try {
      setError(null);
      setLastTranscript('');
      setListeningInStore(true);
      SpeechService.setLanguage(selectedLanguage);

      SpeechService.setOnPartialListener((partial) => {
        setLastTranscript(partial);
      });

      SpeechService.setOnResultListener(async (finalText) => {
        setListeningInStore(false);
        if (listeningTimeoutRef.current) {
          clearTimeout(listeningTimeoutRef.current);
          listeningTimeoutRef.current = null;
        }

        if (finalText && finalText.trim()) {
          setLastTranscript(finalText);
          await processVoiceCommand(finalText);
        } else {
          setProcessingInStore(false);
          setError('No voice detected. Tap a quick command or try speaking into your mic.');
        }
      });

      SpeechService.setOnErrorListener((errMsg) => {
        setListeningInStore(false);
        setProcessingInStore(false);
        if (listeningTimeoutRef.current) {
          clearTimeout(listeningTimeoutRef.current);
          listeningTimeoutRef.current = null;
        }
        setError(errMsg);
      });

      await SpeechService.startRecording();

      // Safety timeout after 10 seconds of silence
      listeningTimeoutRef.current = setTimeout(() => {
        stopListening();
      }, 10000);
    } catch (err: any) {
      console.error('[useVoiceAgent] Failed to start microphone:', err);
      setListeningInStore(false);
      setError(err?.message || 'Microphone error');
    }
  }, [selectedLanguage, setListeningInStore, setProcessingInStore, processVoiceCommand, stopListening]);

  /**
   * Clear active error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Toggle listening state
   */
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isProcessing,
    isSpeaking,
    error,
    lastTranscript,
    clearError,
    startListening,
    stopListening,
    toggleListening,
    processVoiceCommand,
  };
}
