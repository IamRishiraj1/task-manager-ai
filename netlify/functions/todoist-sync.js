// netlify/functions/todoist-sync.js
//
// Serverless proxy to the Todoist REST API (v2). TODOIST_API_TOKEN stays
// on the server and is never exposed to the browser.

const TODOIST_API = "https://api.todoist.com/rest/v2/tasks";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return respond(405, { error: "Method not allowed" });
  }

  const token = process.env.TODOIST_API_TOKEN;
  if (!token) {
    return respond(500, { error: "TODOIST_API_TOKEN is not configured on the server." });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return respond(400, { error: "Invalid JSON body." });
  }

  try {
    if (body.action === "upsert") {
      const todoistId = await upsertTask(body.task, token);
      return respond(200, { todoistId });
    }
    if (body.action === "delete") {
      await deleteTask(body.todoistId, token);
      return respond(200, { deleted: true });
    }
    return respond(400, { error: "`action` must be 'upsert' or 'delete'." });
  } catch (err) {
    console.error("todoist-sync error:", err);
    return respond(502, { error: "Failed to sync with Todoist." });
  }
}

async function upsertTask(task, token) {
  const response = await fetch(TODOIST_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      content: task.title,
      description: task.description || "",
      due_date: task.dueDate || undefined
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Todoist API error (${response.status}): ${errText}`);
  }

  const created = await response.json();
  return created.id;
}

async function deleteTask(todoistId, token) {
  if (!todoistId) return;
  const response = await fetch(`${TODOIST_API}/${todoistId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok && response.status !== 404) {
    const errText = await response.text();
    throw new Error(`Todoist API error (${response.status}): ${errText}`);
  }
}

function respond(statusCode, bodyObj) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(bodyObj) };
}
