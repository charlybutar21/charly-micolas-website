# Charly Micolas - Software Engineer Backend Portfolio

Welcome to the source code of my professional portfolio website! This project is built with **Next.js 15**, **TypeScript**, and **CSS Modules** to showcase a robust, scalable, and visually premium representation of my work as a Senior Backend Engineer.

## 🚀 Technologies Used
* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** CSS Modules with CSS Variables (Vanilla CSS, zero dependencies for fast rendering)
* **Design Pattern:** Component-Based Architecture & Separation of Concerns
* **Deployment:** Docker (Standalone Multi-stage build)
* **CI/CD:** GitHub Actions (Automated Lint, Build, and Deploy)

## 🏗️ Architecture & Code Structure

The repository follows a clean, "Senior Engineer" approach to folder structure:

```
app/
├── components/      # Reusable React UI Components (Hero, About, Experience, etc.)
├── data/            # Centralized Data Layer (index.ts) containing all hardcoded CV content
├── types/           # TypeScript interfaces to enforce strict data typing
├── globals.css      # Premium Dark Mode styles (Glassmorphism, Glow variables)
├── layout.tsx       # Root layout with font configuration (Inter & Fira Code)
└── page.tsx         # Main page assembly
```

### Why this structure?
By completely decoupling the raw data (`app/data/`) from the UI components (`app/components/`), the application becomes highly scalable. The UI acts purely as a presentation layer mapped to strict TypeScript models, making future updates (or integrating a headless CMS) seamless without touching the React code.

## 💻 Getting Started (Local Development)

### Option 1: Running with Node & NPM
Ensure you have Node.js 22.x installed.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Running with Docker (Production Mirror)
The project includes a highly optimized multi-stage `Dockerfile` (Next.js standalone mode) to ensure exactly the same behavior across local and production environments.

1. Build and run the container:
   ```bash
   docker compose up --build -d
   ```
2. Open [http://localhost:3005](http://localhost:3005) (Mapped to port 3005 to avoid port collisions).

## 🔄 CI/CD Pipeline (GitHub Actions)

This project features a fully automated CI/CD pipeline defined in `.github/workflows/deploy.yml`. 
Whenever code is pushed or merged into the `main` branch, the pipeline executes the following stages:

1. **Lint & Build Test**: Runs `npm run lint` and `npm run build` to catch type errors, syntax issues, and ensure semantic HTML correctness.
2. **Docker Publish**: Builds a production-ready Docker image and automatically pushes it to **GitHub Container Registry (GHCR)**.
3. **Deploy to Server**: Connects to the remote production server via SSH, pulls the latest image from GHCR, and restarts the Docker containers with zero manual intervention.

### 🔑 Deployment Configuration (Secrets Setup)
To enable the deployment stage in the CI/CD pipeline once a server is acquired, you must configure the following **Secrets** in your GitHub Repository settings:

Go to **Settings > Secrets and variables > Actions > New repository secret**:
* `SERVER_HOST`: The IP address of your remote server (e.g., `192.168.1.1`).
* `SERVER_USERNAME`: The SSH login username (e.g., `root`, `ubuntu`).
* `SSH_PRIVATE_KEY`: Your private SSH key to securely authenticate to the server without a password.

---
*Architected and developed with ❤️ for clean code.*
