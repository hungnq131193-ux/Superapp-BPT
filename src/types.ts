export type ViewState = 'MENU' | 'FAQ' | 'DEPOSIT' | 'LOAN' | 'LOCATIONS' | 'GAME';

export interface FAQStep {
  text: string;
  image?: string;
}

export interface FAQItem {
  id: string;
  title: string;
  steps: FAQStep[];
  videoLink?: string;
}

export interface LocationInfo {
  id: string;
  name: string;
  address: string;
  iframeSrc: string;
}
