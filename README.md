# Task Manager AI (Do-ers)

> A full-stack task management application with AI-powered task prioritization, intelligent deadline reminders, and Todoist deadline syncing. Built to demonstrate modern web development practices, serverless architecture, and AI API integration.

**Live:** https://do-ers.netlify.app  
**GitHub:** https://github.com/IamRishiraj1/task-manager-ai

---

## Features

### 📋 Core Task Management
- **Full CRUD operations** — Create, read, update, delete tasks with title, description, due date, and priority
- **Task persistence** — All tasks saved to browser `localStorage` (production-ready for database swap)
- **Multiple views** — All Tasks / Upcoming (7-day window) / Completed, each with live counters
- **Responsive design** — Mobile-first layout; desktop sidebar collapses to horizontal nav on phones

### 🤖 AI-Powered Prioritization
- **Groq LLM integration** — Free-tier API (no credit card required) for cost-effective AI
- **Batch task ranking** — Ask the AI to rank all active tasks by urgency/impact with reasoning
- **Per-task priority suggestions** — While creating/editing, get AI-recommended priority levels
- **Inline reasoning** — Each task shows the AI's brief rationale as a "margin note" card

### ⏰ Deadline Reminders
- **Browser notifications** — Native browser Notifications API checks every 60 seconds for due/overdue tasks
- **Todoist sync** — Push task deadlines to Todoist so mobile/email reminders cover you when the tab is closed
- **Graceful degradation** — Notifications degrade silently on unsupported browsers (older mobile)

### 🎯 Error Handling & UX
- **Error boundary** — App crash on startup? See a readable error message instead of a blank page
- **Safe UUID fallback** — Works on older mobile browsers that don't support `crypto.randomUUID()`
- **Storage guards** — Handles privacy-mode browsers that block `localStorage`
- **Toast notifications** — Actionable feedback for all CRUD and sync operations

---

## Tech Stack

**Frontend:**
- React 18 (modern hooks, Context API for state)
- React Router 6 (three-view navigation)
- Axios (HTTP client)
- Vite (fast dev server & build)
- Custom design system (no frameworks; "field notebook" visual identity)

**Backend:**
- Netlify Functions (serverless Node.js)
- Groq Chat Completions API (free-tier LLM)
- Todoist REST API v2 (deadline syncing)

**Deployment:**
- Netlify (auto-deploy from GitHub, environment variables, function logging)
- GitHub (version control, deploy trigger)

---

## Getting Started

### Prerequisites
- Node.js 18+
- Netlify CLI (for local function testing)
- Groq API key (free, console.groq.com)
- Todoist API token (free, Settings > Integrations > Developer in Todoist app)

### Local Development

```bash
# Clone and install
git clone https://github.com/IamRishiraj1/task-manager-ai.git
cd task-manager-ai
npm install

# Set up environment
cp .env.example .env
# Fill in GROQ_API_KEY and TODOIST_API_TOKEN

# Run locally (includes function proxy)
netlify dev
# Open http://localhost:8888
```

### Deploy to Netlify

1. Push to GitHub (`git push origin main`)
2. Netlify: **Add new site** > **Import an existing project** > pick this repo
3. Build settings auto-detected from `netlify.toml` (command: `npm run build`, publish: `dist`)
4. **Environment variables**: add `GROQ_API_KEY` and `TODOIST_API_TOKEN`
5. Netlify auto-deploys on every push

---

## Architecture

```
Browser (React + Router)
    ↓
    ├─→ Netlify Functions (serverless)
    │   ├─→ ai-suggestions: talks to Groq LLM
    │   └─→ todoist-sync: talks to Todoist API
    │
    └─→ Browser APIs
        ├─→ localStorage (task persistence)
        ├─→ sessionStorage (reminder state)
        └─→ Notifications (deadline alerts)
```

**Key design:** API keys stay server-side only (Netlify Functions). React app never sees them, keeping secrets out of client bundles.

---

## Project Structure

```
src/
  components/        # UI: TaskCard, TaskForm, AISuggestionPanel, ErrorBoundary
  pages/            # Views: AllTasks, UpcomingTasks, CompletedTasks
  context/          # TaskContext (state + CRUD + reminders)
  services/         # API clients (Groq, Todoist)
  utils/            # Helpers (date math, notifications, safe UUID)
  App.jsx           # Router setup
  main.jsx          # Entry with ErrorBoundary
  index.css         # Design tokens + layout (custom, no frameworks)

netlify/functions/
  ai-suggestions.js # Groq-backed prioritization
  todoist-sync.js   # Todoist create/delete proxy

netlify.toml        # Build & function config
vite.config.js      # Frontend build config
```

---

## Code Highlights

### Safe Error Handling
```javascript
// ErrorBoundary catches render-time crashes and shows a readable message
class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) return <div>Error: {error.message}</div>;
    return this.props.children;
  }
}
```

### AI Integration (Server-Side Key Storage)
```javascript
// React app calls /ai-suggestions, which holds the GROQ_API_KEY server-side
const { data } = await api.post("/ai-suggestions", { tasks });
// Browser never sees the key
```

### Defensive Storage
```javascript
// Guards against privacy-mode browsers that block localStorage
try {
  localStorage.setItem("key", value);
} catch (err) {
  console.warn("Storage unavailable, using in-memory fallback");
}
```

---

## Performance & Best Practices

- **Fast local dev:** Vite with React plugin (~2s rebuild)
- **Clean production build:** ~77KB gzipped (React + Router + Axios)
- **Mobile-first CSS:** Responsive layouts, no heavy frameworks
- **SEO-friendly:** Proper meta tags, semantic HTML
- **Accessibility:** ARIA labels, focus management, keyboard navigation
- **Type safety ready:** Structure allows easy TypeScript migration

---

## What This Demonstrates

This project showcases full-stack development competency:

✅ **Frontend Skills:** React hooks, Context API, React Router, custom CSS design system, responsive layout, error boundaries  
✅ **Backend Skills:** Serverless functions, secure API key handling, error handling at scale  
✅ **API Integration:** Working with external APIs (Groq, Todoist), handling auth, building a proxy layer  
✅ **Deployment:** CI/CD pipeline, environment variables, production monitoring, function logging  
✅ **Best Practices:** Clean code structure, no external UI frameworks (custom design), accessibility, mobile-first design  
✅ **Problem Solving:** Handling browser storage restrictions, providing graceful degradation, debugging production errors  

---

## Future Enhancements

- [ ] Google Calendar sync (alternative to Todoist)
- [ ] Dark mode toggle
- [ ] Recurring tasks
- [ ] Task categories/tags
- [ ] Database backend (PostgreSQL + Supabase) instead of localStorage
- [ ] User authentication (Netlify Identity or Auth0)
- [ ] Collaborative tasks (share with team)

---

## License

MIT — feel free to fork and use this as a portfolio piece or learning resource.

---

## Author

**Rishiraj** — Full-Stack Developer & AI Automation Developer  
Portfolio: [LinkedIn](https://linkedin.com/in/iamrishiraj1) | [GitHub](https://github.com/IamRishiraj1)

Have questions or spotted a bug? Open an issue or reach out directly. Contributions welcome!
