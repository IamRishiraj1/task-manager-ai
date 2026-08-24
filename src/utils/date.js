export function isOverdue(dueDate) {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dueDate) < today;
}

export function isDueSoon(dueDate, days = 7) {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  const diffMs = due - today;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= -0.0001 && diffDays <= days;
}

export function formatDueDate(dueDate) {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays < 0) return `${due.toLocaleDateString(undefined, { month: "short", day: "numeric" })} (overdue)`;
  return due.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
