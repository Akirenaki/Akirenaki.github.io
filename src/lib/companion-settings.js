// Shared definition of Heimarmene's preferences. Everything is stored on the
// visitor's own device (localStorage): the site has no accounts, so there is
// nothing to sync and nothing is sent anywhere.

export const COMPANION_NAME = "Heimarmene";

export const COMPANION_SIZES = ["small", "medium", "large"];

// Every size keeps the draggable mascot at or above a 44px touch target.
export const COMPANION_SIZE_PX = { small: 56, medium: 76, large: 104 };

// "auto" renders the 3D lattice and silently drops to the flat (CSS-only)
// rotation if the device cannot keep up. "3d" and "flat" force one of them.
export const COMPANION_ROTATIONS = ["auto", "3d", "flat"];

export const MOTION_SPEED_MIN = 50;
export const MOTION_SPEED_MAX = 150;
export const MOTION_SPEED_STEP = 10;
export const DEFAULT_DRIFT_SPEED = 70;
export const STARFIELD_SPEED_MIN = 20;
export const STARFIELD_SPEED_MAX = 200;
export const DEFAULT_STARFIELD_SPEED = 100;

export const DEFAULT_COMPANION_PREFS = {
  enabled: true,
  ambientMotion: true,
  driftSpeed: DEFAULT_DRIFT_SPEED,
  starfieldSpeed: DEFAULT_STARFIELD_SPEED,
  size: "medium",
  rotation: "auto",
};

export const isCompanionSize = (value) => COMPANION_SIZES.includes(value);
export const isCompanionRotation = (value) => COMPANION_ROTATIONS.includes(value);

function normalizeSpeed(value, min, max, fallback) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value / MOTION_SPEED_STEP) * MOTION_SPEED_STEP));
}

/** Builds a complete, valid prefs object from untrusted data (storage). */
export function normalizeCompanionPrefs(raw) {
  const input = typeof raw === "object" && raw !== null ? raw : {};
  return {
    enabled: typeof input.enabled === "boolean" ? input.enabled : DEFAULT_COMPANION_PREFS.enabled,
    ambientMotion: typeof input.ambientMotion === "boolean" ? input.ambientMotion : DEFAULT_COMPANION_PREFS.ambientMotion,
    driftSpeed: normalizeSpeed(input.driftSpeed, MOTION_SPEED_MIN, MOTION_SPEED_MAX, DEFAULT_COMPANION_PREFS.driftSpeed),
    starfieldSpeed: normalizeSpeed(input.starfieldSpeed, STARFIELD_SPEED_MIN, STARFIELD_SPEED_MAX, DEFAULT_COMPANION_PREFS.starfieldSpeed),
    size: isCompanionSize(input.size) ? input.size : DEFAULT_COMPANION_PREFS.size,
    rotation: isCompanionRotation(input.rotation) ? input.rotation : DEFAULT_COMPANION_PREFS.rotation,
  };
}
