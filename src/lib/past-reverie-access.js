// Passphrase check for Ripples of Past Reverie (data/past-reverie.js).
//
// PBKDF2-HMAC-SHA-256 through the browser's Web Crypto API: the entered
// passphrase is stretched with the stored salt and the result is compared with
// the stored verifier. Nothing here touches storage, the network or the
// console, and nothing runs until verifyPasscode() is called from a submit
// handler, so the static prerender never executes any of it.
//
// Policy: the passphrase is case-sensitive and used exactly as typed (no
// trimming, no case folding). Anything longer than MAX_PASSPHRASE_LENGTH is
// rejected without doing the expensive derivation.

export const MAX_PASSPHRASE_LENGTH = 256;

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function decodeBase64(text) {
  if (typeof text !== "string" || !/^[A-Za-z0-9+/]+={0,2}$/.test(text) || text.length % 4 !== 0) {
    throw fail("unconfigured", "Value is not valid base64.");
  }
  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// False while the salt or verifier is still a placeholder (or malformed).
export function isAccessConfigured(access) {
  try {
    return decodeBase64(access?.salt).length >= 16 && decodeBase64(access?.verifier).length >= 32;
  } catch {
    return false;
  }
}

// Full-length comparison with no early exit.
function sameBytes(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

// Resolves true or false. Rejects with error.code "unsupported" when Web
// Crypto is missing (an insecure context or a very old browser) and
// "unconfigured" while the data module still holds placeholders.
export async function verifyPasscode(passphrase, access, subtle = globalThis.crypto?.subtle) {
  if (!subtle) throw fail("unsupported", "Web Crypto is not available.");
  if (!isAccessConfigured(access)) throw fail("unconfigured", "Access is not configured.");
  if (typeof passphrase !== "string" || passphrase.length === 0 || passphrase.length > MAX_PASSPHRASE_LENGTH) {
    return false;
  }

  const salt = decodeBase64(access.salt);
  const expected = decodeBase64(access.verifier);
  const material = await subtle.importKey("raw", new TextEncoder().encode(passphrase), access.algorithm, false, [
    "deriveBits",
  ]);
  const derived = await subtle.deriveBits(
    { name: access.algorithm, hash: access.hash, salt, iterations: access.iterations },
    material,
    expected.length * 8,
  );
  return sameBytes(new Uint8Array(derived), expected);
}
