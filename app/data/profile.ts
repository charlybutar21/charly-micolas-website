import type { PortfolioData } from '../types';

export const profileData: Pick<
  PortfolioData,
  'hero' | 'about' | 'coreCompetencies' | 'education' | 'contact'
> = {
  hero: {
    name: 'Charly Micolas Butarbutar',
    role: 'Senior Software Engineer | Backend Engineering | Technical Leadership',
    tagline:
      'Backend-focused Senior Software Engineer combining approximately 9 years of technical experience with delivery ownership and cross-functional coordination. Experienced in Java, Golang, REST APIs, microservices, databases, and service integration across Fintech P2P, Property Technology, and SaaS supply chain. Brings hands-on backend depth to architecture discussions, requirement clarification, engineering review, blocker resolution, and reliable delivery.',
  },
  about: {
    paragraphs: [
      'Backend-focused Senior Software Engineer combining approximately 9 years of technical experience with delivery ownership and cross-functional coordination. Experienced in Java, Golang, REST APIs, microservices, databases, and service integration across Fintech P2P, Property Technology, and SaaS supply chain. Brings hands-on backend depth to architecture discussions, requirement clarification, engineering review, blocker resolution, and reliable delivery.',
    ],
  },
  coreCompetencies: [
    'Backend Architecture',
    'API Design and Integration',
    'Microservices',
    'Distributed Systems',
    'Database Design',
    'System Reliability',
    'Technical Leadership',
    'Delivery Management',
    'Requirement Analysis',
    'Stakeholder Alignment',
    'Code and Design Review',
    'Agile Delivery',
  ],
  education: [
    {
      institution: 'University of Indonesia',
      degree: 'Bachelor of Science in Computer Science',
      location: 'Depok',
      graduationDate: 'Feb 2019',
    },
    {
      institution: 'Del Institute of Technology',
      degree: 'Associate Degree in Information Technology',
      location: 'North Sumatra',
      graduationDate: 'Sep 2015',
    },
  ],
  contact: {
    email: 'charlymicolasbutar@gmail.com',
    linkedin: 'https://linkedin.com/in/charly-micolas',
    github: 'https://github.com/charlybutar21',
  },
};
