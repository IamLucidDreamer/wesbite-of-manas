import "./globals.css";
import { Inter } from "next/font/google";
import Header from '../components/Header';
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ofmanas.com";

export const metadata: Metadata = {
  title: {
    default: "Manas Shukla - Full Stack Engineer | Portfolio",
    template: "%s | Manas Shukla",
  },
  description:
    "Results-driven Software Engineer with 3+ years of experience in full-stack development, system architecture, and web performance optimization. Specializing in modern web technologies and building scalable applications.",
  keywords: [
    "Manas Shukla",
    "Full Stack Engineer",
    "Software Engineer",
    "Web Developer",
    "Portfolio",
    "React Developer",
    "Next.js Developer",
    "Full Stack Developer",
    "System Architecture",
    "Web Performance",
    "Frontend Developer",
    "Backend Developer",
  ],
  authors: [{ name: "Manas Shukla" }],
  creator: "Manas Shukla",
  publisher: "Manas Shukla",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Manas Shukla - Full Stack Engineer | Portfolio",
    description:
      "Results-driven Software Engineer with 3+ years of experience in full-stack development, system architecture, and web performance optimization.",
    siteName: "Manas Shukla Portfolio",
    images: [
      {
        url: "/images/bg_hero.png",
        width: 1200,
        height: 630,
        alt: "Manas Shukla - Full Stack Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manas Shukla - Full Stack Engineer | Portfolio",
    description:
      "Results-driven Software Engineer with 3+ years of experience in full-stack development, system architecture, and web performance optimization.",
    images: ["/images/bg_hero.png"],
    creator: "@manas_shukla",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  category: "portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Manas Shukla",
    jobTitle: "Full Stack Engineer",
    description:
      "Results-driven Software Engineer with 3+ years of experience in full-stack development, system architecture, and web performance optimization.",
    url: siteUrl,
    sameAs: [
      "https://github.com/iamluciddreamer",
      "https://www.linkedin.com/in/shuklamanas007/",
    ],
    email: "shuklamanasofficial@gmail.com",
    telephone: "+919569050543",
    knowsAbout: [
      "Full Stack Development",
      "System Architecture",
      "Web Performance Optimization",
      "React",
      "Next.js",
      "JavaScript",
      "TypeScript",
    ],
    alumniOf: [
      {
        "@type": "Organization",
        name: "Unacademy",
      },
      {
        "@type": "Organization",
        name: "Ionic Wealth by Angel One",
      },
    ],
    worksFor: [
      {
        "@type": "Organization",
        name: "Ionic Wealth by Angel One",
        jobTitle: "Founding Engineer",
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
