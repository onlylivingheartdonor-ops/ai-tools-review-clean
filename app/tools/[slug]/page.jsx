import { AI_TOOLS } from "../../lib/tools";
import { notFound } from "next/navigation";
import Link from "next/link";

// Generate static paths for all tools at build time (SEO friendly)
export async function generateStaticParams() {
  return AI_TOOLS.map((tool) => ({ slug: tool.slug }));
}

// Generate metadata for each tool page
export async function generateMetadata({ params }) {
  const tool = AI_TOOLS.find((t) => t.slug === params.slug);
  if (!tool) return { title: "Tool Not Found" };
  
  return {
    title: `${tool.name} Review 2026: ${tool.tagline}`,
    description: `Complete ${tool.name} review. ${tool.pros.split(",")[0]}. ${tool.cons.split(",")[0]}. ${tool.commission} commission.`,
    alternates: { canonical: `https://yoursite.com/tools/${tool.slug}` },
  };
}

export default function ToolPage({ params }) {
  const tool = AI_TOOLS.find((t) => t.slug === params.slug);
  
  if (!tool) {
    notFound();
  }

  const prosList = tool.pros.split(",").map(p => p.trim());
  const consList = tool.cons.split(",").map(c => c.trim());

  return (
    <main style={{ maxWidth: "780px", margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "'DM Mono', monospace" }}>
      <Link href="/" style={{ fontSize: "12px", color: "#888", textDecoration: "none" }}>← Back to all tools</Link>
      
      <div style={{ marginTop: "1.5rem", marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem,5vw,3rem)", marginBottom: "0.5rem" }}>
          {tool.name} <span style={{ color: "#7c3aed" }}>Review 2026</span>
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#666" }}>{tool.tagline}</p>
      </div>

      {/* Call to Action Banner */}
      <div style={{ background: "#7c3aed", color: "white", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem", textAlign: "center" }}>
        <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Try {tool.name} Risk-Free</p>
        <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>{tool.freeTier}</p>
        <a href={tool.affiliateLink} target="_blank" rel="noopener noreferrer" style={{ background: "white", color: "#7c3aed", padding: "0.5rem 1.5rem", borderRadius: "4px", textDecoration: "none", fontWeight: "bold" }}>
          Get Started →
        </a>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ background: "#f5f3ef", padding: "1rem", borderRadius: "8px" }}><strong>💰 Commission</strong><br />{tool.commission}</div>
        <div style={{ background: "#f5f3ef", padding: "1rem", borderRadius: "8px" }}><strong>🍪 Cookie Duration</strong><br />{tool.cookie}</div>
        <div style={{ background: "#f5f3ef", padding: "1rem", borderRadius: "8px" }}><strong>🎯 Best For</strong><br />{tool.bestFor}</div>
        <div style={{ background: "#f5f3ef", padding: "1rem", borderRadius: "8px" }}><strong>💸 Starting Price</strong><br />{tool.priceRange}</div>
      </div>

      {/* Review Content (expands as you write more) */}
      <div style={{ lineHeight: "1.7", color: "#444" }}>
        <p>{tool.longFormContent}</p>
      </div>

      {/* Pros and Cons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", margin: "2rem 0" }}>
        <div style={{ background: "#e8f4f0", padding: "1.5rem", borderRadius: "8px" }}>
          <h3 style={{ marginBottom: "1rem", color: "#0f6e56" }}>✓ Pros</h3>
          <ul style={{ paddingLeft: "1.2rem" }}>
            {prosList.map((pro, i) => (<li key={i} style={{ marginBottom: "0.5rem" }}>{pro}</li>))}
          </ul>
        </div>
        <div style={{ background: "#fff0f0", padding: "1.5rem", borderRadius: "8px" }}>
          <h3 style={{ marginBottom: "1rem", color: "#b91c1c" }}>✗ Cons</h3>
          <ul style={{ paddingLeft: "1.2rem" }}>
            {consList.map((con, i) => (<li key={i} style={{ marginBottom: "0.5rem" }}>{con}</li>))}
          </ul>
        </div>
      </div>

      {/* Final CTA */}
      <div style={{ background: "#1a1a1a", color: "white", padding: "2rem", borderRadius: "8px", textAlign: "center", marginTop: "2rem" }}>
        <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Ready to scale your content creation?</p>
        <p style={{ marginBottom: "1rem" }}>Start your {tool.name} trial today.</p>
        <a href={tool.affiliateLink} target="_blank" rel="noopener noreferrer" style={{ background: "#7c3aed", color: "white", padding: "0.75rem 2rem", borderRadius: "4px", textDecoration: "none", display: "inline-block" }}>
          {tool.commission.includes("recurring") ? "Start Earning Recurring Commission →" : "Get Started →"}
        </a>
      </div>

      {/* Footer */}
      <div style={{ fontSize: "11px", color: "#888", borderTop: "1px solid #e0dbd3", paddingTop: "1rem", marginTop: "2rem" }}>
        This site contains affiliate links. We may earn a commission if you purchase through our links.
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          <a href="/privacy" style={{ color: "#888" }}>Privacy Policy</a>
          <a href="/terms" style={{ color: "#888" }}>Terms of Service</a>
        </div>
      </div>
    </main>
  );
}