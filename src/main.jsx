import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./index.css";

// ErrorBoundary wraps everything: if any part of the app throws during
// render (e.g. a browser API unsupported on a particular phone/browser),
// this shows a readable error screen instead of a blank page.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <TaskProvider>
          <App />
        </TaskProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
