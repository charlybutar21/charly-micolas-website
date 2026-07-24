export interface ExperienceData {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
  skills: string[];
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

export interface PortfolioData {
  hero: {
    name: string;
    role: string;
    tagline: string;
  };
  about: {
    paragraphs: string[];
  };
  skills: SkillCategory[];
  experience: ExperienceData[];
  education: EducationData[];
  contact: {
    email: string;
    linkedin: string;
    github: string;
  };
}
