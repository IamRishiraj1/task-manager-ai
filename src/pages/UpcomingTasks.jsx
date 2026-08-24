import React, { useState } from "react";
import { useTasks } from "../context/TaskContext.jsx";
import { isDueSoon } from "../utils/date.js";
import TaskCard from "../components/TaskCard.jsx";
import TaskForm from "../components/TaskForm.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function UpcomingTasks() {
  const { tasks } = useTasks();
  const [editingTask, setEditingTask] = useState(null);

  const upcoming = tasks
    .filter((t) => !t.completed && isDueSoon(t.dueDate, 7))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Upcoming</h1>
          <p>Due within the next 7 days, soonest first.</p>
        </div>
      </div>

      {upcoming.length === 0 ? (
        <EmptyState title="Nothing due soon" message="Tasks with a due date in the next 7 days will show up here." />
      ) : (
        <div className="task-list">
          {upcoming.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={setEditingTask} />
          ))}
        </div>
      )}

      {editingTask && <TaskForm task={editingTask} onClose={() => setEditingTask(null)} />}
    </>
  );
}
