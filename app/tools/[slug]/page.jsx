import { AI_TOOLS } from "../../lib/tools";
import { notFound } from "next/navigation";
import Link from "next/link";

// Lightweight markdown renderer — handles all the formatting used in longFormContent
function renderMarkdown(text) {
  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Section divider ---
    if (line === "---") {
      elements.push(<hr key={i} style={{ border: "none", borderTop: "2px solid #e0dbd3", margin: "2rem 0" }} />);
      i++;
      continue;
    }

    // H1
    if (line.startsWith("# ")) {
      elements.push(<h1 key={i} style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.6rem,4vw,2.2rem)", margin: "2rem 0 1rem" }}>{renderInline(line.slice(2))}</h1>);
      i++;
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      elements.push(<h2 key={i} style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", color: "#1a1a1a", margin: "2rem 0 0.75rem", paddingBottom: "0.4rem", borderBottom: "1px solid #e0dbd3" }}>{renderInline(line.slice(3))}</h2>);
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      elements.push(<h3 key={i} style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1a1a1a", margin: "1.5rem 0 0.5rem" }}>{renderInline(line.slice(4))}</h3>);
      i++;
      continue;
    }

    // Bold-only line used as a heading (e.g. **Week 1: ...**)
    if (line.startsWith("**") && line.endsWith("**") && !line.slice(2, -2).includes("**")) {
      elements.push(<h3 key={i} style={{ fontSize: "1.05rem", fontWeight: "700", color: "#1a1a1a", margin: "1.75rem 0 0.5rem" }}>{line.slice(2, -2)}</h3>);
      i++;
      continue;
    }

    // Markdown table
    if (line.startsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      const rows = tableLines.filter(r => !/^\|[-| :]+\|$/.test(r));
      const header = rows[0];
      const body = rows.slice(1);
      const parseCells = r => r.split("|").slice(1, -1).map(c => c.trim());

      elements.push(
        <div key={"table-" + i} style={{ overflowX: "auto", margin: "1.5rem 0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr>
                {parseCells(header).map((cell, ci) => (
                  <th key={ci} style={{ background: "#f5f3ef", padding: "0.75rem 1rem", textAlign: "left", fontWeight: "600", fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: "2px solid #e0dbd3", whiteSpace: "nowrap" }}>
                    {renderInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : "#faf8f4" }}>
                  {parseCells(row).map((cell, ci) => (
                    <td key={ci} style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e0dbd3", verticalAlign: "top" }}>
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Unordered list
    if (line.startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={"ul-" + i} style={{ paddingLeft: "1.4rem", margin: "0.75rem 0 1rem" }}>
          {items.map((item, ii) => (
            <li key={ii} style={{ marginBottom: "0.4rem", lineHeight: "1.6" }}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={"ol-" + i} style={{ paddingLeft: "1.4rem", margin: "0.75rem 0 1rem" }}>
          {items.map((item, ii) => (
            <li key={ii} style={{ marginBottom: "0.4rem", lineHeight: "1.6" }}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty line
    if (line === "") {
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} style={{ margin: "0 0 1rem", lineHeight: "1.75", color: "#444" }}>
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return elements;
}

// Renders inline markdown: **bold**, *italic*, `code`
function renderInline(text) {
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const m = match[0];
    if (m.startsWith("**")) {
      parts.push(<strong key={key++}>{m.slice(2, -2)}</strong>);
    } else if (m.startsWith("*")) {
      parts.push(<em key={key++}>{m.slice(1, -1)}</em>);
    } else if (m.startsWith("`")) {
      parts.push(<code key={key++} style={{ background: "#f0eee9", padding: "0.1rem 0.35rem", borderRadius: "3px", fontSize: "0.85em" }}>{m.slice(1, -1)}</code>);
    }
    last = match.index + m.length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : parts;
}

// Generate static paths for all tools at build time (SEO friendly)
export async function generateStaticParams() {
  return AI_TOOLS.map((tool) => ({ slug: tool.slug }));
}

// Generate metadata for each tool page
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = AI_TOOLS.find((t) => t.slug === slug);
  if (!tool) return { title: "Tool Not Found" };
  
  return {
    title: `${tool.name} Review 2026: ${tool.tagline}`,
    description: `Complete ${tool.name} review. ${tool.pros.split(",")[0]}. ${tool.cons.split(",")[0]}. ${tool.commission} commission.`,
    alternates: { canonical: `https://yoursite.com/tools/${tool.slug}` },
  };
}

export default async function ToolPage({ params }) {
  const { slug } = await params;
  const tool = AI_TOOLS.find((t) => t.slug === slug);
  
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

      {/* Review Content — rendered from markdown */}
      <div style={{ lineHeight: "1.7", color: "#444" }}>
        {renderMarkdown(tool.longFormContent)}
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
