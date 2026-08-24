import React, { useState } from "react";
import { useTasks } from "../context/TaskContext.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskForm from "../components/TaskForm.jsx";
import AISuggestionPanel from "../components/AISuggestionPanel.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function AllTasks() {
  const { tasks } = useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const activeTasks = tasks.filter((t) => !t.completed);

  const openCreate = () => { setEditingTask(null); setFormOpen(true); };
  const openEdit = (task) => { setEditingTask(task); setFormOpen(true); };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>All tasks</h1>
          <p>Everything on your plate, in one page.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ New task</button>
      </div>

      <AISuggestionPanel />

      {activeTasks.length === 0 ? (
        <EmptyState title="Nothing here yet" message="Add your first task to get started." />
      ) : (
        <div className="task-list">
          {activeTasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={openEdit} />
          ))}
        </div>
      )}

      {formOpen && <TaskForm task={editingTask} onClose={() => setFormOpen(false)} />}
    </>
  );
}
