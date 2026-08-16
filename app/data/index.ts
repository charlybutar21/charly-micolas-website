import { PortfolioData } from '../types';

export const portfolioData: PortfolioData = {
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
  skills: [
    {
      category: 'Languages',
      items: ['Java', 'Go'],
    },
    {
      category: 'Frameworks & Libraries',
      items: [
        'Spring Boot',
        'Spring MVC',
        'Spring Data JPA',
        'Hibernate',
        'MyBatis',
        'Spring Cloud',
        'Eureka',
        'JSP',
        'Lombok',
        'JUnit',
        'Mockito',
      ],
    },
    {
      category: 'Data & Messaging',
      items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'RabbitMQ', 'Apache Kafka'],
    },
    {
      category: 'Development & DevOps',
      items: ['Git', 'GitLab', 'GitHub', 'Docker', 'Docker Compose', 'Maven', 'Gradle', 'CI/CD'],
    },
    {
      category: 'Architecture & Engineering Practices',
      items: [
        'System Design',
        'Microservices',
        'REST API Design',
        'Event-Driven Architecture',
        'Database Design',
        'OOP',
        'SOLID Principles',
        'Clean Code',
        'Code Review',
        'Refactoring',
        'Root Cause Analysis',
        'SDLC',
      ],
    },
    {
      category: 'Project Management',
      items: ['Jira', 'Confluence', 'Agile', 'Scrum', 'Kanban'],
    },
  ],
  experience: [
    {
      company: 'PT Progo Puncak Group (Pinjamin)',
      role: 'Senior Software Engineer',
      period: 'Jun 2024 - Present',
      location: 'South Jakarta',
      description: [
        'Supported ISO 27001, OJK, and FDC audit activities by addressing technical findings, preparing evidence, and delivering improvements that strengthened security and regulatory compliance.',
        'Lead cross-functional delivery involving 6 engineers, 2 QA engineers, 1 product manager, and 1 UI designer, translating business requirements into technical solutions and actionable engineering tasks.',
        'Design, develop, and maintain backend systems supporting lending, collection, AML, and internal operations, including the Internal Management Dashboard, Collection System, and Pinjamin website.',
        'Lead technical discussions, solution and design reviews, production issue resolution, and delivery planning while coordinating dependencies, risks, blockers, owners, and cross-functional decisions.',
      ],
      skills: [],
    },
    {
      company: 'PT Ringan Teknologi Indonesia (Ringan)',
      role: 'Software Engineer',
      period: 'Feb - May 2024',
      location: 'South Jakarta',
      description: [
        'Collaborated with the Technical Lead to assess system requirements, translate them into actionable technical tasks, and align backend solutions with business objectives.',
        'Contributed to the full development lifecycle of Java and Spring Boot APIs supporting loan application submissions, including implementation, testing, debugging, and defect resolution.',
      ],
      skills: [],
    },
    {
      company: 'PT Advotics Technology Global (Advotics)',
      role: 'Freelance Software Engineer',
      period: 'Jun 2023 - Jan 2024',
      location: 'Remote',
      description: [
        'Delivered Java and Spring Boot API enhancements for a Workforce Management System, translating agreed requirements into maintainable backend solutions.',
        'Independently managed assigned development work, including estimation, implementation, testing, documentation, and handover within contracted timelines.',
      ],
      skills: [],
    },
    {
      company: 'PT Properti Solusi Manajemen (Pinhome)',
      role: 'Senior Software Engineer',
      period: 'Sep 2021 - May 2023',
      location: 'Remote',
      description: [
        'Partnered with the Technical Lead to assess requirements, break down technical tasks, and prepare upcoming sprints in alignment with business priorities.',
        'Owned the end-to-end delivery of features across agent and lead-management backend services, covering technical design, development, testing, documentation, and deployment.',
        'Resolved defects and reduced technical debt through systematic troubleshooting and refactoring, improving system maintainability and reliability.',
        'Mentored 3 junior engineers and improved team code quality through structured code reviews and engineering best-practice sharing.',
      ],
      skills: [],
    },
    {
      company: 'PT Advotics Technology Global (Advotics)',
      role: 'Software Engineer / Engineering Lead',
      period: 'Sep 2017 - Aug 2021',
      location: 'South Jakarta',
      description: [
        'Designed and maintained Java and Spring Boot microservices supporting item and order management, identity and access, content, and analytics capabilities across SaaS supply-chain products.',
        'Led a team of 6 engineers in delivering product features for clients across multiple industries.',
        'Partnered with Product Managers to estimate scope and engineering effort, prioritize technical work, and support reliable sprint delivery.',
        'Translated business requirements into technical designs and actionable engineering tasks, providing implementation guidance throughout delivery.',
        'Led end-to-end modernization initiatives for several internal products and features, covering technical planning, implementation, testing, rollout, and issue resolution.',
        'Acted as a technical advisor by investigating complex system issues and providing guidance to product, engineering, and support teams.',
      ],
      skills: [],
    },
    {
      company: 'PT LightStream Analytics Indonesia',
      role: 'IT Support Consultant',
      period: 'Nov 2015 - Jul 2017',
      location: 'Central Jakarta',
      description: [
        'Investigated and resolved technical issues using Java, AWS, Hadoop Cloudera, and Linux where applicable.',
        'Managed support requests from intake through resolution, documenting troubleshooting steps, recurring issues, and escalation details for technical teams.',
      ],
      skills: [],
    },
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
  writing: [
    {
      slug: 'the-quiet-work-behind-reliable-software',
      title: 'The quiet work behind reliable software',
      excerpt:
        'A placeholder draft about the patient engineering work that makes systems dependable long after launch day.',
      publishedOn: 'Coming soon',
      readingTime: '4 min read',
      status: 'Draft',
      body: [
        'Reliable software is rarely defined by a single dramatic decision. It is built through the small, repeatable choices that make a system easier to understand, observe, and change.',
        'This placeholder draft will become a space for reflections on the work around implementation: clarifying a problem, learning from an incident, and making room for better decisions.',
        'For now, it is an invitation to return to this page when a finished personal essay is ready to be shared.',
      ],
    },
  ],
  contact: {
    email: 'charlymicolasbutar@gmail.com',
    linkedin: 'https://linkedin.com/in/charly-micolas',
    github: 'https://github.com/charlybutar21',
  },
};
