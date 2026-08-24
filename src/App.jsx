import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import AllTasks from "./pages/AllTasks.jsx";
import UpcomingTasks from "./pages/UpcomingTasks.jsx";
import CompletedTasks from "./pages/CompletedTasks.jsx";
import { useTasks } from "./context/TaskContext.jsx";

export default function App() {
  const { toast } = useTasks();

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<AllTasks />} />
          <Route path="/upcoming" element={<UpcomingTasks />} />
          <Route path="/completed" element={<CompletedTasks />} />
        </Routes>
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
