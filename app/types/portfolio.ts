export interface ExperienceData {
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: [string, string];
  additionalResponsibilities: string[];
}

export interface EducationData {
  institution: string;
  degree: string;
  location: string;
  graduationDate: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export type WritingStatus = 'Draft' | 'Published';

export interface WritingHighlight {
  label: string;
  detail: string;
}

export interface WritingSection {
  id: string;
  eyebrow?: string;
  title: string;
  paragraphs: string[];
  highlights?: WritingHighlight[];
  callout?: string;
}

export interface WritingExternalResource {
  label: string;
  url: string;
  note?: string;
}

export interface WritingPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedOn: string;
  readingTime: string;
  status: WritingStatus;
  body: string[];
  sections?: WritingSection[];
  externalResource?: WritingExternalResource;
}

export interface PortfolioData {
  hero: {
    name: string;
    role: string;
    tagline: string;
  };
  about: {
    paragraphs: string[];
  };
  coreCompetencies: string[];
  skills: SkillCategory[];
  experience: ExperienceData[];
  education: EducationData[];
  writing: WritingPost[];
  contact: {
    linkedin: string;
    github: string;
  };
}
