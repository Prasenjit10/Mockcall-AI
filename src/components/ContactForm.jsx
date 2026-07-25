import { useState } from "react";
import { getVisitedPages, clearVisitedPages } from "./PageTracker";

// Replace with your real n8n production webhook URL.
const N8N_WEBHOOK_URL = "https://prasenjitsasmal01.app.n8n.cloud/webhook-test/15948e3d-867a-423a-8c81-cae7aa2fed83";

const EMPTY_FORM = {
  name: "",
  email: "",
  company: "",
  designation: "",
  phone: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const payload = {
      ...form,
      visited_pages: getVisitedPages(),
    };

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook responded with status ${response.status}`);
      }

      // Success: clear the form and reset the tracked browsing history
      // so the next visitor starts from a blank slate.
      setForm(EMPTY_FORM);
      clearVisitedPages();
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong sending the form."
      );
    }
  }

  const isSubmitting = status === "submitting";

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Rahul Sharma"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="email">Work email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="rahul@company.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="company">Company name</label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="ABC Pvt Ltd"
            value={form.company}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="designation">Job title</label>
          <input
            id="designation"
            name="designation"
            type="text"
            autoComplete="organization-title"
            placeholder="Sales Manager"
            value={form.designation}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="phone">Phone number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="9876543210"
          value={form.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="message">Message / requirements</label>
        <textarea
          id="message"
          name="message"
          placeholder="We're looking for AI bots that can train our SDR team."
          value={form.message}
          onChange={handleChange}
          required
        />
      </div>

      <div className="submit-row">
        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Request demo"}
        </button>
      </div>

      {status === "success" && (
        <div className="form-status success" role="status">
          Thanks — your request has been sent. Our team will reach out shortly.
        </div>
      )}

      {status === "error" && (
        <div className="form-status error" role="alert">
          We couldn't send your request ({errorMessage}). Please try again.
        </div>
      )}
    </form>
  );
}
