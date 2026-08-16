import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fira_Code } from "next/font/google";
import SiteShell from "./components/SiteShell";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Charly Micolas Butarbutar | Senior Software Engineer",
  description: "Editorial portfolio of Charly Micolas Butarbutar, a backend-focused Senior Software Engineer specialising in technical leadership, service integration, and reliable delivery.",
  keywords: [
    "Charly Micolas", 
    "Charly Micolas Butarbutar", 
    "Backend Engineer", 
    "Software Engineer", 
    "Tech Lead", 
    "Jakarta", 
    "Indonesia",
    "Go",
    "Java",
    "Microservices",
    "PostgreSQL"
  ],
  authors: [{ name: "Charly Micolas Butarbutar", url: "https://charlymicolas.com" }],
  creator: "Charly Micolas Butarbutar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://charlymicolas.com",
    title: "Charly Micolas Butarbutar | Senior Software Engineer",
    description: "Editorial portfolio of Charly Micolas Butarbutar, a backend-focused Senior Software Engineer specialising in technical leadership, service integration, and reliable delivery.",
    siteName: "Charly Micolas Portfolio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${firaCode.variable}`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
