import { Link } from "react-router-dom";

export default function CaseStudies() {
  return (
    <div className="page">
      <section className="hero">
        <div className="container hero-inner">
          <span className="eyebrow">Case Studies</span>
          <h1>Teams that cut ramp time with AI roleplay.</h1>
          <p className="lede">
            A look at how revenue teams use Mockcall AI to get new reps to
            full productivity faster, and keep tenured reps sharp.
          </p>
          <div className="hero-actions">
            <Link to="/pricing" className="btn btn-primary">
              See pricing
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Request a demo
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card-grid">
            <div className="card">
              <span className="tag">SaaS · 40 reps</span>
              <h3>Northwind Cloud</h3>
              <div className="stat-row">
                <div className="stat">
                  <span className="num">-38%</span>
                  <span className="label">Ramp time</span>
                </div>
                <div className="stat">
                  <span className="num">2.1x</span>
                  <span className="label">Discovery calls booked</span>
                </div>
              </div>
              <p className="quote">
                "New SDRs run twenty roleplay calls before their first live
                dial. Managers stopped babysitting cold calls."
              </p>
              <p className="quote-by">— VP Sales, Northwind Cloud</p>
            </div>

            <div className="card">
              <span className="tag">Fintech · 120 reps</span>
              <h3>Ledgerly</h3>
              <div className="stat-row">
                <div className="stat">
                  <span className="num">+22%</span>
                  <span className="label">Win rate</span>
                </div>
                <div className="stat">
                  <span className="num">4.6</span>
                  <span className="label">Avg. coach score</span>
                </div>
              </div>
              <p className="quote">
                "Objection handling used to be the weakest part of our
                pipeline reviews. It's now our strongest metric."
              </p>
              <p className="quote-by">— Head of Enablement, Ledgerly</p>
            </div>

            <div className="card">
              <span className="tag">Manufacturing · 65 reps</span>
              <h3>Ferrow Industrial</h3>
              <div className="stat-row">
                <div className="stat">
                  <span className="num">-3 wks</span>
                  <span className="label">Time to first deal</span>
                </div>
                <div className="stat">
                  <span className="num">90%</span>
                  <span className="label">Weekly roleplay adoption</span>
                </div>
              </div>
              <p className="quote">
                "Reps actually enjoy practicing now instead of dreading role
                play with their manager."
              </p>
              <p className="quote-by">— Director of Sales, Ferrow Industrial</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <div>
              <h2>Want results like these?</h2>
              <p>Tell us about your team and we'll tailor a walkthrough.</p>
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
