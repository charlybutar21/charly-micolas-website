import { PortfolioData } from "../types";

export const portfolioData: PortfolioData = {
  hero: {
    name: "Charly Micolas Butarbutar.",
    role: "Software Engineer Backend.",
    tagline: "Architecting highly scalable, cloud-native microservices. I specialize in designing robust backend systems for SaaS, PropTech, and FinTech platforms, focusing on performance, reliability, and clean code."
  },
  about: {
    paragraphs: [
      "Hello! I'm Charly, a Backend Software Engineer with over 8 years of experience building and maintaining software systems.",
      "I started my software engineering journey while studying Computer Science at Del Institute of Technology and the University of Indonesia. Since then, I’ve worked across several industries, including SaaS, supply chain, property technology, and fintech.",
      "My main experience is in backend development, system design, and building scalable services. I also have experience working with microservices, cloud platforms, and improving existing systems to make them more reliable and maintainable.",
      "Currently, I’m also involved in leading engineering initiatives, reviewing code, mentoring team members, and working with the team to deliver reliable solutions that support business needs.",
      "I enjoy learning new technologies, solving engineering problems, and continuously improving the way software is built."
    ]
  },
  skills: [
    {
      category: "Languages & Core",
      items: ["Java", "Golang", "OOP", "Clean Code", "Design Patterns"]
    },
    {
      category: "Architecture & Frameworks",
      items: ["Spring Boot", "Microservices", "RESTful APIs", "Event-Driven Design", "System Design"]
    },
    {
      category: "Cloud & DevOps",
      items: ["Docker", "AWS", "GCP", "CI/CD", "GitLab CI", "Maven"]
    },
    {
      category: "Databases & Brokers",
      items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Kafka", "RabbitMQ"]
    },
    {
      category: "Engineering Practices",
      items: ["Unit Testing", "Code Review", "Observability"]
    },
    {
      category: "Project Management",
      items: ["Planning", "Task Management", "Sprint Planning", "Team/Stakeholder Coordination"]
    },
  ],
  experience: [
    {
      company: "PT Progo Puncak Group - Pinjamin",
      role: "Senior Software Engineer",
      period: "June 2024 - Present",
      location: "South Jakarta",
      description: [
        "Lead development activities for internal systems supporting telemarketing, collection, QC, and management operations.",
        "Break down requirements and development initiatives into clear tasks and priorities for the engineering team.",
        "Coordinate with local and HQ engineering teams to align on technical solutions, priorities, and delivery timelines.",
        "Support the team in technical issue resolution, code reviews, and development decisions to ensure quality and smooth delivery.",
        "Improve existing systems by refactoring legacy code, reducing technical debt, and improving system performance and maintainability.",
        "Maintain technical documentation and audit evidence to support internal and external compliance requirements."
      ],
      skills: ["Java", "Spring Boot", "Microservices", "MySQL", "Redis", "RabbitMQ", "Docker"]
    },
    {
      company: "PT Ringan Teknologi Indonesia (Ringan)",
      role: "Software Engineer",
      period: "Feb 2024 - May 2024",
      location: "Jakarta Selatan",
      description: [
        "Successfully navigated the complete transition of backend ownership from the HQ team, ensuring zero downtime through structured knowledge transfer and comprehensive documentation.",
        "Engineered the full lifecycle of loan application submission APIs, strictly adhering to security compliance, robust testing, and aggressive performance benchmarks."
      ],
      skills: ["Java", "Spring Boot", "PostgreSQL", "Microservices", "Apollo"]
    },
    {
      company: "PT Advotics Technology Global (Advotics)",
      role: "Freelance Software Engineer",
      period: "Jun 2023 - Jan 2024",
      location: "Remote",
      description: [
        "Delivered critical API features entirely independently, maintaining a flawless track record of meeting strict contractual timelines with minimal supervision.",
        "Enhanced core system functionality and mitigated recurring bugs in production environments, demonstrating high-level technical autonomy."
      ],
      skills: ["Java", "Spring Boot", "MySQL", "Microservices"]
    },
    {
      company: "PT Properti Solusi Manajemen (Pinhome)",
      role: "Senior Software Engineer",
      period: "Sep 2021 - May 2023",
      location: "Remote",
      description: [
        "Collaborated with the technical lead to assess technical requirements and break down tasks for upcoming sprints, ensuring alignment with business goals and timely delivery.",
        "Took ownership of features end-to-end within agent and lead backend services handling design, development, testing, documentation, and deployment demonstrating strong command of the full software development lifecycle (SDLC).",
        "Mentored 3 junior engineers, elevating the overall engineering culture and code quality by establishing strict, structured code review protocols."
      ],
      skills: ["Golang", "PostgreSQL", "Redis", "GCP", "Unit Testing"]
    },
    {
      company: "PT Advotics Technology Global (Advotics)",
      role: "Software Engineer & Team Lead",
      period: "Sep 2017 - Aug 2021",
      location: "Remote",
      description: [
        "Led a cross-functional engineering team of 6 to successfully design and deliver high-impact enterprise features for clients across multiple industry verticals.",
        "Directed the end-to-end architectural revamp of multiple flagship internal products, radically improving functional capabilities and user experience metrics.",
        "Acted as a crucial technical advisor, translating complex business requirements into actionable engineering sprint tasks while providing strategic troubleshooting support."
      ],
      skills: ["Java", "Spring Boot", "AWS", "ETL", "Microservices"]
    },
    {
      company: "PT. LightStream Analytics Indonesia",
      role: "IT Support Consultant",
      period: "Nov 2015 - Jul 2017",
      location: "Jakarta Pusat",
      description: [
        "Managed sophisticated daily customer support operations, resolving complex infrastructure and software tickets under strict SLAs.",
        "Conducted root-cause analysis and provided technical troubleshooting for enterprise-grade data products."
      ],
      skills: ["Java", "AWS", "Hadoop Cloudera", "Linux"]
    }
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
      location: "Toba, North Sumatera",
      graduationDate: "September 2015"
    }
  ],
  contact: {
    email: "charlymicolas21@gmail.com",
    linkedin: "https://linkedin.com/in/charly-micolas",
    github: "https://github.com/charlybutar21"
  }
};
