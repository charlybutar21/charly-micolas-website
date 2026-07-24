import { PortfolioData } from "../types";

export const portfolioData: PortfolioData = {
  hero: {
    name: "Charly Micolas Butarbutar.",
    role: "Senior Backend Engineer.",
    tagline: "Architecting highly scalable, cloud-native microservices. I specialize in designing robust backend systems for SaaS, PropTech, and FinTech platforms, focusing on performance, reliability, and clean code."
  },
  about: {
    paragraphs: [
      "Hello! I'm Charly, a results-driven Senior Backend Engineer with a deep passion for system architecture and solving complex engineering challenges. My journey into software engineering began during my Computer Science studies at the University of Indonesia, which laid a strong foundation in computational thinking.",
      "With over 8 years of professional experience across diverse sectors—including SaaS supply chain, property technology, and peer-to-peer financial technology—I've developed a strong intuition for building systems that scale gracefully under pressure.",
      "Currently, my core focus lies in leading engineering initiatives, refactoring monolithic legacy systems into agile microservices, and elevating team standards through rigorous code reviews and mentorship. I am obsessed with continuous optimization and delivering measurable business impact through technology."
    ]
  },
  skills: [
    {
      category: "Languages & Core",
      items: ["Java", "Golang", "TypeScript", "OOP", "Clean Architecture"]
    },
    {
      category: "Architecture & Frameworks",
      items: ["Spring Boot", "Microservices", "RESTful APIs", "gRPC", "Event-Driven Design"]
    },
    {
      category: "Cloud & DevOps",
      items: ["Docker", "Kubernetes", "AWS", "GCP", "CI/CD", "GitLab CI"]
    },
    {
      category: "Databases & Brokers",
      items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Kafka", "RabbitMQ"]
    }
  ],
  experience: [
    {
      company: "PT Progo Puncak Group (Pinjamin)",
      role: "Senior Software Engineer",
      period: "June 2024 - Present",
      location: "Jakarta Selatan",
      description: [
        "Spearheaded the development and continuous maintenance of critical internal systems for telemarketing, collection, and QC, resulting in heightened operational efficiency and system reliability.",
        "Served as the primary technical anchor for high-severity issue resolution, ensuring seamless cross-functional collaboration with product teams to deliver rapid solutions.",
        "Architected the refactoring of deeply entrenched legacy codebases, significantly reducing technical debt, optimizing query performance, and vastly improving long-term maintainability.",
        "Orchestrated alignment between local and HQ engineering teams, driving consensus on architecture standards, delivery timelines, and engineering best practices."
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
      company: "PT Advotics Technology Global",
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
        "Took end-to-end ownership of highly visible features within the agent and lead backend services, mastering the full Software Development Life Cycle (SDLC) from system design to cloud deployment.",
        "Drastically reduced system latency and technical debt through proactive bug resolution and strategic code refactoring.",
        "Mentored 3 junior engineers, elevating the overall engineering culture and code quality by establishing strict, structured code review protocols."
      ],
      skills: ["Golang", "PostgreSQL", "Redis", "GCP", "Unit Testing"]
    },
    {
      company: "PT Advotics Technology Global",
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
    email: "charlymicolasbutar@gmail.com",
    linkedin: "https://linkedin.com/in/charly-micolas",
    github: "https://github.com/charlybutar21"
  }
};
