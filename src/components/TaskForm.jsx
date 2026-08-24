import React, { useState } from "react";
import { useTasks } from "../context/TaskContext.jsx";
import { suggestPriority } from "../services/aiService.js";

const emptyForm = { title: "", description: "", dueDate: "", priority: "medium" };

export default function TaskForm({ task, onClose }) {
  const { addTask, updateTask, showToast } = useTasks();
  const [form, setForm] = useState(task ? { ...emptyForm, ...task } : emptyForm);
  const [suggesting, setSuggesting] = useState(false);

  const isEditing = Boolean(task);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (isEditing) {
      updateTask(task.id, form);
      showToast("Task updated.");
    } else {
      addTask(form);
      showToast("Task added.");
    }
    onClose();
  };

  const handleSuggestPriority = async () => {
    if (!form.title.trim()) {
      showToast("Add a title first so the AI has something to reason about.");
      return;
    }
    setSuggesting(true);
    try {
      const { priority, reason } = await suggestPriority(form);
      setForm((prev) => ({ ...prev, priority }));
      showToast(`AI suggests "${priority}" priority — ${reason}`);
    } catch (err) {
      showToast("Couldn't reach the AI suggestion service. Is GROQ_API_KEY set in Netlify?");
    } finally {
      setSuggesting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? "Edit task" : "New task"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              placeholder="e.g. Finish onboarding email draft"
              required
              autoFocus
            />
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea id="description" value={form.description} onChange={handleChange("description")} placeholder="Optional details" />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="dueDate">Due date</label>
              <input id="dueDate" type="date" value={form.dueDate} onChange={handleChange("dueDate")} />
            </div>
            <div className="field">
              <label htmlFor="priority">Priority</label>
              <select id="priority" value={form.priority} onChange={handleChange("priority")}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <button type="button" className="btn btn-amber" onClick={handleSuggestPriority} disabled={suggesting}>
            {suggesting ? "Thinking…" : "✨ Suggest priority with AI"}
          </button>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{isEditing ? "Save changes" : "Add task"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
