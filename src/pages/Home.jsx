import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page">
      <section className="hero">
        <div className="container hero-inner">
          <span className="eyebrow">AI Sales Enablement</span>
          <h1>Train every rep with an AI buyer that never gets tired.</h1>
          <p className="lede">
            Mockcall AI runs realistic sales roleplay against AI-powered buyer
            personas, scores every call, and helps your SDR team close with
            confidence — before they ever pick up a real phone.
          </p>
          <div className="hero-actions">
            <Link to="/sales-roleplay" className="btn btn-primary">
              Try a roleplay
            </Link>
            <Link to="/pricing" className="btn btn-secondary">
              View pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Everything a modern revenue team needs</h2>
            <p>
              One platform to train, measure, and improve the way your team
              sells — powered by conversational AI.
            </p>
          </div>
          <div className="card-grid">
            <div className="card">
              <div className="card-icon">R</div>
              <h3>Roleplay bots</h3>
              <p>
                Practice cold calls and discovery against personas modeled on
                your real buyer segments.
              </p>
            </div>
            <div className="card">
              <div className="card-icon">S</div>
              <h3>Call scoring</h3>
              <p>
                Every roleplay is scored on objection handling, discovery
                depth, and talk-to-listen ratio.
              </p>
            </div>
            <div className="card">
              <div className="card-icon">P</div>
              <h3>Playbook coaching</h3>
              <p>
                Reps get instant, actionable feedback mapped to your team's
                own sales playbook.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <div>
              <h2>See it running on your own pipeline</h2>
              <p>Book a walkthrough with our team — takes 20 minutes.</p>
            </div>
            <Link to="/contact" className="btn btn-primary">
              Request a demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
