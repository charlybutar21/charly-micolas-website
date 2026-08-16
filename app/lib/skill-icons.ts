import {
  siApachekafka,
  siApachemaven,
  siConfluence,
  siDocker,
  siGithub,
  siGitlab,
  siGit,
  siGo,
  siGradle,
  siHibernate,
  siJira,
  siJunit5,
  siMongodb,
  siMysql,
  siPostgresql,
  siRabbitmq,
  siRedis,
  siSpring,
  siSpringboot,
} from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';
import { FaJava } from 'react-icons/fa';
import type { IconType } from 'react-icons';

export type SkillMark =
  | { kind: 'simple'; icon: SimpleIcon }
  | { kind: 'react'; icon: IconType; color: string }
  | { kind: 'practice'; abbreviation: string };

const simpleIconBySkill: Record<string, SimpleIcon> = {
  Go: siGo,
  'Spring Boot': siSpringboot,
  'Spring MVC': siSpring,
  'Spring Data JPA': siSpring,
  Hibernate: siHibernate,
  'Spring Cloud': siSpring,
  Eureka: siSpring,
  JUnit: siJunit5,
  MySQL: siMysql,
  PostgreSQL: siPostgresql,
  MongoDB: siMongodb,
  Redis: siRedis,
  RabbitMQ: siRabbitmq,
  'Apache Kafka': siApachekafka,
  Git: siGit,
  GitLab: siGitlab,
  GitHub: siGithub,
  Docker: siDocker,
  'Docker Compose': siDocker,
  Maven: siApachemaven,
  Gradle: siGradle,
  Jira: siJira,
  Confluence: siConfluence,
};

const reactIconBySkill: Record<string, { icon: IconType; color: string }> = {
  Java: { icon: FaJava, color: '#e76f00' },
};

function abbreviationFor(skill: string) {
  const words = skill.match(/[A-Z][a-z]*|[A-Z]+(?![a-z])|\d+/g) ?? skill.split(/\s+/);
  return words
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
}

export function getSkillMark(skill: string): SkillMark {
  const simpleIcon = simpleIconBySkill[skill];
  if (simpleIcon) {
    return { kind: 'simple', icon: simpleIcon };
  }

  const reactIcon = reactIconBySkill[skill];
  if (reactIcon) {
    return { kind: 'react', ...reactIcon };
  }

  return { kind: 'practice', abbreviation: abbreviationFor(skill) };
}
