import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Conversation, Message } from '../types';
import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  sendMessage: (platform: 'linkedin' | 'instagram' | 'images', content: string) => Promise<void>;
  updateMessage: (messageId: string, newContent: string) => void;
  regenerateMessage: (messageId: string) => Promise<void>;
  validateMessage: (messageId: string) => void;
  selectConversation: (id: string) => void;
  newConversation: (platform: 'linkedin' | 'instagram' | 'images') => void;
  deleteConversation: (id: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const STORAGE_KEY = '@chamalloW:conversations';

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load from storage
  useEffect(() => {
    loadConversations();
  }, []);

  // Save to storage
  useEffect(() => {
    if (conversations.length > 0) {
      saveConversations(conversations);
    }
  }, [conversations]);

  const loadConversations = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const hydrated = parsed.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
          messages: c.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        }));
        setConversations(hydrated);
      }
    } catch (e) {
      console.error('Failed to load conversations', e);
    }
  };

  const saveConversations = async (convs: Conversation[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
    } catch (e) {
      console.error('Failed to save conversations', e);
    }
  };

  const currentConversation = conversations.find(c => c.id === currentConversationId) || null;

  const newConversation = (platform: 'linkedin' | 'instagram' | 'images') => {
    const newConv: Conversation = {
      id: uuidv4(),
      platform,
      title: 'Nouvelle conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations(prev => [newConv, ...prev]);
    setCurrentConversationId(newConv.id);
  };

  const selectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(null);
    }
  };

  const sendMessage = async (platform: 'linkedin' | 'instagram' | 'images', content: string) => {
    if (!currentConversationId) return;

    setIsLoading(true);
    
    // Add user message
    const userMsg: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setConversations(prev => prev.map(c => {
      if (c.id === currentConversationId) {
        // Update title if it's the first message
        const title = c.messages.length === 0 ? content.substring(0, 30) + '...' : c.title;
        return {
          ...c,
          title,
          updatedAt: new Date(),
          messages: [...c.messages, userMsg]
        };
      }
      return c;
    }));

    try {
      let aiMsg: Message;

      if (platform === 'images') {
        const response = await api.chatImage(content);
        aiMsg = {
          id: uuidv4(),
          role: 'assistant',
          content: response.content || response.text || '', // Image URL or text
          timestamp: new Date(),
          // If response.type === 'image', content is URL. If text, content is text.
          // We might need to store 'type' in Message or infer from content.
          // For now, let's assume if it starts with http it's an image? Or add 'attachments'.
          // To be consistent with existing Message type, let's use attachments for images.
        };

        if (response.type === 'image' && response.content) {
           aiMsg.content = response.text || "Voici l'image générée.";
           aiMsg.attachments = [{
             id: uuidv4(),
             type: 'image',
             uri: response.content,
             name: 'generated.jpg'
           }];
        } else {
           aiMsg.content = response.text || '';
        }

      } else {
        const response = await api.sendMessage(platform, content, currentConversationId);
        aiMsg = {
          id: uuidv4(),
          role: 'assistant',
          content: response.response,
          timestamp: new Date(),
          score: response.score,
          isEditable: true,
        };
      }

      setConversations(prev => prev.map(c => {
        if (c.id === currentConversationId) {
          return {
            ...c,
            updatedAt: new Date(),
            messages: [...c.messages, aiMsg]
          };
        }
        return c;
      }));

    } catch (error) {
      console.error('Error sending message', error);
      // Handle error (maybe add an error message to chat)
    } finally {
      setIsLoading(false);
    }
  };

  const updateMessage = (messageId: string, newContent: string) => {
    if (!currentConversationId) return;

    setConversations(prev => prev.map(c => {
      if (c.id === currentConversationId) {
        return {
          ...c,
          messages: c.messages.map(m => {
            if (m.id === messageId) {
              return { ...m, content: newContent, editedContent: newContent };
            }
            return m;
          })
        };
      }
      return c;
    }));
  };

  const regenerateMessage = async (messageId: string) => {
    // Logic to regenerate would likely involve calling API again with previous context
    // For now, let's mock it
    if (!currentConversationId) return;
    setIsLoading(true);
    
    try {
       // Find the user prompt before this message
       // This is a simplification
       const conv = conversations.find(c => c.id === currentConversationId);
       const msgIndex = conv?.messages.findIndex(m => m.id === messageId);
       const userMsg = msgIndex && msgIndex > 0 ? conv?.messages[msgIndex - 1] : null;

       if (userMsg) {
         const response = await api.sendMessage(conv!.platform, userMsg.content + " (Regenerate)", currentConversationId);
         
         setConversations(prev => prev.map(c => {
          if (c.id === currentConversationId) {
            return {
              ...c,
              messages: c.messages.map(m => {
                if (m.id === messageId) {
                  return { ...m, content: response.response, score: response.score };
                }
                return m;
              })
            };
          }
          return c;
        }));
       }
    } finally {
      setIsLoading(false);
    }
  };

  const validateMessage = (messageId: string) => {
    // Just visual feedback or move to planning?
    // For now, let's just mark it as not editable maybe?
    if (!currentConversationId) return;

    setConversations(prev => prev.map(c => {
      if (c.id === currentConversationId) {
        return {
          ...c,
          messages: c.messages.map(m => {
            if (m.id === messageId) {
              return { ...m, isEditable: false }; // Lock it?
            }
            return m;
          })
        };
      }
      return c;
    }));
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      currentConversation,
      isLoading,
      sendMessage,
      updateMessage,
      regenerateMessage,
      validateMessage,
      selectConversation,
      newConversation,
      deleteConversation
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
