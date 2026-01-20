// Conversation
export interface Conversation {
  id: string;
  platform: 'linkedin' | 'instagram' | 'images';
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// Message
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isEditable?: boolean;
  editedContent?: string;
  score?: number; // Score IA du post
  attachments?: Attachment[];
}

// Attachment
export interface Attachment {
  id: string;
  type: 'image' | 'pdf' | 'document';
  uri: string;
  name: string;
}

// Planning
export interface PlanningConfig {
  platform: 'linkedin' | 'instagram' | 'images';
  days: number[]; // 0-6 (dimanche-samedi)
  time: string; // "HH:mm"
  contentType: 'motivation' | 'conseil' | 'temoignage' | 'promo' | 'random';
  notifyOnReady: boolean;
  requireValidation: boolean;
}

// Agent Config
export interface AgentConfig {
  instructions: string[];
  documents: Document[];
  keywords: string[];
  updatedAt: Date;
}

// Document
export interface Document {
  id: string;
  name: string;
  uri: string;
  type: string;
  uploadedAt: Date;
}

// Generated Image
export interface GeneratedImage {
  id: string;
  prompt: string;
  uri: string;
  style: string;
  format: '1:1' | '4:5' | '16:9';
  createdAt: Date;
}
