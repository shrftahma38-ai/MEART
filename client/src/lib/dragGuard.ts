/**
 * A drag across the property rail must never turn into a click on whichever card
 * ends up under the cursor. Event-phase tricks (capture listeners, click
 * suppression) proved fragile across browsers, so the rail simply records when a
 * drag ended and card links ignore any click inside the short window that follows.
 *
 * Time-based, so it cannot leak into later, deliberate clicks.
 */
const CLICK_WINDOW_MS = 300;
let lastDragEnd = 0;

export function markDragEnd(): void {
  lastDragEnd = Date.now();
}

export function isDragClick(): boolean {
  return Date.now() - lastDragEnd < CLICK_WINDOW_MS;
}
