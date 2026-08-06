/**
 * Thin wrapper around the browser's built-in Web Crypto API (crypto.subtle).
 * All hashing / encryption / decryption logic lives here — nowhere else.
 */

/** Convert ArrayBuffer / TypedArray → base64 string (for storage / transport). */
function bufToBase64(buf) {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/** Convert base64 string → ArrayBuffer. */
function base64ToBuf(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Hash a password string with SHA-256.
 * Returns a 32-byte ArrayBuffer that can be used directly as an AES-256 key.
 */
async function digest(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  return crypto.subtle.digest("SHA-256", data);
}

/**
 * Import a raw 32-byte key for AES-GCM encrypt / decrypt.
 */
async function importKey(rawKey) {
  return crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt plaintext with AES-GCM.
 * Generates a fresh random 12-byte IV every time.
 * Returns { ciphertext: base64, iv: base64 }.
 */
async function encrypt(plaintext, password) {
  const rawKey = await digest(password);
  const key = await importKey(rawKey);

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encoded = encoder.encode(plaintext);

  const ciphertextBuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  return {
    ciphertext: bufToBase64(ciphertextBuf),
    iv: bufToBase64(iv),
  };
}

/**
 * Decrypt ciphertext (base64) + iv (base64) using the password.
 * Returns the plaintext string, or throws on failure (wrong password / bad data).
 */
async function decrypt(ciphertextB64, ivB64, password) {
  const rawKey = await digest(password);
  const key = await importKey(rawKey);

  const ciphertext = base64ToBuf(ciphertextB64);
  const iv = new Uint8Array(base64ToBuf(ivB64));

  const decryptedBuf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decryptedBuf);
}

// Expose helpers on window so pages can call them
window.CryptoHelper = {
  digest,
  importKey,
  encrypt,
  decrypt,
  bufToBase64,
  base64ToBuf,
};
