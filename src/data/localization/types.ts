export interface HeaderTranslations {
  [key: string]: string;
  overview: string;
  solutions: string;
  products: string;
  pricing: string;
  resources: string;
  docs: string;
  support: string;
  signIn: string;
  startFree: string;
  contactUs: string;
}

export interface FooterTranslations {
  [key: string]: string;
  choosingGoogleCloud: string;
  trustAndSecurity: string;
  multicloud: string;
  globalInfrastructure: string;
  customers: string;
  analystReports: string;
  whitepapers: string;
  blog: string;
  googleCloudPricing: string;
  googleWorkspacePricing: string;
  seeAllProducts: string;
  databases: string;
  artificialIntelligence: string;
  security: string;
  seeAllSolutions: string;
  googleCloudDocs: string;
  support: string;
  codeSamples: string;
  training: string;
  certifications: string;
  systemStatus: string;
  releaseNotes: string;
  contactSales: string;
  findPartner: string;
  becomePartner: string;
  events: string;
  podcasts: string;
  aboutGoogle: string;
  privacy: string;
  siteTerms: string;
  googleCloudTerms: string;
  subscribe: string;
}

export interface LanguageData {
  code: string;
  name: string;
  selectorLabel: string;
  header: HeaderTranslations;
  footer: FooterTranslations;
}
