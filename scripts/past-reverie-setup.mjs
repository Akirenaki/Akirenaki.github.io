// Development-only helper: makes the salt and verifier for src/data/past-reverie.js.
//
//   node scripts/past-reverie-setup.mjs
//
// It asks for the passphrase twice in an interactive terminal, without echoing
// it, normalises each entry with lib/normalise-passphrase.js (the same function
// the site uses, so case, spacing and punctuation do not matter), derives the
// verifier with the algorithm, hash and iteration count already set in the data
// module, and prints the `salt`, `verifier` and `normalisation` lines to paste
// in. The passphrase is never written to disk or printed (only the length of
// its normalised form is shown), and this file is not imported by the site, so
// it is not part of the production bundle.
//
// A new random salt is made on every run, so run it once, paste the result, and
// do not mix a salt from one run with a verifier from another.

import { pbkdf2, randomBytes } from "node:crypto";
import { promisify } from "node:util";
import { PAST_REVERIE } from "../src/data/past-reverie.js";
import { MAX_PASSPHRASE_LENGTH } from "../src/lib/past-reverie-access.js";
import { NORMALISATION_VERSION, normalisePassphrase } from "../src/lib/normalise-passphrase.js";

const derive = promisify(pbkdf2);
const { hash, iterations } = PAST_REVERIE.access;
const DIGEST = hash.replace("-", "").toLowerCase(); // "SHA-256" -> "sha256"
const SALT_BYTES = 32;
const KEY_BYTES = 32;

function promptHidden(label) {
  return new Promise((resolve, reject) => {
    const { stdin, stdout } = process;
    stdout.write(label);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let typed = "";
    const finish = (error) => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener("data", onData);
      stdout.write("\n");
      if (error) reject(error);
      else resolve(typed);
    };
    const onData = (chunk) => {
      for (const char of chunk) {
        if (char === "\r" || char === "\n") return finish();
        if (char === "\u0003") return finish(new Error("Cancelled."));
        if (char === "\u007f" || char === "\b") typed = Array.from(typed).slice(0, -1).join("");
        else if (char >= " ") typed += char;
      }
    };
    stdin.on("data", onData);
  });
}

async function main() {
  if (!process.stdin.isTTY) {
    throw new Error("Run this in an interactive terminal so the passphrase can be typed without echo.");
  }
  // Both entries are normalised before they are compared, so a formatting
  // difference between the two attempts does not fail the confirmation.
  const first = normalisePassphrase(await promptHidden("Passphrase: "));
  if (first.length === 0) {
    throw new Error("Nothing is left of that passphrase once spaces and punctuation are ignored. Use letters or digits.");
  }
  if (first.length > MAX_PASSPHRASE_LENGTH) {
    throw new Error(`Too long: ${first.length} letters and digits after normalising, and the limit is ${MAX_PASSPHRASE_LENGTH}.`);
  }
  const second = normalisePassphrase(await promptHidden("Again: "));
  if (first !== second) throw new Error("The two entries did not match.");
  console.log(`Normalised length: ${first.length} letters and digits.`);

  const salt = randomBytes(SALT_BYTES);
  const key = await derive(first, salt, iterations, KEY_BYTES, DIGEST);

  console.log(`\nPBKDF2-HMAC-${hash}, ${iterations} iterations. Paste into PAST_REVERIE.access in src/data/past-reverie.js (replace the old salt, verifier and normalisation lines):\n`);
  console.log(`    salt: "${salt.toString("base64")}",`);
  console.log(`    verifier: "${key.toString("base64")}",`);
  console.log(`    normalisation: ${NORMALISATION_VERSION},\n`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
