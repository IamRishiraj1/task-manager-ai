import React, { useState } from "react";
import { useTasks } from "../context/TaskContext.jsx";
import { formatDueDate, isOverdue } from "../utils/date.js";
import { syncTaskToTodoist, removeTaskFromTodoist } from "../services/todoistService.js";

export default function TaskCard({ task, onEdit }) {
  const { toggleComplete, deleteTask, setTodoistId, showToast } = useTasks();
  const [syncing, setSyncing] = useState(false);

  const overdue = !task.completed && isOverdue(task.dueDate);

  const handleSync = async () => {
    setSyncing(true);
    try {
      if (task.todoistId) {
        await removeTaskFromTodoist(task.todoistId);
        setTodoistId(task.id, null);
        showToast("Removed from Todoist.");
      } else {
        const { todoistId } = await syncTaskToTodoist(task);
        setTodoistId(task.id, todoistId);
        showToast("Synced to Todoist — reminders will come from Todoist too.");
      }
    } catch (err) {
      showToast("Todoist sync failed. Check your API token in Netlify env vars.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className={`task-card${task.completed ? " is-complete" : ""}`}>
      <button
        className={`task-checkbox${task.completed ? " checked" : ""}`}
        onClick={() => toggleComplete(task.id)}
        aria-label={task.completed ? "Mark task as not complete" : "Mark task as complete"}
      >
        {task.completed ? "✓" : ""}
      </button>

      <div className="task-body">
        <div className="task-title-row">
          <h3 className={`task-title${task.completed ? " is-complete" : ""}`}>{task.title}</h3>
        </div>

        {task.description && <p className="task-desc">{task.description}</p>}

        <div className="task-meta">
          <span className={`badge badge-priority-${task.priority}`}>{task.priority} priority</span>
          {task.dueDate && (
            <span className={`badge badge-due${overdue ? " overdue" : ""}`}>Due {formatDueDate(task.dueDate)}</span>
          )}
          {task.todoistId && <span className="badge badge-synced">Synced to Todoist</span>}
        </div>

        {task.aiSuggestion && (
          <div className="margin-note">
            <span className="tag">AI</span>
            <span>{task.aiSuggestion}</span>
          </div>
        )}
      </div>

      <div className="task-actions">
        <button className="icon-btn" onClick={() => onEdit(task)} aria-label="Edit task">Edit</button>
        <button className="icon-btn" onClick={handleSync} disabled={syncing} aria-label="Sync task to Todoist">
          {syncing ? "…" : task.todoistId ? "Unsync" : "Sync"}
        </button>
        <button className="btn-danger" onClick={() => deleteTask(task.id)} aria-label="Delete task">Delete</button>
      </div>
    </div>
  );
}
