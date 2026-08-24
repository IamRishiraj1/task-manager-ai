// netlify/functions/ai-suggestions.js
//
// Serverless endpoint that talks to the Groq API on behalf of the client.
// Groq offers a free-tier API key (no credit card required) and exposes
// the same "chat completions" request/response shape that OpenAI uses.
// GROQ_API_KEY is read from Netlify's server-side environment variables
// and is NEVER sent to or exposed in the browser.

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return respond(405, { error: "Method not allowed" });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return respond(500, { error: "GROQ_API_KEY is not configured on the server." });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return respond(400, { error: "Invalid JSON body." });
  }

  try {
    if (body.singleTask) {
      const result = await suggestSinglePriority(body.singleTask, apiKey);
      return respond(200, result);
    }
    if (Array.isArray(body.tasks)) {
      const result = await rankTasks(body.tasks, apiKey);
      return respond(200, result);
    }
    return respond(400, { error: "Request must include `tasks` (array) or `singleTask` (object)." });
  } catch (err) {
    console.error("ai-suggestions error:", err);
    return respond(502, { error: "Failed to get a response from the AI provider." });
  }
}

async function rankTasks(tasks, apiKey) {
  const systemPrompt =
    "You are a productivity assistant embedded in a task manager app. " +
    "Given a JSON list of tasks (id, title, description, dueDate, priority), " +
    "return ONLY valid JSON, no markdown fences, of the shape: " +
    '{"summary": string, "ranked": [{"id": string, "reason": string}]}. ' +
    "Order `ranked` from most to least urgent/important, considering due dates, " +
    "stated priority, and how the description implies impact or dependencies. " +
    "Keep each `reason` under 12 words. Keep `summary` under 25 words.";

  const userPrompt = JSON.stringify({ tasks });
  const data = await callGroq(systemPrompt, userPrompt, apiKey);
  return safeParseModelJSON(data, { summary: "", ranked: [] });
}

async function suggestSinglePriority(task, apiKey) {
  const systemPrompt =
    "You are a productivity assistant. Given a single task's title, description, " +
    "and due date, respond with ONLY valid JSON, no markdown fences, of the shape: " +
    '{"priority": "low"|"medium"|"high", "reason": string}. ' +
    "Keep `reason` under 15 words.";

  const userPrompt = JSON.stringify({ task });
  const data = await callGroq(systemPrompt, userPrompt, apiKey);
  return safeParseModelJSON(data, { priority: "medium", reason: "Defaulted — AI response could not be parsed." });
}

async function callGroq(systemPrompt, userPrompt, apiKey) {
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errText}`);
  }

  const json = await response.json();
  return json.choices?.[0]?.message?.content || "{}";
}

function safeParseModelJSON(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function respond(statusCode, bodyObj) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(bodyObj) };
}
