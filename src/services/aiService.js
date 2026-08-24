import api from "./api.js";

export async function getAISuggestions(tasks) {
  const payload = {
    tasks: tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      dueDate: t.dueDate,
      priority: t.priority
    }))
  };
  const { data } = await api.post("/ai-suggestions", payload);
  return data;
}

export async function suggestPriority(task) {
  const { data } = await api.post("/ai-suggestions", { singleTask: task });
  return data;
}
