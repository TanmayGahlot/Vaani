/**
 * useWakeWord - Hook for managing offline wake word ("Vaani") detection
 */

import { useState, useEffect, useCallback } from 'react';
import WakeWordService from '../services/WakeWordService';
import { useAppStore } from '../store/appStore';

export function useWakeWord(onWake?: () => void) {
  const wakeWordEnabled = useAppStore((state) => state.wakeWordEnabled);
  const setWakeWordEnabledInStore = useAppStore((state) => state.setWakeWordEnabled);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [sensitivity, setSensitivity] = useState<number>(0.6);

  useEffect(() => {
    // Register wake word listener
    WakeWordService.onWakeWordDetected(() => {
      console.log('[useWakeWord] "Vaani" trigger caught!');
      if (onWake) {onWake();}
    });

    if (wakeWordEnabled) {
      WakeWordService.startListening()
        .then(() => setIsListening(true))
        .catch(console.error);
    }

    return () => {
      WakeWordService.stopListening().catch(console.error);
    };
  }, [wakeWordEnabled, onWake]);

  const toggleWakeWord = useCallback(async (enabled: boolean) => {
    setWakeWordEnabledInStore(enabled);
    if (enabled) {
      await WakeWordService.startListening();
      setIsListening(true);
    } else {
      await WakeWordService.stopListening();
      setIsListening(false);
    }
  }, [setWakeWordEnabledInStore]);

  const updateSensitivity = useCallback((value: number) => {
    setSensitivity(value);
    WakeWordService.setThreshold(value);
  }, []);

  return {
    isListening,
    wakeWordEnabled,
    sensitivity,
    toggleWakeWord,
    updateSensitivity,
  };
}
