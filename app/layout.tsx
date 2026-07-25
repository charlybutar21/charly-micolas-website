import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fira_Code } from "next/font/google";
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
  title: "Charly Micolas Butarbutar | Backend Software Engineer",
  description: "Experienced Backend Software Engineer with over 8 years of experience in SaaS, PropTech, and FinTech. Portfolio of Charly Micolas.",
  keywords: [
    "Charly Micolas", 
    "Charly Micolas Butarbutar", 
    "Backend Engineer", 
    "Software Engineer", 
    "Tech Lead", 
    "Jakarta", 
    "Indonesia",
    "Go",
    "Node.js",
    "PostgreSQL"
  ],
  authors: [{ name: "Charly Micolas Butarbutar", url: "http://charlymicolas.com" }],
  creator: "Charly Micolas Butarbutar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "http://charlymicolas.com",
    title: "Charly Micolas Butarbutar | Backend Software Engineer",
    description: "Portfolio of Charly Micolas Butarbutar, a Backend Software Engineer with over 8 years of experience in SaaS, PropTech, and FinTech.",
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
        <div className="aurora-bg">
          <div className="aurora-blob aurora-blob-1"></div>
          <div className="aurora-blob aurora-blob-2"></div>
          <div className="aurora-blob aurora-blob-3"></div>
        </div>
        {children}
      </body>
    </html>
  );
}
