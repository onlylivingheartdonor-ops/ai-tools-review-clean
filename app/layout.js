import { AI_TOOLS } from "./lib/tools";

export const metadata = {
  title: "Best AI Tools for Creators 2026 | Honest Reviews & Comparisons",
  description: "Independent reviews of the best AI tools for creators. Jasper, Copy.ai, Writesonic, Surfer SEO, and more. Compare commissions and features.",
  openGraph: {
    title: "Best AI Tools for Creators 2026",
    description: "Independent reviews and comparisons of AI tools for content creators.",
    url: "https://aitoolsforcreators.vercel.app",
    siteName: "AI Tools for Creators",
    locale: "en_US",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
	<meta name='impact-site-verification' value='3b8829bc-8f97-4931-b938-fc432ec8dfc2'>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3475627763908800" crossOrigin="anonymous"></script>
        {/* Adsterra script will go here */}
      </head>
      <body>{children}</body>
    </html>
  );
}