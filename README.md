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

### Option 2: Running with Docker (Local Only)
While the production deployment uses Static Export for Shared Hosting compatibility, you can still run the multi-stage Docker container locally to test behavior.

1. Build and run the container:
   ```bash
   docker compose up --build -d
   ```
2. Open [http://localhost:3005](http://localhost:3005) (Mapped to port 3005 to avoid port collisions).

## 🔄 CI/CD Pipeline (GitHub Actions for cPanel Shared Hosting)
[public](public)
This project is configured to deploy seamlessly to standard Shared Hosting environments (like cPanel) where Docker is not supported. It uses a **Static HTML Export** strategy.

Whenever code is pushed or merged into the `main` branch, the `.github/workflows/deploy.yml` pipeline executes the following stages:

1. **Lint & Build**: Runs `npm run lint` and `npm run build`. Next.js compiles the entire React application into pure, static HTML/CSS/JS files inside the `/out` directory.
2. **FTP Upload**: The pipeline automatically connects to your cPanel hosting using the FTP protocol and synchronizes the `/out` directory with your server's `public_html` directory.

### 🔑 Deployment Configuration (Secrets Setup)
To enable the automatic deployment to your Rumahweb cPanel hosting, you must configure the following **Secrets** in your GitHub Repository settings.

Go to **Settings > Secrets and variables > Actions > New repository secret**:
* `FTP_SERVER`: Your server's FTP host (usually your IP address or `ftp.charlymicolas.com`).
* `FTP_USERNAME`: Your cPanel or FTP username.
* `FTP_PASSWORD`: Your cPanel or FTP password.

> **Note**: Ensure that the `server-dir` in `deploy.yml` accurately points to your domain's root folder on cPanel (default is usually `./public_html/`).

---
*Architected and developed with ❤️ for clean code.*
