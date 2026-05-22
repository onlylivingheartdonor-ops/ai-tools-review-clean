"use client";

import Link from "next/link";
import { AI_TOOLS } from "./lib/tools";
import { RELATED_LINKS as RELATED } from "./lib/links";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #faf8f4; font-family: 'DM Mono', monospace; color: #1a1a1a; }
  .container { max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem; }
  .header { border-bottom: 2px solid #1a1a1a; padding-bottom: 1.5rem; margin-bottom: 2rem; }
  .eyebrow { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: #888; margin-bottom: .5rem; }
  h1 { font-family: 'DM Serif Display', serif; font-size: clamp(2rem, 5vw, 3.2rem); line-height: 1.1; margin-bottom: 1rem; }
  h1 em { font-style: italic; color: #7c3aed; }
  .card { background: #fff; border: 1px solid #e0dbd3; border-radius: 4px; padding: 1.5rem; margin-bottom: 1.5rem; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #e0dbd3; vertical-align: top; }
  th { background: #f5f3ef; font-weight: 600; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; }
  .tool-logo { width: 40px; height: 40px; background: #7c3aed; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-family: serif; font-size: 1.2rem; }
  .commission-badge { background: #e8f4f0; color: #0f6e56; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 11px; font-weight: 600; white-space: nowrap; }
  .btn-review { background: #1a1a1a; color: white; padding: 0.3rem 0.8rem; border-radius: 4px; text-decoration: none; font-size: 11px; white-space: nowrap; }
  .btn-review:hover { background: #7c3aed; }
  .status-badge { font-size: 10px; padding: 0.2rem 0.5rem; border-radius: 4px; background: #f5f3ef; color: #888; }
  .status-live { background: #e8f4f0; color: #0f6e56; }
  @media (max-width: 800px) { th, td { padding: 0.5rem; } .commission-badge { white-space: normal; } }
`;

export default function HomePage() {
  return (
    <>
      <style>{css}</style>
      <main className="container">
        <div className="header">
          <p className="eyebrow">Curated for Creators</p>
          <h1>Best AI Tools for Creators<br /><em>2026 Comparison</em></h1>
        </div>

        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Tool</th>
                <th>Best For</th>
                <th>Commission</th>
                <th>Cookie</th>
                <th>Free Tier</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {AI_TOOLS.map((tool) => (
                <tr key={tool.slug}>
                  <td style={{ fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div className="tool-logo">{tool.logo}</div>
                      <div>
                        <div>{tool.name}</div>
                        <div style={{ fontSize: "11px", color: "#888" }}>{tool.tagline}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {tool.bestFor}
                    <div style={{ fontSize: "11px", color: "#888", marginTop: "0.25rem" }}>{tool.priceRange}</div>
                  </td>
                  <td><span className="commission-badge">{tool.commission}</span></td>
                  <td>{tool.cookie}</td>
                  <td>{tool.freeTier}</td>
                  <td>
                    <Link href={`/tools/${tool.slug}`} className="btn-review">
                      {tool.reviewStatus === "live" ? "Read Review →" : "Coming Soon"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Adsterra Ad Slot */}
        <div className="card" style={{ textAlign: "center", fontSize: "12px", color: "#888" }}>
          <p>Advertisement</p>
          <div id="adsterra-ad"></div>
        </div>

        <div className="card">
          <div className="disclaimer" style={{ fontSize: "11px", color: "#888", borderTop: "1px solid #e0dbd3", paddingTop: "1rem" }}>
            This site contains affiliate links. We may earn a commission if you purchase through our links, at no extra cost to you.
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem" }}>
              <a href="/privacy" style={{ color: "#888", textDecoration: "underline" }}>Privacy Policy</a>
              <a href="/terms" style={{ color: "#888", textDecoration: "underline" }}>Terms of Service</a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}