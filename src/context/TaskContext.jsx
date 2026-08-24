import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { requestNotificationPermission, notify } from "../utils/notifications.js";
import { isOverdue } from "../utils/date.js";
import { generateId } from "../utils/id.js";

const TaskContext = createContext(null);
const STORAGE_KEY = "task-manager-ai:tasks";
const REMINDED_KEY = "task-manager-ai:reminded";

function addDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function seedTasks() {
  return [
    {
      id: generateId(),
      title: "Draft Q3 project proposal",
      description: "Outline scope, timeline, and budget for stakeholder review.",
      dueDate: addDays(2),
      priority: "high",
      completed: false,
      todoistId: null,
      aiSuggestion: null,
      createdAt: new Date().toISOString()
    },
    {
      id: generateId(),
      title: "Reply to design feedback",
      description: "Address comments on the onboarding flow mockups.",
      dueDate: addDays(5),
      priority: "medium",
      completed: false,
      todoistId: null,
      aiSuggestion: null,
      createdAt: new Date().toISOString()
    },
    {
      id: generateId(),
      title: "Renew domain registration",
      description: "",
      dueDate: addDays(-1),
      priority: "low",
      completed: false,
      todoistId: null,
      aiSuggestion: null,
      createdAt: new Date().toISOString()
    }
  ];
}

function loadTasks() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return seedTasks();
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seedTasks();
  } catch (err) {
    console.warn("Failed to load tasks from localStorage, using seed data:", err);
    return seedTasks();
  }
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(loadTasks);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.warn("Failed to persist tasks:", err);
    }
  }, [tasks]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const checkReminders = () => {
      let remindedToday = [];
      try {
        remindedToday = JSON.parse(sessionStorage.getItem(REMINDED_KEY) || "[]");
      } catch {
        remindedToday = [];
      }
      const dueSoonIds = [];

      tasks.forEach((task) => {
        if (task.completed || !task.dueDate) return;
        const dueTodayOrOverdue = isOverdue(task.dueDate) || task.dueDate === new Date().toISOString().slice(0, 10);
        if (dueTodayOrOverdue && !remindedToday.includes(task.id)) {
          notify("Task deadline reminder", { body: `"${task.title}" is due ${task.dueDate}.`, tag: task.id });
          dueSoonIds.push(task.id);
        }
      });

      if (dueSoonIds.length) {
        try {
          sessionStorage.setItem(REMINDED_KEY, JSON.stringify([...remindedToday, ...dueSoonIds]));
        } catch (err) {
          console.warn("Failed to persist reminder state:", err);
        }
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const addTask = useCallback((taskData) => {
    const newTask = {
      id: generateId(),
      title: taskData.title,
      description: taskData.description || "",
      dueDate: taskData.dueDate || "",
      priority: taskData.priority || "medium",
      completed: false,
      todoistId: null,
      aiSuggestion: null,
      createdAt: new Date().toISOString()
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleComplete = useCallback((id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const applyAISuggestions = useCallback((ranked) => {
    setTasks((prev) =>
      prev.map((t) => {
        const match = ranked.find((r) => r.id === t.id);
        return match ? { ...t, aiSuggestion: match.reason } : t;
      })
    );
  }, []);

  const setTodoistId = useCallback((id, todoistId) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, todoistId } : t)));
  }, []);

  const value = useMemo(
    () => ({ tasks, addTask, updateTask, deleteTask, toggleComplete, applyAISuggestions, setTodoistId, toast, showToast }),
    [tasks, addTask, updateTask, deleteTask, toggleComplete, applyAISuggestions, setTodoistId, toast, showToast]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within a TaskProvider");
  return ctx;
}
