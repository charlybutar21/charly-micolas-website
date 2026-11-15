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
    items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Apache Kafka'],
  },
  {
    category: 'Development & DevOps',
    items: ['Git', 'GitLab', 'GitHub', 'Docker', 'Maven', 'Gradle'],
  },
  {
    category: 'Project Management',
    items: ['Jira', 'Confluence', 'Agile', 'Scrum', 'Kanban'],
  },
];
