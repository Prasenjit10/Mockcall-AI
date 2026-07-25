import { Link } from "react-router-dom";

export default function SalesRoleplay() {
  return (
    <div className="page">
      <section className="hero">
        <div className="container hero-inner">
          <span className="eyebrow">Sales Roleplay</span>
          <h1>Practice against a buyer who pushes back like a real one.</h1>
          <p className="lede">
            Our roleplay bots simulate skeptical procurement leads, curious
            first-time buyers, and everything in between — so reps walk into
            live calls having already handled the hard questions.
          </p>
          <div className="hero-actions">
            <Link to="/pricing" className="btn btn-primary">
              See plans
            </Link>
            <Link to="/case-studies" className="btn btn-secondary">
              Read case studies
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>A sample roleplay call</h2>
            <p>The bot adapts its tone and objections to the persona you select.</p>
          </div>

          <div className="transcript">
            <div className="bubble bot">
              <span className="label">AI Buyer · Procurement Lead</span>
              We already use a competitor for this. What would actually
              change if we switched?
            </div>
            <div className="bubble rep">
              <span className="label">Rep</span>
              Fair question — most of our customers switch for the coaching
              layer, not just the roleplay itself. Can I ask what your
              current onboarding time looks like?
            </div>
            <div className="bubble bot">
              <span className="label">AI Buyer · Procurement Lead</span>
              About six weeks, and ramp is still inconsistent across reps.
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Persona library</h2>
            <p>Pick a buyer archetype, difficulty, and objection set.</p>
          </div>
          <div className="card-grid">
            <div className="card">
              <span className="tag">Beginner</span>
              <h3>Curious first-timer</h3>
              <p>Friendly, asks open questions, good for onboarding new reps.</p>
            </div>
            <div className="card">
              <span className="tag">Advanced</span>
              <h3>Skeptical procurement</h3>
              <p>Price-sensitive, compares you to incumbents, tests your value story.</p>
            </div>
            <div className="card">
              <span className="tag">Expert</span>
              <h3>Distracted exec</h3>
              <p>Short on time, needs the point made in the first fifteen seconds.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
