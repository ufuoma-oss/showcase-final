

export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export enum MediaType {
  IMAGE = 'image'
}

export interface Attachment {
  type: MediaType;
  url: string;
  data: string; // Base64
  mimeType: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  attachments?: Attachment[];
  timestamp: number;
  isThinking?: boolean;
  options?: string[]; // For choice chips in onboarding
}

export interface BrandProfile {
  name: string;
  description: string;
  industry: string;
  tone: string;
  logoUrl?: string; // Base64
  applyBrandTone?: boolean; // New toggle preference
}

export enum ImageAspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '3:4',
  LANDSCAPE = '4:3',
  STORY = '9:16',
  WIDE = '16:9',
  CINEMA = '21:9'
}

export enum ImageResolution {
  R1K = '1K',
  R2K = '2K',
  R4K = '4K'
}