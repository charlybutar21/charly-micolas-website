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

export interface WritingPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedOn: string;
  readingTime: string;
  status: WritingStatus;
  body: string[];
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
    email: string;
    linkedin: string;
    github: string;
  };
}
