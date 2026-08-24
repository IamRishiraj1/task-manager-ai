// Safe UUID generator. `crypto.randomUUID()` is only available in secure
// (HTTPS) contexts and only on relatively recent browsers — some Android
// in-app/older WebView browsers don't have it yet. Falling back to a
// manual implementation avoids a hard crash on those devices, which is
// exactly what caused the blank-page-on-mobile bug.
export function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // RFC4122-ish fallback, good enough for local task IDs (not cryptographic use).
  return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}
