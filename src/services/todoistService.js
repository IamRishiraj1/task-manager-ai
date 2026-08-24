import api from "./api.js";

export async function syncTaskToTodoist(task) {
  const { data } = await api.post("/todoist-sync", {
    action: "upsert",
    task: { id: task.id, title: task.title, description: task.description, dueDate: task.dueDate }
  });
  return data;
}

export async function removeTaskFromTodoist(todoistId) {
  const { data } = await api.post("/todoist-sync", { action: "delete", todoistId });
  return data;
}
