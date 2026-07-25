import ContactForm from "../components/ContactForm";

export default function Contact() {
  return (
    <div className="page">
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="container hero-inner">
          <span className="eyebrow">Request a demo</span>
          <h1>See Mockcall AI on your own sales floor.</h1>
          <p className="lede">
            Tell us a little about your team and we'll set up a walkthrough
            tailored to how your reps sell today.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container contact-layout">
          <div className="contact-side">
            <div className="card">
              <div className="card-icon">1</div>
              <h3>20-minute walkthrough</h3>
              <p>See roleplay bots, scoring, and coaching in a live session.</p>
            </div>
            <div className="card">
              <div className="card-icon">2</div>
              <h3>Tailored to your playbook</h3>
              <p>We'll map personas to the deals your team actually works.</p>
            </div>
            <div className="card">
              <div className="card-icon">3</div>
              <h3>No commitment</h3>
              <p>Just a conversation about whether it's a fit for your team.</p>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </div>
  );
}
