import { AgentConfig } from '../types';
import * as FileSystem from 'expo-file-system';

// Configuration
const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://your-n8n-webhook.com';
const LINKEDIN_WEBHOOK = process.env.EXPO_PUBLIC_LINKEDIN_WEBHOOK || '';
const INSTAGRAM_WEBHOOK = process.env.EXPO_PUBLIC_INSTAGRAM_WEBHOOK || '';
const IMAGES_WEBHOOK = process.env.EXPO_PUBLIC_IMAGES_WEBHOOK || '';
const USE_MOCK = false; 

// Mock delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generic API handler
async function request(endpoint: string, method: 'GET' | 'POST', body?: any, isFullUrl: boolean = false) {
  if (USE_MOCK) return null; 

  const url = isFullUrl ? endpoint : `${API_BASE}${endpoint}`;
  
  const doFetch = async (fetchUrl: string) => {
    const headers: any = {
      'Accept': 'application/json',
    };

    let processedBody = body;

    if (!(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      processedBody = body ? JSON.stringify(body) : undefined;
    }

    const response = await fetch(fetchUrl, {
      method,
      headers,
      body: processedBody,
    });

    if (!response.ok) {
      const text = await response.text();
      if (__DEV__) console.error(`API Error: ${response.status}`, text);
      throw new Error(`API Error: ${response.status}`);
    }

    const text = await response.text();
    // if (__DEV__) console.log('Raw API Response:', text.substring(0, 500)); 
    try {
      return JSON.parse(text);
    } catch (e) {
      if (__DEV__) console.warn('Response is not JSON:', text);
      return { response: text, score: 85 };
    }
  };

  try {
    return await doFetch(url);
  } catch (error) {
    if (__DEV__) console.warn('Direct request failed, trying proxy...', error);
    try {
      // Fallback to CORS proxy
      const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
      return await doFetch(proxyUrl);
    } catch (proxyError) {
      if (__DEV__) console.error('API Request Failed (even with proxy):', proxyError);
      throw proxyError;
    }
  }
}

export const api = {
  // Chat
  sendMessage: async (platform: string, message: string, conversationId: string, sessionId?: string, attachments?: any[]) => {
    // if (__DEV__) console.log('API sendMessage called with:', { platform, message, conversationId, sessionId, attachments });
    if (!USE_MOCK) {
      if (attachments && attachments.length > 0) {
        const formData = new FormData();
        formData.append('platform', platform);
        formData.append('message', message);
        formData.append('conversationId', conversationId);
        if (sessionId) formData.append('sessionId', sessionId);

        attachments.forEach((att: any) => {
          if (att.uri && !att.base64) {
             formData.append('files', {
               uri: att.uri,
               name: att.name,
               type: att.mimeType || 'application/octet-stream',
             } as any);
          } else if (att.base64) {
             formData.append('file_base64', att.base64);
             formData.append('file_name', att.name);
             formData.append('file_type', att.mimeType);
          }
        });

        if (platform === 'linkedin') return request(LINKEDIN_WEBHOOK, 'POST', formData, true);
        if (platform === 'instagram') return request(INSTAGRAM_WEBHOOK, 'POST', formData, true);
        return request('/chat', 'POST', formData);
      }

      // JSON Fallback for text only
      const payload = { platform, message, conversationId, sessionId };
      if (platform === 'linkedin') {
        return request(LINKEDIN_WEBHOOK, 'POST', payload, true);
      }
      if (platform === 'instagram') {
        return request(INSTAGRAM_WEBHOOK, 'POST', payload, true);
      }
      return request('/chat', 'POST', payload);
    }

    // Mock Response
    await delay(1500); 
    return {
      response: `Voici une proposition pour ton post ${platform} sur : "${message}"\n\n💪 Les kettlebells sont l'outil ultime pour une transformation physique complète. Pas besoin de passer des heures à la salle...\n\n#Kettlebell #Transformation #Fitness #Marseille`,
      score: Math.floor(Math.random() * 20) + 80 
    };
  },

  // Agent
  updateAgent: async (config: AgentConfig) => {
    if (!USE_MOCK) {
      return request('/agent', 'POST', config);
    }

    await delay(2000);
    if (__DEV__) console.log('Agent updated:', config);
    return { success: true };
  },

  // Images
  generateImage: async (prompt: string, style: string, format: string) => {
    if (!USE_MOCK) {
      return request('/images/generate', 'POST', { prompt, style, format });
    }

    await delay(3000);
    return { 
      imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop'
    };
  },

  chatImage: async (message: string, imageUri?: string, sessionId?: string) => {
    if (!USE_MOCK) {
      // For real image upload, we might need FormData instead of JSON
      return request(IMAGES_WEBHOOK, 'POST', { message, imageUri, sessionId }, true);
    }

    await delay(2000);
    
    const isGeneration = message.toLowerCase().includes('image') || message.toLowerCase().includes('génère') || message.toLowerCase().includes('dessine');

    if (isGeneration) {
      return {
        type: 'image',
        content: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop',
        text: "Voici une proposition basée sur ta demande."
      };
    } else {
      return {
        type: 'text',
        content: null,
        text: "Je peux t'aider à créer des visuels. Décris ce que tu veux voir ou envoie une image de référence !"
      };
    }
  }
};
