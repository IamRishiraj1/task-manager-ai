import React, { useState } from "react";
import { useTasks } from "../context/TaskContext.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskForm from "../components/TaskForm.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function CompletedTasks() {
  const { tasks } = useTasks();
  const [editingTask, setEditingTask] = useState(null);

  const completed = tasks.filter((t) => t.completed);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Completed</h1>
          <p>{completed.length} task{completed.length === 1 ? "" : "s"} checked off.</p>
        </div>
      </div>

      {completed.length === 0 ? (
        <EmptyState title="Nothing completed yet" message="Finished tasks will collect here." />
      ) : (
        <div className="task-list">
          {completed.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={setEditingTask} />
          ))}
        </div>
      )}

      {editingTask && <TaskForm task={editingTask} onClose={() => setEditingTask(null)} />}
    </>
  );
}
