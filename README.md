# Task Manager AI

A full-stack task manager with AI-powered prioritization, deadline
reminders, and Todoist syncing — built with React, React Router, and
Netlify Functions, ready to deploy on Netlify.

## Features

- **CRUD tasks** — create, edit, complete, and delete tasks, persisted in `localStorage`.
- **Smart suggestions** — an "AI prioritization" panel ranks active tasks via Groq, shown as margin notes on each card.
- **Deadline reminders** — a browser-notification scheduler checks for due/overdue tasks every minute; tasks can also sync to Todoist.
- **Multiple views** — All Tasks / Upcoming (next 7 days) / Completed, via React Router.
- **Error boundary** — a startup crash on any device shows a readable error screen instead of a blank page.

## Local development

```bash
npm install
cp .env.example .env      # fill in GROQ_API_KEY and TODOIST_API_TOKEN
netlify dev
```

## Deploying to Netlify

1. Push to GitHub.
2. Netlify: Add new site > Import an existing project > pick the repo (build settings auto-detected from `netlify.toml`).
3. Site settings > Environment variables: add `GROQ_API_KEY` and `TODOIST_API_TOKEN`.
4. Trigger a deploy.

## Tech stack

React 18, React Router 6, Axios, Vite, Netlify Functions (Node 18), Groq Chat Completions API, Todoist REST API v2.
