# Mockcall AI — Lead-Profiling Workflow (n8n)

End-to-end implementation of **Part 2 — Build a Lead-Profiling Workflow**:

- A small React + Vite marketing site that captures a visitor's details
  along with the pages they browsed.
- An n8n workflow that receives the submission via webhook, runs the
  payload through an LLM to categorize the lead, appends the profiled
  lead to Google Sheets, and emails the sales team.

The webhook URL, Google Sheet, and Gmail account are all wired up in the
exported workflow (`N8N_workflow/My workflow 2.json`); the screenshot of
the canvas is in `N8N_workflow/Workflow_picture.png`.

---

## What the system does

```
Visitor browses the site
        │
        │  (PageTracker appends each route to localStorage.visited_pages)
        ▼
Visitor fills the contact form on /contact
        │
        │  ContactForm POSTs JSON { name, email, company,
        │  designation, phone, message, visited_pages }
        ▼
n8n Webhook  →  Edit Fields  →  AI Agent (Gemini)  →  Code (parse + tidy)
        │                                       │
        ├───────────────────────────────────────┤
        ▼                                       ▼
Append row in sheet (Google Sheets)        Send a message (Gmail → sales)
```

The visitor sees a success message and `visited_pages` is cleared so the
next visitor starts with a fresh history.

---

## Front-end (React + Vite)

### Page tracking — `src/components/PageTracker.jsx`

Mounted once in `App.jsx`, above the routes. On every route change it
reads the current pathname from `useLocation()` and appends it to a
`visited_pages` array in `localStorage`, skipping the append if that
path is already present (no duplicates, order preserved). It renders
nothing — it exists purely to record the visit history.

```js
localStorage.getItem("visited_pages");
// e.g. '["/","/sales-roleplay","/pricing","/case-studies"]'
```

### Lead submission — `src/components/ContactForm.jsx`

On submit, the form:

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
4. On a `2xx` response: shows a success message, clears the form, and
   removes `visited_pages` from `localStorage` so the next visitor
   starts with a fresh history.
5. On failure: shows an inline error and leaves the form data in place
   so the user can retry.

The webhook URL is the only thing that needs to be pointed at a real
n8n instance — everything else is already configured in the exported
workflow.

### Project structure

```
src/
  components/
    Navbar.jsx          navigation bar
    Footer.jsx           page footer
    PageTracker.jsx      tracks route changes into localStorage
    ContactForm.jsx      lead form + webhook submission
  pages/
    Home.jsx
    SalesRoleplay.jsx
    Pricing.jsx
    CaseStudies.jsx
    Contact.jsx
  App.jsx                routes + layout
  main.jsx               BrowserRouter + app mount
  index.css              design tokens & global styles
N8N_workflow/
  My workflow 2.json     exported n8n workflow
  Workflow_picture.png   screenshot of the n8n canvas
```

### Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
```

---

## n8n workflow

Exported as `N8N_workflow/My workflow 2.json`. Six nodes total, one
entry point, two parallel outputs at the end:

```
Webhook ──▶ Edit Fields ──▶ AI Agent ──▶ Code in JavaScript ──▶ Append row in sheet
                                          (Google Gemini)                │
                                          (via Google Gemini Chat Model)  └─▶ Send a message
                                                                                (Gmail)
```

### 1. Webhook (entry point)

- Type: `n8n-nodes-base.webhook` v2.1
- Method: `POST`
- Path: `15948e3d-867a-423a-8c81-cae7aa2fed83` → the live URL the front-end
  POSTs to is `…/webhook/15948e3d-…`.
- Receives the JSON body from `ContactForm.jsx` as-is. No body
  reshaping at this stage — that comes next.

### 2. Edit Fields (normalize the payload)

- Type: `n8n-nodes-base.set` v3.4
- Single assignment: `body = {{ $json.body }}`.
- Why: gives the rest of the workflow a stable `body` key to reference
  (`$('Edit Fields').item.json.body.*`) regardless of what the webhook
  hands in. The Code and Sheets nodes both pull from this fixed path
  so they don't have to care about webhook internals.

### 3. AI Agent (the categorization step)

- Type: `@n8n/n8n-nodes-langchain.agent` v3.1
- Model sub-node: `Google Gemini Chat Model`
  (`@n8n/n8n-nodes-langchain.lmChatGoogleGemini` v1.1, AI Gateway
  managed credentials).
- Prompt type: `define` (full prompt below).

The prompt is structured to do three things at once: (a) classify, (b)
explain the classification, and (c) pre-render the email that will be
sent — so the downstream Gmail node doesn't have to reformat anything
and there's a single source of truth for the lead summary.

Key design choices in the prompt:

- **One output, strict JSON.** The agent is told to return *only* a
  valid JSON object with no markdown, code fences, or extra text. This
  keeps the Code node's `JSON.parse` reliable.
- **Two explicit categories.** `Organizational Development` and
  `Sales Bots`, each with concrete signals (page topics + message
  intent) so the model isn't guessing. This is the only place
  category definitions live — change them here, not in the Sheets or
  Gmail nodes.
- **Reason + priority included.** Both are written into the JSON
  payload so the sales team sees *why* a lead was bucketed and how
  urgent it is without needing to inspect raw inputs.
- **`sales_email_subject` + `sales_email_body` pre-built in the
  prompt.** The Gmail node is then just `subject = $json.sales_email_subject`,
  `message = $json.sales_email_body`. This avoids string-building
  expressions in n8n and keeps the email wording consistent across
  every lead.
- **All visitor inputs inlined via expressions.** Name, email, company,
  designation, message, and `visited_pages` are inserted with
  `{{ $json.body.* }}` so the model sees one consolidated block, not a
  tool-call surface to rediscover the data.

The LLM call receives:

```
Name: {{ $json.body.name }}
Email: {{ $json.body.email }}
Company: {{ $json.body.company }}
Designation: {{ $json.body.designation }}

Visitor Message: {{ $json.body.message }}

Visited Pages:
{{ $json.body.visited_pages }}
```

…and returns the JSON envelope (category, reason, priority, and the
pre-rendered email subject/body).

### 4. Code in JavaScript (parse + tidy)

- Type: `n8n-nodes-base.code` v2.

The agent wraps its JSON in an `output`/`text`/`content` field, so the
first thing this node does is read whichever of those keys the run
produced, then `JSON.parse` it. After that it does one presentation
tweak: it reformats `visited_pages` from a JSON array of slugs into a
newline-separated list of human labels (`/` → `Home`, `/sales-roleplay`
→ `Sales Roleplay`, etc.) so the value looks clean in the Google Sheet
and the email body. The resulting object is returned as a single item
that fans out to the two terminal nodes.

### 5. Append row in sheet (Google Sheets)

- Type: `n8n-nodes-base.googleSheets` v4.7
- Operation: `append`
- Document: `Customer Data` (the cached display name of the spreadsheet
  `1Wv5b8Iebhg2zxfaIym7juT5gJcy1JtAldPEWJsqiKjY`).
- Sheet: `Sheet1` (`gid=0`).
- Columns written, in order:
  - `Name`, `Email`, `Company` — pulled from `$('Edit Fields').item.json.body.*`
    (the original payload, not the LLM output — the model is asked to
    echo these, but the source of truth is the webhook body).
  - `Message` — same, from the original payload.
  - `Visited Pages` — `$json.visited_pages` from the Code node, after
    the human-label reformat.
  - `Category`, `Reason`, `Priority` — `$json.category`, `$json.reason`,
    `$json.priority` from the Code node (i.e. straight from the LLM
    output).
- Credentials: `Google Sheets account` (OAuth2).

Why source identity fields from `Edit Fields` and categorization fields
from the Code node: identity is a webhook concern, categorization is an
LLM concern. Keeping those reads split makes it obvious where to fix a
bug if one side ever goes wrong.

### 6. Send a message (Gmail)

- Type: `n8n-nodes-base.gmail` v2.2
- To: `prasenjitsasmal1619@gmail.com` (the sales inbox).
- Subject: `{{ $json.sales_email_subject }}` — pre-rendered by the LLM.
- Body: `{{ $json.sales_email_body }}` — pre-rendered by the LLM.
- Credentials: `Gmail account` (OAuth2).

Because the prompt assembles the subject and body, this node has no
string-building logic of its own — it's a thin delivery step. Both the
Gmail node and the Sheets node are downstream of the same Code node,
so they run in parallel and each lead results in exactly one sheet
row and exactly one email.

### Credentials used in the workflow

| Node | Credential |
|---|---|
| Google Gemini Chat Model | `googlePalmApi` (AI Gateway managed) |
| Append row in sheet | `Google Sheets account` (OAuth2) |
| Send a message | `Gmail account` (OAuth2) |

The webhook itself takes no credential.

---

## End-to-end example

**Visitor session** — browses `/`, `/sales-roleplay`, `/pricing`,
`/case-studies`, then submits the contact form on `/contact` saying
*"We're looking for AI bots that can train our SDR team."*

**Payload posted to the webhook:**

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

**After the AI Agent + Code node, the working item looks like:**

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "company": "ABC Pvt Ltd",
  "designation": "Sales Manager",
  "message": "We're looking for AI bots that can train our SDR team.",
  "visited_pages": "Home\nSales Roleplay\nPricing\nCase Studies",
  "category": "Sales Bots",
  "reason": "The visitor explored Sales Bot pages and requested AI SDR training.",
  "priority": "High",
  "sales_email_subject": "New High Priority Lead - Sales Bots",
  "sales_email_body": "A new lead has been profiled.\n\nName: Rahul Sharma\n…"
}
```

That same object is then split: identity + categorization fields go to
the Google Sheet row, and the two `sales_email_*` fields go to the
Gmail node.

---

## Files of interest

- `N8N_workflow/My workflow 2.json` — the exported n8n workflow.
  Import this into n8n to reproduce the pipeline.
- `N8N_workflow/Workflow_picture.png` — screenshot of the canvas,
  included so the structure is visible without opening n8n.
- `src/components/ContactForm.jsx` — front-end form that posts to the
  webhook. Set `N8N_WEBHOOK_URL` to your own n8n instance URL.
- `src/components/PageTracker.jsx` — the page-visit history collector.
