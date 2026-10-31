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

export const DEFAULT_COMPANION_PREFS = {
  enabled: true,
  size: "medium",
  rotation: "auto",
};

export const isCompanionSize = (value) => COMPANION_SIZES.includes(value);
export const isCompanionRotation = (value) => COMPANION_ROTATIONS.includes(value);

/** Builds a complete, valid prefs object from untrusted data (storage). */
export function normalizeCompanionPrefs(raw) {
  const input = typeof raw === "object" && raw !== null ? raw : {};
  return {
    enabled: typeof input.enabled === "boolean" ? input.enabled : DEFAULT_COMPANION_PREFS.enabled,
    size: isCompanionSize(input.size) ? input.size : DEFAULT_COMPANION_PREFS.size,
    rotation: isCompanionRotation(input.rotation) ? input.rotation : DEFAULT_COMPANION_PREFS.rotation,
  };
}
