export interface TranslationValue {
  value: string;
  updatedAt: string;
  updatedBy: string;
}

export interface TranslationKey {
  id: string;
  key: string;
  category: string;
  description?: string;
  translations: {
    [languageCode: string]: TranslationValue;
  };
}

export interface Project {
  id: string;
  name: string;
  description?: string;
}

export interface Language {
  code: string;
  name: string;
  isDefault?: boolean;
} 