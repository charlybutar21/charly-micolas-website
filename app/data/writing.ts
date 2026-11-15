import type { WritingPost } from '../types';

export const writingPosts: WritingPost[] = [
  {
    slug: 'a-practical-guide-to-system-design',
    title: 'A practical guide to system design',
    excerpt:
      'A clear, beginner-friendly guide to designing scalable backend systems—from networking and databases to distributed architecture, reliability, and real-world trade-offs.',
    publishedOn: '15 Nov 2026',
    readingTime: '12 min read',
    status: 'Published',
    body: [
      'System design is the process of defining the architecture, components, interfaces, and data flow of a system so it can serve real business and user needs reliably at scale.',
      'If writing code is like laying bricks and wiring pipes, system design is the blueprint for the entire building: deciding how many floors it needs, where the emergency exits go, how elevators handle rush-hour traffic, and what backup generators turn on when the power grid fails.',
      'This guide distills my open-source System Design handbook into plain English—covering the six core pillars every software engineer needs to build dependable production systems and approach system design interviews with confidence.',
    ],
    sections: [
      {
        id: 'networking-and-infrastructure',
        eyebrow: 'Chapter 01 · Networking & Infrastructure',
        title: 'How a request travels from a user device to your server',
        paragraphs: [
          'Before designing large-scale applications like WhatsApp, Netflix, or Gojek, we need to understand how a single request travels across the internet safely, quickly, and without crashing when millions of users arrive at the same time.',
          'Every request starts with DNS (Domain Name System), the phonebook of the internet, which translates a human-friendly domain name into an IP address. From there, traffic moves across the network using Layer 4 transport protocols (TCP or UDP) and Layer 7 application protocols (such as HTTP/HTTPS).',
          'As traffic grows, a single server is no longer enough. We scale horizontally by adding more stateless servers behind a Load Balancer, serving static assets from a nearby Content Delivery Network (CDN), and keeping hot data in an in-memory cache.',
        ],
        highlights: [
          {
            label: 'TCP vs. UDP',
            detail:
              'TCP guarantees that every packet arrives intact and in order (ideal for web pages, APIs, and payments). UDP skips handshakes and retransmissions for the lowest possible latency (ideal for live video calls, gaming, and DNS lookups).',
          },
          {
            label: 'Layer 4 vs. Layer 7 Load Balancing',
            detail:
              'Layer 4 load balancers route traffic fast using only IP and port numbers. Layer 7 load balancers inspect the actual HTTP request (URL path, headers, cookies) to make smarter routing decisions.',
          },
          {
            label: 'Caching & CDNs',
            detail:
              'Reading from RAM (like Redis or Memcached) is roughly 1,000x faster than reading from an SSD database. Pair a Cache-Aside strategy with a CDN so users fetch static files from an edge server in their own city instead of across continents.',
          },
          {
            label: 'High Availability ("The Nines") & Scaling',
            detail:
              'Four nines (99.99% uptime) allows only 52 minutes of downtime per year. Achieve it by eliminating single points of failure with Active-Active or Active-Passive failover and stateless horizontal scaling.',
          },
        ],
        callout:
          'Architect rule of thumb: Keep application servers completely stateless. Store user sessions and shared state in Redis or a database so any server instance can handle any request.',
      },
      {
        id: 'databases-and-storage-scalability',
        eyebrow: 'Chapter 02 · Databases & Consistency',
        title: 'Choosing, indexing, and scaling your data layer',
        paragraphs: [
          'Almost every backend system is ultimately a data processing system. The most important rule in database selection is to choose based on your access patterns and consistency requirements—never hype.',
          'Relational databases (SQL like PostgreSQL and MySQL) enforce strict schemas and ACID transactions, making them the safest default for financial ledgers, orders, and structured relationships. Non-relational databases (NoSQL) trade rigid joins for flexible schemas and effortless horizontal scale across massive write workloads.',
          'When a single database node hits its limit, we scale reads first with Indexes, Materialized Views, and Master-Slave Read Replicas. When write volume or table size outgrows one machine, we partition data horizontally across multiple servers using Database Sharding and Consistent Hashing.',
        ],
        highlights: [
          {
            label: 'SQL vs. 5 Flavors of NoSQL',
            detail:
              'Use PostgreSQL/MySQL for ACID transactions; Key-Value stores (Redis, DynamoDB) for O(1) lookups; Document stores (MongoDB) for flexible catalogs; Wide-Column stores (Cassandra, ScyllaDB) for billions of chat messages; Graph DBs (Neo4j) for social or fraud networks; and Time-Series DBs (InfluxDB, Prometheus) for metrics.',
          },
          {
            label: 'Avoid the N+1 Query Problem',
            detail:
              'Never run a database query inside a loop (1 query to fetch 50 posts + 50 separate queries to fetch each author). Use Eager Loading (JOIN FETCH) or batch queries (WHERE id IN (...)) to collapse 51 round-trips into 1 or 2.',
          },
          {
            label: 'CAP & PACELC Theorems',
            detail:
              'When a network partition happens (P), a distributed data store must choose between strict Consistency (CP—return an error rather than stale data) and Availability (AP—always respond, then reconcile via Eventual Consistency). PACELC adds that even in normal operation (E), systems trade off Latency (L) against Consistency (C).',
          },
          {
            label: 'Distributed Transactions & Saga Pattern',
            detail:
              'Two-Phase Commit (2PC) locks resources across services and can become a bottleneck. In microservices, prefer the Saga Pattern: a sequence of local transactions where failures trigger compensating actions (for example, refunding payment if inventory reservation fails).',
          },
        ],
        callout:
          'Architect rule of thumb: Do not shard a database prematurely. Exhaust B-Tree indexing, query optimization, connection pooling, Redis caching, and read replicas before introducing cross-shard complexity.',
      },
      {
        id: 'architecture-and-communication',
        eyebrow: 'Chapter 03 · Architecture & Messaging',
        title: 'Structuring application code and inter-service communication',
        paragraphs: [
          'Good architecture separates core business rules from technical delivery details. Inside a service, Clean or Hexagonal Architecture (Ports and Adapters) keeps domain logic independent of HTTP frameworks and database drivers so it stays easy to test and evolve.',
          'At the system level, start with a well-structured Monolith or Modular Monolith. Split into Microservices only when team boundaries, independent deployment cycles, or isolated scaling bottlenecks genuinely require it.',
          'Services communicate either synchronously—where the caller waits for an immediate response—or asynchronously through a message broker, where slow background jobs are decoupled from the user-facing HTTP request.',
        ],
        highlights: [
          {
            label: 'REST vs. GraphQL vs. gRPC',
            detail:
              'Use REST (JSON over HTTP) for public APIs, GraphQL when frontend clients need flexible field selection from multiple sources, and gRPC (binary Protocol Buffers over HTTP/2) for high-throughput, low-latency internal microservice calls.',
          },
          {
            label: 'Message Queues vs. Pub/Sub & Event Streaming',
            detail:
              'Use a point-to-point Message Queue (RabbitMQ, Amazon SQS) to offload slow tasks like sending emails or generating PDFs to one worker, complete with Dead-Letter Queues (DLQ) and backpressure. Use Pub/Sub and Event Streaming (Apache Kafka) to broadcast one business event to many independent consumers in parallel.',
          },
          {
            label: 'Event Sourcing & CQRS',
            detail:
              'Instead of overwriting a row in place, Event Sourcing records an immutable log of every state-changing event (like a bank statement). CQRS separates the write model (Commands) from optimized read views (Queries) so each side can scale independently.',
          },
          {
            label: 'Real-Time: WebSockets vs. SSE vs. Long Polling',
            detail:
              'Use WebSockets for persistent two-way communication (chat apps, multiplayer games, live driver location). Use Server-Sent Events (SSE) for simple one-way server-to-browser updates (live notifications, stock tickers, AI token streaming).',
          },
        ],
        callout:
          'Architect rule of thumb: Never perform slow I/O (sending emails, resizing videos, calling flaky third-party APIs) on the main HTTP thread. Push a job to a queue and return an immediate response to the user.',
      },
      {
        id: 'resiliency-operations-and-security',
        eyebrow: 'Chapter 04 · Resiliency & Security',
        title: 'Keeping production systems safe, fast, and fault-tolerant',
        paragraphs: [
          'What separates a side project from a production-grade system is how it behaves when things go wrong. Networks drop packets, downstream dependencies slow down, users double-click payment buttons, and malicious bots flood public endpoints.',
          'Resilient systems defend themselves at every layer: Rate Limiters block abusive traffic at the edge, Circuit Breakers stop cascading failures between internal services, and Idempotency keys guarantee that retrying a network request never charges a customer twice.',
          'For location-aware products like ride-hailing or food delivery, specialized spatial indexes turn slow two-dimensional latitude/longitude scans into sub-10ms lookups.',
        ],
        highlights: [
          {
            label: 'Circuit Breaker (Closed, Open, Half-Open)',
            detail:
              'Like an electrical fuse at home: when a downstream service starts timing out, the breaker trips to Open and fails fast (or returns a cached fallback) so threads in calling services do not pile up and crash the whole system.',
          },
          {
            label: 'Rate Limiting Algorithms',
            detail:
              'Protect APIs from DDoS, brute-force attacks, and noisy neighbors with HTTP 429 responses. Token Bucket (used by AWS and Stripe) handles short traffic bursts gracefully, while Sliding Window Counter (used by Cloudflare) prevents boundary spikes with minimal memory.',
          },
          {
            label: 'Idempotency in Financial & Critical APIs',
            detail:
              'With At-Least-Once message delivery and mobile network retries, duplicate requests are guaranteed to happen. Require an Idempotency-Key header on POST/PUT mutations so repeating the same request returns the original result without duplicating side effects.',
          },
          {
            label: 'Geohashing & Quadtrees + Zero-Trust Security',
            detail:
              'Geohashing encodes (Lat, Long) into a shared string prefix for fast proximity lookups, while Quadtrees adaptively split dense city grids into smaller quadrants. Secure external traffic with OAuth 2.0 / OIDC and TLS, and internal service-to-service traffic with mutual TLS (mTLS).',
          },
        ],
        callout:
          'Architect rule of thumb: Define clear SLIs (metrics like p99 latency and error rate), SLOs (internal reliability targets), and Disaster Recovery objectives—RPO (how much data you can afford to lose) and RTO (how fast you must recover).',
      },
      {
        id: 'interview-framework-and-case-studies',
        eyebrow: 'Chapter 05 · Framework & Case Studies',
        title: 'A 7-step framework for solving any system design problem',
        paragraphs: [
          'System design questions—whether in an engineering interview or an architecture review at work—are intentionally open-ended. There is no single "perfect" diagram; the goal is to demonstrate structured thinking, clear requirement gathering, realistic capacity math, and pragmatic trade-offs.',
          'Before drawing any boxes, walk through seven disciplined steps: clarify functional and non-functional requirements, estimate capacity (RPS, storage, bandwidth), model your data schema, define clean API contracts, draw the end-to-end high-level design, dive deep into the hardest bottlenecks, and address single points of failure.',
        ],
        highlights: [
          {
            label: '1. URL Shortener (Bitly / TinyURL)',
            detail:
              'A classic read-heavy system (100:1 read-to-write ratio). Use Base62 encoding over a distributed unique ID generator (Snowflake) or pre-generated Key Generation Service (KGS), cache hot redirects in Redis, and return HTTP 301 (permanent) or 302 (analytics-tracked) redirects.',
          },
          {
            label: '2. Real-Time Chat (WhatsApp)',
            detail:
              'Maintain stateful WebSocket connections through chat gateway servers, track online presence with heartbeats in Redis, route messages via a session registry, and store billions of write-heavy chat messages in Wide-Column storage (Cassandra/ScyllaDB).',
          },
          {
            label: '3. Social Media Newsfeed (Twitter / X)',
            detail:
              'Combine a hybrid fanout strategy: Fanout-on-Write (push posts directly into followers’ Redis timelines) for normal users so reads are instant, and Fanout-on-Read (pull and merge on demand) for celebrities with millions of followers to avoid massive write amplification.',
          },
          {
            label:
              '4. Video Streaming (Netflix) & 5. Ride-Hailing (Uber/Gojek)',
            detail:
              'For video streaming, upload raw files to Object Storage (S3), transcode into adaptive HLS/DASH chunks via background workers, and stream from edge CDNs. For ride-hailing, ingest live driver GPS pings over WebSockets into an in-memory Quadtree or Redis Geo index and lock ride matching to prevent double booking.',
          },
        ],
        callout:
          'Avoid dogmatic statements like "NoSQL is always faster than SQL." Instead, explain why PostgreSQL fits payment transactions (ACID) while Cassandra fits chat history (write-heavy horizontal scale).',
      },
      {
        id: 'architect-cheat-sheet',
        eyebrow: 'Chapter 06 · Quick Reference Cheat Sheet',
        title: 'Numbers and mental shortcuts every engineer should know',
        paragraphs: [
          'Good back-of-the-envelope estimation keeps you from over-engineering small systems or under-provisioning large ones. You do not need exact calculator precision—powers of ten and simple mental shortcuts are enough to validate whether a design needs caching, sharding, or a CDN.',
          'Use the reference points below whenever you need to estimate throughput, storage growth, or technology choices on the spot.',
        ],
        highlights: [
          {
            label: 'Latency Perspective (RAM vs. Disk vs. Network)',
            detail:
              'L1 CPU cache takes ~0.5 ns, RAM (Redis) takes ~100 ns, random SSD reads take ~100 µs (1,000x slower than RAM), single-datacenter network round-trips take ~0.5 ms, and cross-continent packet round-trips take ~150 ms.',
          },
          {
            label: 'Quick RPS Shortcut (1 Day ≈ 100,000 Seconds)',
            detail:
              '1 day has 86,400 seconds—round it to 100,000 (10^5) for fast mental math. 1 million requests/day ≈ 12 RPS; 10 million/day ≈ 120 RPS; 100 million/day ≈ 1,200 RPS; 1 billion/day ≈ 12,000 RPS.',
          },
          {
            label: 'The 80/20 Pareto Caching Rule',
            detail:
              'In most read-heavy systems, 80% of traffic accesses only 20% of the active data. Sizing your Redis cache to hold 20% of daily read volume usually offloads the vast majority of database queries.',
          },
          {
            label: 'Pragmatic Technology Cheat Sheet',
            detail:
              'ACID & ledger → PostgreSQL · Caching, session & rate limit → Redis · Massive chat/write logs → Cassandra/ScyllaDB · Full-text search → Elasticsearch · Async jobs → RabbitMQ/SQS · High-volume event streaming → Apache Kafka · Static media → S3 + CDN.',
          },
        ],
      },
    ],
    externalResource: {
      label: 'Explore the full System Design repository on GitHub',
      url: 'https://github.com/charlybutar21/system-design',
      note: 'Includes all 6 complete modules, architecture diagrams (.excalidraw), capacity estimation formulas, and deep-dive interview case studies.',
    },
  },
];
