// Bot defenses for the contact form. None of them is visible to a person.

/** A field hidden from people. Form-filling bots fill every field, so anything here means a bot. */
export const HONEYPOT_FIELD = "leave_empty";

/** Milliseconds from the form appearing to its submit, measured in the browser so clock skew can't matter. */
export const ELAPSED_FIELD = "elapsed";

/** Nobody gets through four steps and their details this fast; a script does. */
const MIN_FILL_MS = 3000;

/**
 * True when the submission is almost certainly a bot. The fill time is only
 * checked when present, so a client glitch can never drop a real lead.
 */
export function looksAutomated(formData: FormData): boolean {
  if (String(formData.get(HONEYPOT_FIELD) ?? "").trim() !== "") return true;
  const raw = formData.get(ELAPSED_FIELD);
  if (raw === null || raw === "") return false;
  const elapsed = Number(raw);
  return Number.isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_FILL_MS;
}

// Rate limit per visitor. It lives in the server instance's memory, so it
// stops one sender looping on the form, not a distributed attack.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const MAX_TRACKED = 5000;
const recent = new Map<string, number[]>();

/** Records a send for `key` and returns true when it's over the limit (the send isn't counted then). */
export function overLimit(key: string, now = Date.now()): boolean {
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) {
    recent.set(key, hits);
    return true;
  }
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 500) {
    for (const [k, times] of recent) if (times.every((t) => now - t >= WINDOW_MS)) recent.delete(k);
  }
  // A flood from many addresses can't grow this without bound: drop the oldest visitors first.
  for (const k of recent.keys()) {
    if (recent.size <= MAX_TRACKED) break;
    recent.delete(k);
  }
  return false;
}
