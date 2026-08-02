import { PortfolioData } from "../types";

export const portfolioData: PortfolioData = {
  hero: {
    name: "Charly Micolas Butarbutar.",
    role: "Software Engineer Backend.",
    tagline: "Building scalable, cloud-native backend systems for SaaS, PropTech, and FinTech platforms. I focus on clean architecture, reliable services, and engineering practices that help teams move fast without breaking things."
  },
  about: {
    paragraphs: [
      "I'm a Backend Software Engineer with 8+ years of experience designing and building server-side systems across multiple industries from SaaS supply chain and property technology to fintech P2P.",
      "My core work lives in backend development: API design, microservices architecture, system integration, and making sure services hold up under real-world load. I've worked on both greenfield systems and the harder job of improving existing ones reducing technical debt, refactoring legacy code, and improving observability without disrupting production.",
      "Beyond writing code, I've taken on engineering leadership responsibilities breaking down requirements, reviewing code, coordinating with cross-functional teams, and mentoring junior engineers. I care about building the right habits in a team, not just shipping features.",
      "I hold a Bachelor's degree in Computer Science from University of Indonesia and an Associate Degree in Information Technology from Del Institute of Technology.",
    ],
  },
  skills: [
    {
      category: "Languages",
      items: ["Java", "Golang"],
    },
    {
      category: "Architecture & Design",
      items: [
        "Microservices",
        "RESTful APIs",
        "Event-Driven Architecture",
        "System Design",
        "Clean Architecture",
      ],
    },
    {
      category: "Frameworks",
      items: ["Spring Boot"],
    },
    {
      category: "Cloud & DevOps",
      items: ["Docker", "AWS", "GCP", "CI/CD", "GitLab CI"],
    },
    {
      category: "Databases",
      items: ["PostgreSQL", "MySQL", "MongoDB"],
    },
    {
      category: "Messaging & Cache",
      items: ["Redis", "Kafka", "RabbitMQ"],
    },
    {
      category: "Build & Tools",
      items: ["Maven", "Gradle", "MyBatis", "Eureka", "Apollo"],
    },
    {
      category: "Engineering Practices",
      items: ["Unit Testing", "Code Review", "Observability", "Technical Documentation"],
    },
    {
      category: "Project & Team",
      items: ["Sprint Planning", "Task Breakdown", "Cross-team Coordination", "Scrum"],
    },
  ],
  experience: [
    {
      company: "PT Progo Puncak Group (Pinjamin)",
      role: "Senior Software Engineer",
      period: "June 2024 - Present",
      location: "South Jakarta",
      description: [
        "Lead system development for internal systems supporting telemarketing, collection, quality control, and management operations.",
        "Coordinate with local and HQ engineering teams to align on technical direction, task priorities, and delivery timelines.",
        "Refactored legacy code to reduce technical debt and improve system performance and maintainability.",
        "Serve as the primary technical point of contact for issue escalation and resolution across product and engineering teams.",
        "Maintain audit-ready technical documentation to support compliance requirements.",
      ],
      skills: ["Java", "Spring Boot", "MySQL", "Redis", "RabbitMQ", "Docker", "Microservices", "RESTful APIs"],
    },
    {
      company: "PT Ringan Teknologi Indonesia (Ringan)",
      role: "Software Engineer",
      period: "Feb 2024 - May 2024",
      location: "South Jakarta",
      description: [
        "Took over backend ownership from the HQ team through structured knowledge transfer, ensuring continuity and minimal disruption.",
        "Collaborated with the technical lead to assess system requirements and define technical tasks aligned with business goals.",
        "Contributed to the full development lifecycle of loan application submission APIs — from implementation and testing through to deployment.",
      ],
      skills: ["Java", "Spring Boot", "PostgreSQL", "MySQL", "Microservices", "RESTful APIs"],
    },
    {
      company: "PT Advotics Technology Global (Advotics)",
      role: "Freelance Software Engineer",
      period: "Jun 2023 - Jan 2024",
      location: "Remote",
      description: [
        "Delivered contracted API features independently within agreed timelines, with minimal supervision.",
        "Contributed to system maintenance and bug fixes in production, improving reliability for active users.",
      ],
      skills: ["Java", "Spring Boot", "MySQL", "Microservices", "RESTful APIs"],
    },
    {
      company: "PT Properti Solusi Manajemen (Pinhome)",
      role: "Senior Software Engineer",
      period: "Sep 2021 - May 2023",
      location: "Remote",
      description: [
        "Owned end-to-end delivery of features in agent and lead backend services — from design and development through testing, documentation, and deployment.",
        "Worked with the technical lead to assess requirements and break down sprint tasks, ensuring clear scope and realistic delivery timelines.",
        "Reduced technical debt by proactively refactoring existing code, resulting in measurable improvements in system performance and maintainability.",
        "Mentored 3 junior engineers through structured code reviews and knowledge-sharing sessions, improving overall team code quality.",
      ],
      skills: ["Golang", "PostgreSQL", "Redis", "GCP", "Microservices", "Unit Testing", "RESTful APIs"],
    },
    {
      company: "PT Advotics Technology Global (Advotics)",
      role: "Software Engineer & Team Lead",
      period: "Sep 2017 - Aug 2021",
      location: "Remote",
      description: [
        "Led a team of 6 engineers to design and deliver features across multiple industry verticals for Advotics clients.",
        "Worked closely with the product manager to estimate scope, plan sprints, and keep delivery aligned with business priorities.",
        "Translated business requirements into clear, actionable technical tasks that the engineering team could execute efficiently.",
        "Directed the end-to-end revamp of several internal products, improving both functionality and user experience.",
        "Provided technical advisory support for complex issues across product and engineering support teams.",
      ],
      skills: ["Java", "Spring Boot", "MySQL", "AWS", "ETL", "Microservices", "RESTful APIs"],
    },
    {
      company: "PT LightStream Analytics Indonesia",
      role: "IT Support Consultant",
      period: "Nov 2015 - Jul 2017",
      location: "Central Jakarta",
      description: [
        "Managed daily customer support operations, resolving infrastructure and software tickets within defined SLAs.",
        "Conducted root-cause analysis and provided troubleshooting for enterprise data products.",
      ],
      skills: ["Java", "AWS", "Hadoop Cloudera", "Linux"],
    },
  ],
  education: [
    {
      institution: "University of Indonesia",
      degree: "Bachelor of Science in Computer Science",
      location: "Depok, West Java",
      graduationDate: "February 2019"
    },
    {
      institution: "Del Institute of Technology",
      degree: "Associate Degree in Information Technology",
      location: "Toba, North Sumatra",
      graduationDate: "September 2015"
    }
  ],
  contact: {
    email: "charlymicolas21@gmail.com",
    linkedin: "https://linkedin.com/in/charly-micolas",
    github: "https://github.com/charlybutar21"
  }
};
