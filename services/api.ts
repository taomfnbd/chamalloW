import { AgentConfig } from '../types';
import * as FileSystem from 'expo-file-system';

// Configuration
const API_BASE = 'https://your-n8n-webhook.com';
const LINKEDIN_WEBHOOK = 'https://n8nagence.performai.ovh/webhook/450e94d5-e701-4d2c-8f86-826a84b377eb';
const INSTAGRAM_WEBHOOK = 'https://n8nagence.performai.ovh/webhook/8efd9f29-7e93-4c53-b216-25bba85464e2';
const IMAGES_WEBHOOK = 'https://n8nagence.performai.ovh/webhook/9cd8090e-4dfd-447f-b02a-563fd2a9debd';
const USE_MOCK = false; // Set to false to use real API

// Mock delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generic API handler
async function request(endpoint: string, method: 'GET' | 'POST', body?: any, isFullUrl: boolean = false) {
  if (USE_MOCK) return null; // Skip for mock

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
      console.error(`API Error: ${response.status}`, text);
      throw new Error(`API Error: ${response.status} - ${text.substring(0, 100)}`);
    }

    const text = await response.text();
    console.log('Raw API Response:', text.substring(0, 500)); // Log first 500 chars
    try {
      return JSON.parse(text);
    } catch (e) {
      console.warn('Response is not JSON:', text);
      return { response: text, score: 85 };
    }
  };

  try {
    return await doFetch(url);
  } catch (error) {
    console.warn('Direct request failed, trying proxy...', error);
    try {
      // Fallback to CORS proxy
      const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
      return await doFetch(proxyUrl);
    } catch (proxyError) {
      console.error('API Request Failed (even with proxy):', proxyError);
      throw proxyError;
    }
  }
}

export const api = {
  // Chat
  sendMessage: async (platform: string, message: string, conversationId: string, sessionId?: string, attachments?: any[]) => {
    console.log('API sendMessage called with:', { platform, message, conversationId, sessionId, attachments });
    if (!USE_MOCK) {
      if (attachments && attachments.length > 0) {
        const formData = new FormData();
        formData.append('platform', platform);
        formData.append('message', message);
        formData.append('conversationId', conversationId);
        if (sessionId) formData.append('sessionId', sessionId);

        attachments.forEach((att: any) => {
          // On Web, att might have base64 if not Blob? 
          // ChatInput passes base64 on Web. 
          // If we want to support FormData on Web properly, ChatInput should pass the Blob.
          // But constructing FormData with base64 string isn't standard file upload.
          // For now, let's trust that mobile uses URI and Web logic needs review if this fails.
          // React Native FormData handles { uri, name, type } object.
          
          if (att.uri && !att.base64) {
             formData.append('files', {
               uri: att.uri,
               name: att.name,
               type: att.mimeType || 'application/octet-stream',
             } as any);
          } else if (att.base64) {
             // Fallback for Web if ChatInput sends base64
             // We can append it as string or try to convert (complex).
             // Let's send as a string field for now or skip.
             formData.append('file_base64', att.base64);
             formData.append('file_name', att.name);
             formData.append('file_type', att.mimeType);
          }
        });

        console.log('Sending FormData payload');
        if (platform === 'linkedin') return request(LINKEDIN_WEBHOOK, 'POST', formData, true);
        if (platform === 'instagram') return request(INSTAGRAM_WEBHOOK, 'POST', formData, true);
        return request('/chat', 'POST', formData);
      }

      // JSON Fallback for text only
      const payload = { platform, message, conversationId, sessionId };
      console.log('Sending JSON payload:', payload);
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
    console.log('Agent updated:', config);
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
