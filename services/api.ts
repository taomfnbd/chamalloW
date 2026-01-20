import { PlanningConfig, AgentConfig } from '../types';

const API_BASE = 'https://your-n8n-webhook.com';

// Mock delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Chat
  sendMessage: async (platform: string, message: string, conversationId: string) => {
    // POST /webhook/chat
    await delay(1500); // Simulate network delay
    
    // Mock response
    return {
      response: `Voici une proposition pour ton post ${platform} sur : "${message}"\n\n💪 Les kettlebells sont l'outil ultime pour une transformation physique complète. Pas besoin de passer des heures à la salle...\n\n#Kettlebell #Transformation #Fitness #Marseille`,
      score: Math.floor(Math.random() * 20) + 80 // 80-99
    };
  },

  // Planning
  updatePlanning: async (config: PlanningConfig) => {
    await delay(1000);
    console.log('Planning updated:', config);
    return { success: true };
  },

  // Agent
  updateAgent: async (config: AgentConfig) => {
    await delay(2000);
    console.log('Agent updated:', config);
    return { success: true };
  },

  // Images
  generateImage: async (prompt: string, style: string, format: string) => {
    await delay(3000);
    // Return a placeholder image
    return { 
      imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop'
    };
  },

  chatImage: async (message: string, imageUri?: string) => {
    await delay(2000);
    
    // Logic to decide if we generate an image or text
    // Mock: If message contains "image" or "génère", generate image. Else text.
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
