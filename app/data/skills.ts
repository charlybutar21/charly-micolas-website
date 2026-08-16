import type { SkillCategory } from '../types';

export const skillCategories: SkillCategory[] = [
  { category: 'Languages', items: ['Java', 'Go'] },
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
    items: [
      'MySQL',
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'RabbitMQ',
      'Apache Kafka',
    ],
  },
  {
    category: 'Development & DevOps',
    items: ['Git', 'GitLab', 'GitHub', 'Docker', 'Maven', 'Gradle'],
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
];
