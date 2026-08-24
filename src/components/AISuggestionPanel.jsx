import React, { useState } from "react";
import { useTasks } from "../context/TaskContext.jsx";
import { getAISuggestions } from "../services/aiService.js";

export default function AISuggestionPanel() {
  const { tasks, applyAISuggestions, showToast } = useTasks();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [ranked, setRanked] = useState([]);

  const activeTasks = tasks.filter((t) => !t.completed);

  const handleRequestSuggestions = async () => {
    if (activeTasks.length === 0) {
      showToast("Add some tasks first — nothing to prioritize yet.");
      return;
    }
    setLoading(true);
    try {
      const result = await getAISuggestions(activeTasks);
      setSummary(result.summary);
      setRanked(result.ranked || []);
      applyAISuggestions(result.ranked || []);
    } catch (err) {
      showToast("AI suggestion request failed. Check GROQ_API_KEY in your Netlify environment variables.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="suggestion-panel">
      <div className="suggestion-panel-header">
        <div>
          <h2>✨ AI prioritization</h2>
          <p className="lead">
            Let the model rank your {activeTasks.length} active task{activeTasks.length === 1 ? "" : "s"} by urgency and impact.
          </p>
        </div>
        <button className="btn btn-amber" onClick={handleRequestSuggestions} disabled={loading}>
          {loading ? "Thinking…" : "Get suggestions"}
        </button>
      </div>

      {summary && <p className="lead" style={{ marginTop: 12 }}>{summary}</p>}

      {ranked.length > 0 && (
        <div className="suggestion-list">
          {ranked.slice(0, 5).map((r, i) => {
            const t = tasks.find((task) => task.id === r.id);
            if (!t) return null;
            return (
              <div className="suggestion-row" key={r.id}>
                <span className="rank">#{i + 1}</span>
                <span><strong>{t.title}</strong> — {r.reason}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
