import { Link } from "react-router-dom";

const PLANS = [
  {
    name: "Starter",
    price: "$29",
    per: "/ seat / mo",
    desc: "For small teams getting reps roleplay-ready.",
    features: [
      "3 buyer personas",
      "Unlimited roleplay sessions",
      "Basic call scoring",
      "Email support",
    ],
    featured: false,
  },
  {
    name: "Growth",
    price: "$79",
    per: "/ seat / mo",
    desc: "For revenue teams that want coaching at scale.",
    features: [
      "All persona archetypes",
      "Playbook-mapped coaching",
      "Team leaderboards",
      "Slack + CRM integrations",
      "Priority support",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    per: "",
    desc: "For orgs that need custom personas and SSO.",
    features: [
      "Custom-built buyer personas",
      "SSO & advanced permissions",
      "Dedicated success manager",
      "Custom reporting & API access",
    ],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <div className="page">
      <section className="hero">
        <div className="container hero-inner">
          <span className="eyebrow">Pricing</span>
          <h1>Simple plans that scale with your sales floor.</h1>
          <p className="lede">
            Start with a single team, then roll AI roleplay training out
            across every pod once you see the ramp-time impact.
          </p>
          <div className="hero-actions">
            <Link to="/contact" className="btn btn-primary">
              Talk to sales
            </Link>
            <Link to="/case-studies" className="btn btn-secondary">
              See results
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="pricing-grid">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={"price-card" + (plan.featured ? " featured" : "")}
              >
                <h3>{plan.name}</h3>
                <p className="price-desc">{plan.desc}</p>
                <div className="price">
                  {plan.price}
                  {plan.per && <span>{plan.per}</span>}
                </div>
                <ul>
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={
                    "btn " + (plan.featured ? "btn-primary" : "btn-secondary")
                  }
                >
                  {plan.price === "Custom" ? "Contact us" : "Get started"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
