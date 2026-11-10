const ITERATIONS = 310000;
const encoder = new TextEncoder();

function bytesToBase64(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64ToBytes(value) {
  if (typeof value !== "string" || !/^[A-Za-z0-9+/]*={0,2}$/.test(value)) {
    throw new Error("Invalid encrypted data.");
  }
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function deriveKey(password, salt) {
  const material = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptMessage(message, password) {
  if (!message.trim()) throw new Error("Please enter a message first.");
  if (password.length < 8) throw new Error("Use a password with at least 8 characters.");
  if (message.length > 100000) throw new Error("Message is too long. Limit: 100,000 characters.");

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, tagLength: 128 },
    key,
    encoder.encode(message)
  );

  return JSON.stringify(
    {
      format: "cryptotext",
      version: 1,
      algorithm: "AES-256-GCM",
      kdf: "PBKDF2-SHA256",
      iterations: ITERATIONS,
      salt: bytesToBase64(salt),
      iv: bytesToBase64(iv),
      ciphertext: bytesToBase64(new Uint8Array(encrypted)),
    },
    null,
    2
  );
}

export async function decryptMessage(payload, password) {
  if (!payload.trim()) throw new Error("Paste the encrypted message first.");
  if (!password) throw new Error("Enter the password used for encryption.");

  let data;
  try {
    data = JSON.parse(payload);
  } catch {
    throw new Error("This does not look like valid CryptoText encrypted data.");
  }

  if (
    data?.format !== "cryptotext" ||
    data?.version !== 1 ||
    data?.algorithm !== "AES-256-GCM" ||
    data?.kdf !== "PBKDF2-SHA256" ||
    data?.iterations !== ITERATIONS
  ) {
    throw new Error("Unsupported or invalid encrypted-data format.");
  }

  try {
    const salt = base64ToBytes(data.salt);
    const iv = base64ToBytes(data.iv);
    const ciphertext = base64ToBytes(data.ciphertext);

    if (salt.length !== 16 || iv.length !== 12 || ciphertext.length < 16) {
      throw new Error("Invalid encrypted data.");
    }

    const key = await deriveKey(password, salt);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv, tagLength: 128 },
      key,
      ciphertext
    );

    return new TextDecoder("utf-8", { fatal: true }).decode(decrypted);
  } catch {
    throw new Error("Decryption failed. Check the password and encrypted text.");
  }
}
