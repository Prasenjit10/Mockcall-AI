# Cadence AI — Lead Profiling Demo

A small React + Vite marketing site used to demonstrate an n8n "Lead
Profiling" workflow. It has no backend: page-visit history is tracked in
the browser and sent, along with the contact form, straight to an n8n
webhook.

## Pages

- `/` — Home
- `/sales-roleplay` — Sales Roleplay
- `/pricing` — Pricing
- `/case-studies` — Case Studies
- `/contact` — Contact / Request Demo

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## Configure the webhook

Open `src/components/ContactForm.jsx` and set your real n8n webhook URL:

```js
const N8N_WEBHOOK_URL = "https://YOUR-N8N-DOMAIN/webhook/new-lead";
```

## How page tracking works

`src/components/PageTracker.jsx` is mounted once in `App.jsx`, above the
routes. On every route change it reads the current pathname from
`useLocation()` and appends it to a `visited_pages` array in
`localStorage`, skipping the append if that path is already present (no
duplicates, order preserved). Nothing is rendered on screen — it's a
tracking-only component.

```js
localStorage.getItem("visited_pages");
// e.g. '["/","/sales-roleplay","/pricing","/case-studies"]'
```

## How the lead is submitted

On submit, `src/components/ContactForm.jsx`:

1. Reads `visited_pages` from `localStorage`.
2. Builds a payload:

   ```json
   {
     "name": "Rahul Sharma",
     "email": "rahul@gmail.com",
     "company": "ABC Pvt Ltd",
     "designation": "Sales Manager",
     "phone": "9876543210",
     "message": "We're looking for AI bots that can train our SDR team.",
     "visited_pages": ["/", "/sales-roleplay", "/pricing", "/case-studies"]
   }
   ```

3. POSTs it as JSON to `N8N_WEBHOOK_URL`.
4. On a successful (`2xx`) response: shows a success message, clears the
   form, and removes `visited_pages` from `localStorage` so the next
   visitor starts with a fresh history.
5. On failure: shows an inline error and leaves the form data in place so
   the user can retry.

## Project structure

```
src/
  components/
    Navbar.jsx          navigation bar
    Footer.jsx           page footer
    PageTracker.jsx       tracks route changes into localStorage
    ContactForm.jsx       lead form + webhook submission
  pages/
    Home.jsx
    SalesRoleplay.jsx
    Pricing.jsx
    CaseStudies.jsx
    Contact.jsx
  App.jsx                 routes + layout
  main.jsx                 BrowserRouter + app mount
  index.css                design tokens & global styles
```

## Build for production

```bash
npm run build
npm run preview
```
