export type SouvenirCategory = 'semua' | 'pernikahan' | 'corporate' | 'ulang-tahun' | 'seminar';

export interface PackagingOption {
  id: string;
  name: string;
  extraPrice: number;
  description: string;
}

export interface SouvenirItem {
  id: string;
  name: string;
  category: 'pernikahan' | 'corporate' | 'ulang-tahun' | 'seminar';
  price: number;
  minOrder: number;
  leadTimeDays: number;
  description: string;
  material: string;
  popular?: boolean;
  image: string;
  badge?: string;
  includes: string[];
  dimensions?: string;
}

export interface StoreConfig {
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  city: string;
  minOrderPolicy: string;
  dpPercent: number;
  guaranteePolicy: string;
  operatingHours: string;
  promoText: string;
}

export interface QuotationSummary {
  productName: string;
  quantity: number;
  unitPrice: number;
  packagingName: string;
  packagingPrice: number;
  discountPercent: number;
  subtotal: number;
  discountAmount: number;
  totalPrice: number;
  estimatedDays: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachedProduct?: SouvenirItem;
  quotationData?: QuotationSummary;
  quickSuggestions?: string[];
}
