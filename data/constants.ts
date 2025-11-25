
import { 
  Shirt, User, Camera, Box, Layers, Cloud, Sun, ScanLine, Armchair, MapPin, 
  Ticket, Sparkles, Calendar, Megaphone, LayoutGrid, Zap, PaintBucket, Factory, History
} from 'lucide-react';

// --- ECONOMY CONFIG ---
export const COST_IMAGE_GEN = 60; 
export const INITIAL_FREE_CREDITS = 120; 

// --- PRICING ---
export const PRICING_PLANS = {
    SUBSCRIPTION: {
        PRICE: '₦5,000',
        CREDITS: 1000 // ~16 Images @ 60 credits/img
    },
    TOP_UP: {
        STARTER: { CREDITS: 600, PRICE: '₦3,000' }, // ~10 Images
        PRO: { CREDITS: 2000, PRICE: '₦10,000' },    // ~33 Images
        EMPIRE: { CREDITS: 4000, PRICE: '₦20,000' } // ~66 Images
    }
};

// --- TEMPLATE DATA ---

export const FASHION_MODELS = [
  { id: 'ghost', label: 'Ghost Mannequin', icon: Shirt, desc: 'Invisible fit' },
  { id: 'black-ghost', label: 'Black Mannequin', icon: Shirt, desc: 'Dark stealth fit' },
  { id: 'nigerian-f', label: 'Female Model', icon: User, desc: 'Editorial look' },
  { id: 'nigerian-m', label: 'Male Model', icon: User, desc: 'Sharp look' },
  { id: 'diverse', label: 'Group Shot', icon: User, desc: 'Urban vibe' },
  { id: 'custom-model', label: 'My Model', icon: Camera, desc: 'Upload Own' },
];

export const FASHION_LOCATIONS = [
  { id: 'studio', label: 'Studio', icon: Box, desc: 'Clean background' },
  { id: 'luxury', label: 'Luxury', icon: Armchair, desc: 'Penthouse' },
  { id: 'street', label: 'Street', icon: MapPin, desc: 'Lagos vibes' },
  { id: 'runway', label: 'Runway', icon: Layers, desc: 'Fashion Show' },
  { id: 'industrial', label: 'Industrial', icon: Factory, desc: 'Raw concrete' },
  { id: 'vintage', label: 'Vintage', icon: History, desc: 'Retro aesthetic' },
  { id: 'custom', label: 'Custom', icon: ScanLine, desc: 'Your image' },
];

export const PRODUCT_PLACEMENTS = [
  { id: 'studio-pro', label: 'Pro Studio', icon: Camera, desc: 'Controlled Light' },
  { id: 'influencer', label: 'Influencer', icon: User, desc: 'Model Holding It' },
  { id: 'podium', label: 'Podium', icon: Box, desc: 'Minimalist' },
  { id: 'marble', label: 'Marble', icon: Layers, desc: 'Luxury stone' },
  { id: 'water', label: 'Water', icon: Cloud, desc: 'Fresh ripple' },
  { id: 'nature', label: 'Nature', icon: Sun, desc: 'Organic' },
  { id: 'custom', label: 'Custom', icon: ScanLine, desc: 'Your image' },
];

export const FLYER_TYPES = [
  { id: 'promo', label: 'Sales Promo', icon: Ticket, desc: 'Discounts & Offers' },
  { id: 'launch', label: 'New Arrival', icon: Sparkles, desc: 'Product Launch' },
  { id: 'event', label: 'Event', icon: Calendar, desc: 'Invitation / Save Date' },
  { id: 'greeting', label: 'Greeting', icon: Megaphone, desc: 'Holiday / Seasonal' },
  { id: 'general', label: 'Brand Ad', icon: LayoutGrid, desc: 'General Awareness' },
];

export const FLYER_STYLES = [
  { id: 'minimalist', label: 'Minimalist', icon: Box, desc: 'Clean, Swiss Style' },
  { id: 'bold', label: 'Bold & Loud', icon: Zap, desc: 'High Contrast' },
  { id: 'elegant', label: 'Elegant', icon: Sparkles, desc: 'Luxury Serif Fonts' },
  { id: 'fun', label: 'Fun & Playful', icon: Sun, desc: 'Colorful & Pop' },
  { id: 'urban', label: 'Urban', icon: MapPin, desc: 'Streetwear Vibe' },
];

export const INTERIOR_STYLES = [
  { id: 'modern-luxury', label: 'Modern Luxury', icon: Sparkles, desc: 'Sleek & Expensive' },
  { id: 'african-modern', label: 'Afro-Modern', icon: MapPin, desc: 'Earth Tones & Art' },
  { id: 'minimalist', label: 'Minimalist', icon: Box, desc: 'Clean Lines' },
  { id: 'industrial', label: 'Industrial', icon: Layers, desc: 'Raw Materials' },
  { id: 'cozy', label: 'Cozy / Warm', icon: Sun, desc: 'Inviting & Soft' },
];
