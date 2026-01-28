import { PlanningConfig, AgentConfig } from '../types';

// Configuration
const API_BASE = 'https://your-n8n-webhook.com';
const LINKEDIN_WEBHOOK = 'https://n8nagence.performai.ovh/webhook/450e94d5-e701-4d2c-8f86-826a84b377eb';
const INSTAGRAM_WEBHOOK = 'https://n8nagence.performai.ovh/webhook/8efd9f29-7e93-4c53-b216-25bba85464e2';
const USE_MOCK = false; // Set to false to use real API

// Mock delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generic API handler
async function request(endpoint: string, method: 'GET' | 'POST', body?: any, isFullUrl: boolean = false) {
  if (USE_MOCK) return null; // Skip for mock

  try {
    const url = isFullUrl ? endpoint : `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ...' // Add token here if needed
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Failed:', error);
    throw error;
  }
}

export const api = {
  // Chat
  sendMessage: async (platform: string, message: string, conversationId: string) => {
    if (!USE_MOCK) {
      if (platform === 'linkedin') {
        return request(LINKEDIN_WEBHOOK, 'POST', { platform, message, conversationId }, true);
      }
      if (platform === 'instagram') {
        return request(INSTAGRAM_WEBHOOK, 'POST', { platform, message, conversationId }, true);
      }
      return request('/chat', 'POST', { platform, message, conversationId });
    }

    // Mock Response
    await delay(1500); 
    return {
      response: `Voici une proposition pour ton post ${platform} sur : "${message}"\n\n💪 Les kettlebells sont l'outil ultime pour une transformation physique complète. Pas besoin de passer des heures à la salle...\n\n#Kettlebell #Transformation #Fitness #Marseille`,
      score: Math.floor(Math.random() * 20) + 80 
    };
  },

  // Planning
  updatePlanning: async (config: PlanningConfig) => {
    if (!USE_MOCK) {
      return request('/planning', 'POST', config);
    }

    await delay(1000);
    console.log('Planning updated:', config);
    return { success: true };
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

  chatImage: async (message: string, imageUri?: string) => {
    if (!USE_MOCK) {
      // For real image upload, we might need FormData instead of JSON
      return request('/chat/image', 'POST', { message, imageUri });
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
