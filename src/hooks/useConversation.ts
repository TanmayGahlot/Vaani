/**
 * useConversation - Hook for managing conversation chat messages
 */

import { useState, useCallback } from 'react';
import { useAppStore } from '../store/appStore';

export function useConversation() {
  const conversationHistory = useAppStore((state) => state.conversationHistory);
  const addMessageToStore = useAppStore((state) => state.addMessage);
  const clearHistory = useAppStore((state) => state.clearHistory);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const addUserMessage = useCallback((text: string) => {
    addMessageToStore('user', text);
  }, [addMessageToStore]);

  const addAssistantMessage = useCallback((text: string) => {
    addMessageToStore('assistant', text);
  }, [addMessageToStore]);

  return {
    messages: conversationHistory,
    addUserMessage,
    addAssistantMessage,
    clearHistory,
    isTyping,
    setIsTyping,
  };
}
