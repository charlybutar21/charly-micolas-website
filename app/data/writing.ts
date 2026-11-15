import type { WritingPost } from '../types';

export const writingPosts: WritingPost[] = [
  {
    slug: 'a-practical-guide-to-system-design',
    title: 'A practical guide to system design',
    excerpt:
      'A step-by-step, beginner-friendly handbook on core system design concepts, explained with everyday analogies, practical production examples, and clear architectural trade-offs.',
    publishedOn: '15 Nov 2026',
    readingTime: '18 min read',
    status: 'Published',
    body: [
      'When you first learn to code, your main goal is to make features work on your laptop: a user clicks a button, your backend saves a row in the database, and the screen updates. That works fine when you have 10 users. Everything changes when 100,000 users click that button at the exact same second during a flash sale.',
      'System design is the art and engineering of building software that stays fast, accurate, and online as traffic, data, and engineering teams grow. You do not need to memorize buzzwords to be good at system design, you only need to understand a handful of core building blocks and the trade-offs behind each one.',
    ],
    sections: [
      {
        id: 'what-is-system-design-and-scaling',
        eyebrow: '01 · Core Foundation',
        title:
          'What is System Design & How Systems Grow (Vertical vs. Horizontal Scaling)',
        paragraphs: [
          'System design is the process of defining the architecture, components, APIs, and data flow of an application so it can meet both business goals (like "never lose a payment") and technical goals (like "respond in under 200 milliseconds").',
          'Imagine launching a new online store. On Day 1, your web app and database live together on a single $10/month server. As your store becomes popular, that single server runs out of CPU and RAM. You now have two ways to scale:',
          '1. Vertical Scaling (Scale Up): Upgrade that single server into a bigger machine with more CPU cores and more RAM. It is the simplest fix because you do not change your code, but every machine has a hardware limit and if that one server crashes, your entire business goes offline.',
          '2. Horizontal Scaling (Scale Out): Instead of buying one giant supercomputer, you run 5, 10, or 50 normal servers side by side. If one server dies, the other servers smoothly take over its traffic.',
        ],
        analogy: {
          title: 'Beginner Analogy: The Restaurant Kitchen',
          text: 'Coding is knowing how to cook a delicious meal. System design is designing the entire restaurant kitchen so 20 chefs can cook 500 meals an hour without bumping into each other, running out of ingredients, or shutting down when one stove breaks. Vertical scaling is hiring one super-chef who cooks faster; horizontal scaling is hiring 10 chefs working in parallel.',
        },
        example: {
          title: 'Practical Rule: Keep Your Backend Servers Stateless',
          description:
            'For horizontal scaling to work, your backend servers must be stateless, meaning no server stores a user’s login session only in its own local RAM.',
          steps: [
            'Bad practice (Stateful): User A logs in on Server 1, which saves their session in Server 1’s local memory. If the next request from User A lands on Server 2, Server 2 does not recognize them and forces them to log in again.',
            'Good practice (Stateless): Server 1 and Server 2 keep zero session data in local RAM. Instead, session tokens are stored in a shared Redis cache or verified via stateless JWT/HttpOnly cookies.',
            'Result: Any server can handle any user request at any time, and you can add or remove servers automatically (Auto-Scaling) during traffic spikes.',
          ],
        },
        callout:
          'Architect Takeaway: Start simple (vertical scaling is fine on Day 1), but always write stateless backend code so you are ready to scale horizontally the moment traffic grows.',
      },
      {
        id: 'networking-dns-tcp-udp-load-balancer',
        eyebrow: '02 · Networking & Traffic Routing',
        title:
          'How a Request Reaches Your Server: DNS, TCP vs. UDP & Load Balancers',
        paragraphs: [
          'What actually happens in the 100 milliseconds after a user types your website address into their browser? First, the browser asks DNS (Domain Name System), the phonebook of the internet to translate a domain name like charlymicolas.com into a server IP address like 104.21.45.12.',
          'Next, the device opens a connection over Layer 4 (Transport Layer) using either TCP or UDP. TCP is careful and reliable: it performs a 3-way handshake, guarantees every packet arrives in order, and automatically resends lost packets. UDP is built for pure speed: it fires packets immediately without handshakes or retries.',
          'Finally, the request arrives at your Load Balancer (or Reverse Proxy like NGINX / Cloudflare), which sits in front of your backend servers like a traffic controller and forwards the request to a healthy server.',
        ],
        analogy: {
          title: 'Beginner Analogy: Registered Mail vs. Live Walkie-Talkie',
          text: 'TCP is like sending an official contract via registered courier: every page is numbered, and if Page 3 gets lost, the receiver asks you to resend Page 3 before reading further. UDP is like talking on a live video call: if one frame of video glitches for 0.1 seconds, you do not want the call to freeze and replay what happened 2 seconds ago, you just want the live video to keep moving.',
        },
        table: {
          caption: 'Practical Comparison: Choosing Between TCP and UDP',
          headers: ['Feature', 'TCP (Reliable)', 'UDP (Ultra-Fast)'],
          rows: [
            [
              'Connection Setup',
              'Requires 3-way handshake before sending data',
              'Connectionless, sends data immediately',
            ],
            [
              'Delivery & Order',
              'Guaranteed delivery in exact order (retransmits lost packets)',
              'No guarantee (lost packets are ignored)',
            ],
            [
              'Speed / Overhead',
              'Slightly higher latency due to safety checks',
              'Lowest possible latency and minimal overhead',
            ],
            [
              'Real-World Use Cases',
              'REST APIs, HTTPS web pages, payments, database queries, emails',
              'Zoom/WhatsApp video calls, online multiplayer games, live streaming, DNS lookups',
            ],
          ],
        },
        highlights: [
          {
            label: 'Layer 4 vs. Layer 7 Load Balancers',
            detail:
              'A Layer 4 Load Balancer only looks at the IP address and port (TCP/UDP), making it blazingly fast. A Layer 7 Load Balancer opens the HTTP request so it can route traffic intelligently based on the URL path (e.g., sending /api/payments to the Payment Service and /images to the Media Service).',
          },
          {
            label: 'Load Balancing Algorithms & Health Checks',
            detail:
              'Use Round Robin when all servers have equal specs and fast requests. Use Least Connections when some requests take much longer than others. Always configure active Health Checks (/healthz) so the load balancer automatically stops sending traffic to a crashed server.',
          },
        ],
      },
      {
        id: 'caching-and-cdn-in-practice',
        eyebrow: '03 · Speed & Low Latency',
        title: 'Caching (Redis) & CDNs: Making Slow Systems 1,000x Faster',
        paragraphs: [
          'The slowest part of almost every web request is reading from a database disk. Reading data from RAM (in-memory storage like Redis or Memcached) takes about 100 nanoseconds, while reading from an SSD database takes around 100 microseconds, meaning RAM is roughly 1,000 times faster than disk.',
          'A Cache stores the results of expensive database queries or frequent calculations in RAM so you do not hit your database for the same data over and over again. Meanwhile, a CDN (Content Delivery Network like Cloudflare or AWS CloudFront) caches static files (images, CSS, JS, videos) on edge servers located in cities around the world, physically close to your users.',
        ],
        analogy: {
          title: 'Beginner Analogy: Desk Drawer vs. National Archive',
          text: 'Your primary Database is a massive library across town: it holds every book ever written, but driving there takes 30 minutes. Redis Cache is the small drawer on your desk where you keep the 5 notebooks you use every single hour. A CDN is placing copies of your most popular books in local neighborhood kiosks so customers do not have to travel to your headquarters.',
        },
        example: {
          title: 'Step-by-Step Practical Pattern: Cache-Aside (Lazy Loading)',
          description:
            'Cache-Aside is the most common caching pattern used in backend engineering. Here is how your API handles a request like GET /products/101:',
          steps: [
            '1. Check the Cache first: Your backend asks Redis for key "product:101".',
            '2. Cache Hit (Fast Path): If "product:101" exists in Redis, return the JSON immediately in ~1 ms. The database is never touched!',
            '3. Cache Miss (Slow Path): If the key is not in Redis, query PostgreSQL: SELECT * FROM products WHERE id = 101.',
            '4. Populate Cache with TTL: Save the database result into Redis with an expiration time (e.g., TTL = 300 seconds) and return the result to the user.',
            '5. Cache Invalidation on Update: Whenever an admin updates Product 101 (PUT /products/101), update PostgreSQL first and immediately DELETE "product:101" from Redis so users never see stale prices.',
          ],
          code: `// Practical Cache-Aside flow in pseudocode
async function getProduct(productId: string) {
  const cacheKey = \`product:\${productId}\`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached); // 1. Cache Hit (~1ms)

  const product = await db.query('SELECT * FROM products WHERE id = $1', [productId]); // 2. Cache Miss
  await redis.set(cacheKey, JSON.stringify(product), { EX: 300 }); // 3. Save with 5-min TTL
  return product;
}`,
        },
        callout:
          'Architect Takeaway: Follow the 80/20 Pareto Rule, 80% of your read traffic usually accesses only 20% of your data (like today’s top products or trending posts). Caching just that 20% in Redis can reduce database load by 80%.',
      },
      {
        id: 'databases-sql-nosql-indexing-n-plus-one',
        eyebrow: '04 · Data Storage & Query Performance',
        title:
          'Databases: SQL vs. NoSQL, B-Tree Indexing & Fixing the N+1 Query Problem',
        paragraphs: [
          'How do you choose between a Relational Database (SQL like PostgreSQL or MySQL) and a Non-Relational Database (NoSQL like MongoDB, Redis, or Cassandra)? Senior engineers never pick a database because it is trendy; they pick it based on data relationships, consistency guarantees, and read/write access patterns.',
          'SQL databases store structured data in tables with strict schemas and enforce ACID transactions (Atomicity, Consistency, Isolation, Durability). If a user transfers $100 from Account A to Account B, ACID guarantees that either both accounts update together, or neither changes if the server crashes mid-way.',
          'NoSQL databases trade away complex multi-table joins in exchange for flexible schemas and massive horizontal write speed. In practice, most large systems use both: PostgreSQL for users, orders, and payments, paired with Redis for caching and Cassandra or MongoDB for high-volume activity logs.',
        ],
        table: {
          caption: 'Practical Guide: Which Database Should You Choose?',
          headers: ['Database Type', 'Best Used For', 'Popular Examples'],
          rows: [
            [
              'Relational (SQL)',
              'Financial balances, orders, inventory, user accounts, strict ACID transactions',
              'PostgreSQL, MySQL',
            ],
            [
              'Key-Value (NoSQL)',
              'Sub-millisecond caching, user sessions, rate limit counters, leaderboards',
              'Redis, Memcached, DynamoDB',
            ],
            [
              'Document (NoSQL)',
              'Product catalogs with varying attributes, CMS articles, flexible JSON profiles',
              'MongoDB, Firestore',
            ],
            [
              'Wide-Column (NoSQL)',
              'Billions of write-heavy chat messages, IoT telemetry, activity history',
              'Apache Cassandra, ScyllaDB',
            ],
            [
              'Search Engine',
              'Full-text search, typo-tolerant autocomplete, log filtering',
              'Elasticsearch, OpenSearch, Meilisearch',
            ],
          ],
        },
        example: {
          title: 'Two Practical Database Traps Every Engineer Must Master',
          description:
            'Before buying a bigger database server, check for missing indexes and the N+1 Query Problem, the two most common causes of slow production APIs:',
          steps: [
            '1. Missing Database Index (Full Table Scan): Without an index on users(email), running WHERE email = "charly@example.com" forces the database to check all 10 million rows one by one. Adding a B-Tree Index is like adding an alphabetical index at the back of a textbook, the database jumps straight to the exact row in O(log N) time. Trade-off: Indexes make SELECTs much faster, but slightly slow down INSERT/UPDATE because the index tree must also be updated.',
            '2. The N+1 Query Problem: Suppose you fetch 50 blog posts (1 query), and then inside a for-loop you run a query to fetch the author of each post (50 more queries). That is 51 round-trips to the database for a single page! Fix it by using a SQL JOIN or batching with WHERE author_id IN (...) so the database does all the work in 1 or 2 queries.',
          ],
          code: `-- ❌ BAD: N+1 Query Problem (1 query + 50 queries inside a loop = 51 queries)
SELECT * FROM articles LIMIT 50;
-- Inside loop for each article:
SELECT name FROM users WHERE id = 101;
SELECT name FROM users WHERE id = 102; -- ...repeated 50 times!

-- ✅ GOOD: Single Eager-Loaded Query (Only 1 query total)
SELECT a.id, a.title, u.name AS author_name
FROM articles a
JOIN users u ON a.author_id = u.id
LIMIT 50;`,
        },
      },
      {
        id: 'scaling-databases-replication-sharding-cap',
        eyebrow: '05 · Distributed Data at Scale',
        title:
          'Scaling Databases: Replication, Sharding & The CAP Theorem Explained Simply',
        paragraphs: [
          'What happens when you have optimized your queries and added indexes, but your single PostgreSQL server is still overwhelmed by millions of users? You scale your database layer in two stages: first Replication (for read-heavy traffic), and later Sharding (when write volume or storage outgrows one machine).',
          'In Master-Slave (Primary-Replica) Replication, all write operations (INSERT, UPDATE, DELETE) go to one Primary node. The Primary then copies those changes to multiple Read Replicas, which handle all the heavy SELECT queries. If the Primary crashes, a Read Replica is promoted to become the new Primary.',
          'In Database Sharding (Horizontal Partitioning), you split one giant 500-million-row table into smaller pieces (shards) stored across separate database servers, for example, Shard 1 holds users with IDs 1–10M, Shard 2 holds 10M–20M, or rows are distributed evenly using Consistent Hashing.',
        ],
        analogy: {
          title:
            'Beginner Analogy: The CAP Theorem (Consistency vs. Availability)',
          text: 'Imagine you and your spouse share a joint bank account with $100, and there are two ATMs in different cities. Suddenly, the internet cable between the two cities is cut (a Network Partition). If you try to withdraw $100 at ATM 1 while your spouse tries to withdraw $100 at ATM 2, the bank has two choices: 1) Consistency (CP): Freeze the ATMs and refuse the withdrawal until the cable is fixed so you cannot withdraw $200 from a $100 balance. 2) Availability (AP): Let the ATM dispense cash to keep customers happy, then reconcile any overdraft later when the connection comes back.',
        },
        highlights: [
          {
            label: 'Watch Out for Replication Lag',
            detail:
              'When replication is asynchronous, it may take 50–200ms for a new row written on the Primary to appear on a Read Replica. If a user updates their profile and immediately refreshes the page, read their own profile from the Primary (Read-Your-Own-Writes consistency) so they do not think their save failed.',
          },
          {
            label: 'Why Consistent Hashing Matters for Sharding',
            detail:
              'If you shard data using simple modulo math (user_id % 4 servers) and later add a 5th server (user_id % 5), almost 80% of your keys change location and must be moved at once! Consistent Hashing places servers on a virtual ring so adding a new server only moves ~1/N of the data.',
          },
        ],
        callout:
          'Architect Takeaway: Sharding makes cross-shard joins and transactions painful. Always exhaust Indexing, Query Tuning, Redis Caching, and Read Replicas before sharding a database.',
      },
      {
        id: 'asynchronous-messaging-queues-pubsub-microservices',
        eyebrow: '06 · Asynchronous Architecture',
        title:
          'Message Queues, Pub/Sub & Decoupling Slow Work from User Requests',
        paragraphs: [
          'One of the biggest mistakes in backend development is doing slow work while the user is waiting for an HTTP response. If a user clicks "Checkout" and your server synchronously charges their card, generates a PDF invoice, sends a confirmation email, and notifies the warehouse before returning HTTP 200, the user stares at a spinning loader for 8 seconds, and if the email server is down, the whole checkout fails!',
          'Instead, modern systems keep the main HTTP request fast (validate order + save to DB in 50ms) and push everything else into the background using asynchronous messaging.',
          'There are two core messaging patterns you must know: a Message Queue (Point-to-Point, like RabbitMQ or AWS SQS), where one job is picked up by exactly one worker, and Publish-Subscribe / Event Streaming (like Apache Kafka or Google Pub/Sub), where one event is broadcast to many independent services at the same time.',
        ],
        analogy: {
          title: 'Beginner Analogy: The Coffee Shop Cashier vs. Barista Queue',
          text: 'In a synchronous system, the cashier takes your money, walks over to the espresso machine, steams the milk, and makes your latte for 4 minutes while 20 customers wait angrily in line. In an asynchronous Message Queue system, the cashier takes your payment in 10 seconds, hands you a receipt, and sticks your cup on the counter queue. Background baristas (Workers) pick up cups from the queue at their own pace while the cashier immediately serves the next customer.',
        },
        example: {
          title: 'Practical Checkout Architecture: Queue vs. Pub/Sub Fanout',
          description:
            'Here is how an e-commerce backend handles an OrderPaid event cleanly without coupling services together:',
          steps: [
            '1. Fast HTTP Response: Order Service records the payment in PostgreSQL and publishes a single "OrderPaid" event to a topic, then immediately returns HTTP 200 OK to the user.',
            '2. Parallel Fanout (Pub/Sub): Four separate services subscribe to "OrderPaid" and react in parallel: Notification Service sends the email receipt, Warehouse Service prepares shipping, Loyalty Service adds reward points, and Analytics Service updates daily revenue.',
            '3. Safe Retries & Dead-Letter Queue (DLQ): If the email provider is temporarily down, Notification Service retries with Exponential Backoff (wait 2s, 4s, 8s). If it still fails after 5 attempts, the message moves to a Dead-Letter Queue (DLQ) so engineers can inspect and replay it without blocking new emails.',
          ],
        },
        highlights: [
          {
            label: 'RabbitMQ / SQS vs. Apache Kafka',
            detail:
              'RabbitMQ and AWS SQS are traditional task queues: once a worker finishes a job, the message is deleted from the queue. Apache Kafka is an append-only event log stored on disk: events stay in Kafka for days or weeks, allowing new services to replay historical events from the beginning.',
          },
          {
            label: 'Monolith vs. Modular Monolith vs. Microservices',
            detail:
              'Do not start a brand-new project with 15 microservices, you will drown in network latency, distributed debugging, and deployment complexity. Start with a Clean Modular Monolith (well-separated domain modules in one deployable unit) and extract only the specific services that need independent scaling.',
          },
        ],
      },
      {
        id: 'resiliency-rate-limiting-circuit-breaker-idempotency',
        eyebrow: '07 · Production Resiliency & Safety',
        title:
          'Rate Limiting, Circuit Breakers & Idempotency: Protecting Production Systems',
        paragraphs: [
          'In production, anything that can go wrong eventually will: mobile users on shaky 4G connections will tap the "Pay Now" button three times in a row, third-party APIs will hang for 30 seconds, and bots will hammer your login endpoint.',
          'To survive real-world traffic, every production backend relies on three essential defensive patterns: Rate Limiting at the front door, Circuit Breakers between internal services, and Idempotency on every state-changing API.',
        ],
        example: {
          title: 'How Idempotency Prevents Charging a Customer Twice',
          description:
            'Imagine a customer taps "Pay $50". Your server charges their card, but just as the response is travelling back to their phone, their Wi-Fi drops. Their phone automatically retries POST /payments. Without idempotency, they get charged $100! Here is how an Idempotency-Key solves this in 4 steps:',
          steps: [
            '1. Client Generates a Unique Key: When the user opens the checkout screen, the app generates a UUID (e.g., Idempotency-Key: "order_991_attempt_1") and sends it in the HTTP request header.',
            '2. Server Checks the Key First: Before charging the card, the backend checks Redis/DB: "Have we already seen Idempotency-Key order_991_attempt_1?"',
            '3. First Request (Process & Save): If the key is new, the server locks the key, processes the $50 payment, saves the final JSON receipt under that key, and returns it.',
            '4. Duplicate Retry (Return Saved Receipt): When the phone retries 2 seconds later with the exact same Idempotency-Key, the server sees the key already completed and simply returns the saved receipt without charging the card a second time.',
          ],
          code: `POST /api/v1/payments HTTP/1.1
Host: api.example.com
Idempotency-Key: 8f14e45f-ceea-467f-a8f1-44c09e09112a
Content-Type: application/json

{ "orderId": "ORD-991", "amount": 50000 }`,
        },
        highlights: [
          {
            label: 'Rate Limiting (Token Bucket Algorithm)',
            detail:
              'Picture a bucket that holds up to 60 tokens and refills at 1 token per second. Every API request from a user takes 1 token from their bucket. If a bot fires 1,000 requests in a second, the bucket empties and the server immediately rejects extra requests with HTTP 429 Too Many Requests.',
          },
          {
            label: 'Circuit Breaker (Closed → Open → Half-Open)',
            detail:
              'Works just like the electrical fuse box in your house. In Closed state, calls pass through normally. If a downstream service fails >50% of the time, the breaker trips to Open and fails fast for 30 seconds so your server threads do not freeze waiting. In Half-Open state, it lets a few test requests through to check if the service has recovered.',
          },
        ],
        callout:
          'Architect Takeaway: Any POST, PUT, or PATCH endpoint that moves money, creates an order, or sends a notification must require an Idempotency-Key and enforce strict timeouts + Circuit Breakers on downstream calls.',
      },
      {
        id: 'realtime-and-location-systems',
        eyebrow: '08 · Real-Time & Location Search',
        title:
          'WebSockets, Server-Sent Events (SSE) & How Ride-Hailing Apps Find Nearby Drivers',
        paragraphs: [
          'Standard HTTP works on a request-response cycle: the server only speaks when the browser asks a question. That is fine for loading web pages, but terrible for chat apps (WhatsApp), live stock tickers, AI streaming responses, or tracking a Gojek/Uber driver moving on a map.',
          'To push data in real time without forcing the browser to ask "Any new messages?" every second (Short Polling), engineers choose between Long Polling, Server-Sent Events (SSE), and WebSockets.',
        ],
        table: {
          caption: 'Practical Comparison: Real-Time Communication Protocols',
          headers: ['Protocol', 'Direction', 'Best Practical Use Case'],
          rows: [
            [
              'Long Polling',
              'Client requests → Server holds request open until new data arrives',
              'Simple notification fallback when WebSockets are blocked',
            ],
            [
              'Server-Sent Events (SSE)',
              'One-Way (Server → Client over standard HTTP)',
              'AI text streaming (ChatGPT style), live sports scores, stock price tickers, status feeds',
            ],
            [
              'WebSockets',
              'Two-Way Full-Duplex (Client ↔ Server persistent TCP connection)',
              'WhatsApp/Telegram chat, multiplayer games, collaborative docs, live driver GPS exchanges',
            ],
          ],
        },
        example: {
          title:
            'How Gojek, Grab & Uber Find Drivers Within 1 km in <10ms (Geohashing & Quadtrees)',
          description:
            'If you have 1 million active drivers and run SELECT * FROM drivers WHERE lat BETWEEN X1 AND X2 AND lng BETWEEN Y1 AND Y2, a standard database grinds to a halt because B-Tree indexes cannot efficiently search two dimensions (latitude AND longitude) at once.',
          steps: [
            '1. Geohashing (2D to 1D String): Geohashing divides the world map into a grid and encodes any (Latitude, Longitude) pair into a short string like "qqguw4". Two people standing on the same street share the same 6-character prefix ("qqguw4")!',
            '2. Instant Prefix Lookup: Finding all drivers within ~1 km turns into a simple, lightning-fast indexed lookup in Redis (GEORADIUS / GEOSEARCH) or SQL (WHERE geohash LIKE "qqguw4%").',
            '3. Quadtrees for Dense Cities: In memory, a Quadtree dynamically splits crowded areas (like downtown Jakarta at rush hour) into smaller 4-quadrant boxes while keeping empty oceans and forests as large single boxes, saving massive amounts of memory.',
          ],
        },
      },
      {
        id: 'seven-step-framework-and-cheatsheet',
        eyebrow: '09 · Interview & Architecture Playbook',
        title:
          'The 7-Step System Design Framework & Quick Reference Cheat Sheet',
        paragraphs: [
          'Whether you are designing a new production microservice at work or answering a 45-minute System Design Interview question (like "Design Bitly", "Design WhatsApp", or "Design Netflix"), never jump straight into drawing database boxes. Follow a structured 7-step playbook so your design stays grounded in real requirements.',
        ],
        example: {
          title:
            'The 7-Step Playbook (With a Quick URL Shortener / Bitly Example)',
          steps: [
            'Step 1 — Clarify Requirements (3–5 min): Ask what features are in scope (Functional: shorten a long URL into a 7-character code and redirect) and what scale/quality is required (Non-Functional: 100:1 read-to-write ratio, <20ms redirect latency, 99.99% uptime).',
            'Step 2 — Back-of-the-Envelope Estimation (5 min): Use the 100,000 seconds/day shortcut! If users create 100 million URLs/month, that is ~40 writes/sec. With a 100:1 read ratio, that is 4,000 redirects/sec, meaning we definitely need Redis caching for hot links.',
            'Step 3 — Data Model & Storage (5 min): Define small, clear tables (e.g., urls(id, short_code VARCHAR(7) UNIQUE INDEX, original_url, created_at, expires_at)) and pick PostgreSQL or DynamoDB.',
            'Step 4 — API Contracts (5 min): Write clean endpoints: POST /api/v1/urls (takes longUrl, returns shortUrl) and GET /{shortCode} (returns HTTP 301/302 redirect to Location: originalUrl).',
            'Step 5 — High-Level Architecture (10 min): Draw the end-to-end flow: Client → CDN/Cloudflare → Load Balancer → Stateless URL Service → Redis Cache (80/20 rule) → Database + Read Replicas.',
            'Step 6 — Deep Dive into the Hardest Problem (10 min): Explain how to generate unique 7-character codes without collisions using a Distributed 64-bit ID Generator (Twitter Snowflake) converted to Base62 ([0-9, a-z, A-Z] → 62^7 = 3.5 trillion unique links!).',
            'Step 7 — Identify Bottlenecks & Failure Modes (5 min): Add Rate Limiting to stop spam bots, active-active Load Balancers to remove Single Points of Failure (SPOF), and Redis cache TTLs.',
          ],
        },
        table: {
          caption: 'Architect Cheat Sheet: Problem → Right Technology',
          headers: [
            'System Requirement / Problem',
            'Recommended Solution & Tool',
          ],
          rows: [
            [
              'Financial ledger, orders, user accounts (strict ACID)',
              'Relational Database → PostgreSQL / MySQL',
            ],
            [
              'Fast caching, session storage, rate limiting, leaderboards',
              'In-Memory Key-Value Store → Redis',
            ],
            [
              'Billions of chat messages or high-velocity write logs',
              'Wide-Column NoSQL → Apache Cassandra / ScyllaDB',
            ],
            [
              'Full-text search, product filtering & autocomplete',
              'Inverted-Index Search Engine → Elasticsearch / OpenSearch',
            ],
            [
              'Photos, videos, PDFs, static backups',
              'Object Storage + Edge CDN → Amazon S3 + Cloudflare',
            ],
            [
              'Offloading slow background jobs (emails, PDFs, webhooks)',
              'Point-to-Point Message Queue → RabbitMQ / Amazon SQS',
            ],
            [
              'High-throughput event streaming & multi-service fanout',
              'Distributed Event Log → Apache Kafka / Google Pub/Sub',
            ],
            [
              'Fast internal microservice-to-microservice calls',
              'Binary RPC over HTTP/2 → gRPC (Protocol Buffers)',
            ],
            [
              'Two-way real-time chat or live gameplay',
              'Persistent Full-Duplex TCP → WebSockets',
            ],
            [
              'Finding nearby drivers or restaurants within 1 km',
              'Spatial Index → Geohash (Redis Geo) / In-Memory Quadtree',
            ],
          ],
        },
        callout:
          'Quick Mental Math Shortcut: 1 day = 86,400 seconds ≈ 100,000 seconds (10^5). So 1 million requests/day ≈ 12 RPS; 10 million/day ≈ 120 RPS; 100 million/day ≈ 1,200 RPS; 1 billion/day ≈ 12,000 RPS.',
      },
    ],
    externalResource: {
      label: 'Read the Complete Open-Source System Design Handbook on GitHub',
      url: 'https://github.com/charlybutar21/system-design',
      note: 'Want to dive even deeper? This article is adapted from my complete open-source System Design repository. Check out the GitHub repository for the full study roadmap, architecture diagrams, and end-to-end interview case studies:',
      highlights: [
        '6 Complete Modules covering Networking, Databases, Distributed Architecture, Resiliency, Security, and Capacity Math',
        '5 Full End-to-End Case Studies: URL Shortener (Bitly), WhatsApp Chat, Twitter/X Newsfeed, Netflix Video Streaming, and Uber/Gojek Ride-Hailing',
        '30+ Visual Architecture Diagrams (.excalidraw) & Interview Cheat Sheets',
      ],
    },
  },
];
