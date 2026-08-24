import React from "react";
import { NavLink } from "react-router-dom";
import { useTasks } from "../context/TaskContext.jsx";
import { isDueSoon } from "../utils/date.js";

export default function Sidebar() {
  const { tasks } = useTasks();

  const counts = {
    all: tasks.filter((t) => !t.completed).length,
    upcoming: tasks.filter((t) => !t.completed && isDueSoon(t.dueDate, 7)).length,
    completed: tasks.filter((t) => t.completed).length
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        Task<span>Notebook</span>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
          <span>All Tasks</span>
          <span className="count">{counts.all}</span>
        </NavLink>
        <NavLink to="/upcoming" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
          <span>Upcoming</span>
          <span className="count">{counts.upcoming}</span>
        </NavLink>
        <NavLink to="/completed" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
          <span>Completed</span>
          <span className="count">{counts.completed}</span>
        </NavLink>
      </nav>
      <div className="sidebar-footer">AI suggestions powered by Groq. Deadlines sync to Todoist and remind you locally.</div>
    </aside>
  );
}
