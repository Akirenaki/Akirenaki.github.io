// Pure geometry for the draggable companion dock. The position is stored as a
// fraction (0..1) of the space the mascot can travel in, not as pixels, so a
// window resize or a rotated phone never strands it off-screen.


export const DOCK_MARGIN = 16;
export const DEFAULT_DOCK_POSITION = { x: 1, y: 1 }; // bottom-right

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function travel(viewport, size) {
  return {
    width: Math.max(0, viewport.width - size - DOCK_MARGIN * 2),
    height: Math.max(0, viewport.height - size - DOCK_MARGIN * 2),
  };
}

export function positionToPixels(position, viewport, size) {
  const room = travel(viewport, size);
  return {
    left: DOCK_MARGIN + clamp(position.x, 0, 1) * room.width,
    top: DOCK_MARGIN + clamp(position.y, 0, 1) * room.height,
  };
}

export function pixelsToPosition(left, top, viewport, size) {
  const room = travel(viewport, size);
  return {
    x: room.width === 0 ? 1 : clamp((left - DOCK_MARGIN) / room.width, 0, 1),
    y: room.height === 0 ? 1 : clamp((top - DOCK_MARGIN) / room.height, 0, 1),
  };
}

export function clampPixels(left, top, viewport, size) {
  const room = travel(viewport, size);
  return {
    left: clamp(left, DOCK_MARGIN, DOCK_MARGIN + room.width),
    top: clamp(top, DOCK_MARGIN, DOCK_MARGIN + room.height),
  };
}

export function parseStoredPosition(raw) {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (typeof value.x !== "number" || typeof value.y !== "number") return null;
    if (!Number.isFinite(value.x) || !Number.isFinite(value.y)) return null;
    return { x: clamp(value.x, 0, 1), y: clamp(value.y, 0, 1) };
  } catch {
    return null;
  }
}


// Phones get a bottom sheet; everything else gets a panel anchored beside the
// mascot, preferring the side with more room.
export const SHEET_BREAKPOINT = 640;

export function placePanel(anchor, viewport, requestedSize = {}) {
  if (viewport.width < SHEET_BREAKPOINT) {
    const height = Math.min(requestedSize.height ?? 576, viewport.height - 16);
    return { mode: "sheet", height: Math.max(height, Math.min(viewport.height - 16, 320)) };
  }
  const width = Math.min(requestedSize.width ?? 384, viewport.width - 32);
  const height = Math.min(requestedSize.height ?? 640, viewport.height - 32);
  const gap = 12;
  const centerX = anchor.left + anchor.size / 2;
  const left = clamp(centerX - width / 2, 16, viewport.width - width - 16);

  const above = anchor.top - gap - 16;
  const below = viewport.height - (anchor.top + anchor.size + gap) - 16;
  let top;
  let usable;
  if (above >= below) {
    usable = Math.min(height, above);
    top = anchor.top - gap - usable;
  } else {
    usable = Math.min(height, below);
    top = anchor.top + anchor.size + gap;
  }
  return { mode: "floating", left, top, width, height: Math.max(usable, Math.min(height, 320)) };
}
