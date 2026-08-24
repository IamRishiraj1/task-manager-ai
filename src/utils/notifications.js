// Deadline reminders using the browser's native Notification API, guarded
// so unsupported browsers (many mobile browsers restrict or omit this API)
// degrade quietly instead of throwing.
export async function requestNotificationPermission() {
  try {
    if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
    if (Notification.permission === "granted" || Notification.permission === "denied") {
      return Notification.permission;
    }
    return await Notification.requestPermission();
  } catch (err) {
    console.warn("Notification permission request failed:", err);
    return "unsupported";
  }
}

export function notify(title, options = {}) {
  try {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    new Notification(title, options);
  } catch (err) {
    console.warn("Notification failed:", err);
  }
}
