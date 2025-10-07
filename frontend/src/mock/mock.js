/*
  DarkCTF Mock Data & Helpers
  NOTE: This is a frontend-only mock. No backend validation yet.
  Hidden keys are intentionally left in source to emulate CTF code-inspection mechanics.
  Flags follow: Dark_Flag{alphanumeric}
*/

// Subtle hint trail for seekers:
// [S1] Caesar shiftKey=3
// [S2] XOR keyChar='K' (0x4b)
// [S3] Vigenere keyWord="MATRIX"

export const FLAGS = {
  s1: "Dark_Flag{S1C43s4rCr4ck3d}",
  s2: "Dark_Flag{S2_X0R_wn3d}",
  s3: "Dark_Flag{S3_V1g3n3r3_OK}",
  master: "Dark_Flag{M4st3r_P0wn3r}"
};

const STORAGE_KEY = "darkctf_progress_v1";

export function getProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { solved: {}, flags: {} };
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : { solved: {}, flags: {} };
  } catch (_) {
    return { solved: {}, flags: {} };
  }
}

export function setStageSolved(stageId, flag) {
  const p = getProgress();
  p.solved[stageId] = true;
  p.flags[stageId] = flag;
  // if all three, compute master
  if (p.solved.s1 && p.solved.s2 && p.solved.s3) {
    p.flags.master = FLAGS.master;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  return p;
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

export function isUnlocked(stageId) {
  const p = getProgress();
  if (stageId === "s1") return true;
  if (stageId === "s2") return !!p.solved.s1;
  if (stageId === "s3") return !!p.solved.s2;
  if (stageId === "master") return !!(p.solved.s1 && p.solved.s2 && p.solved.s3);
  return false;
}

// Utilities
function caesarDecode(s, shift) {
  const a = "abcdefghijklmnopqrstuvwxyz";
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return [...s].map(ch => {
    if (a.includes(ch)) return a[(a.indexOf(ch) - shift + 26) % 26];
    if (A.includes(ch)) return A[(A.indexOf(ch) - shift + 26) % 26];
    return ch;
  }).join("");
}

function xorHexFromPlain(plain, keyChar) {
  const k = keyChar.charCodeAt(0);
  const bytes = [...plain].map(c => c.charCodeAt(0) ^ k);
  return bytes.map(b => b.toString(16).padStart(2, "0")).join("");
}

function xorDecodeFromHex(hex, keyChar) {
  const k = keyChar.charCodeAt(0);
  const bytes = hex.match(/.{1,2}/g) || [];
  return bytes.map(h => String.fromCharCode(parseInt(h, 16) ^ k)).join("");
}

function vigenereEncode(plain, key) {
  const A = "A".charCodeAt(0);
  const up = plain.toUpperCase().replace(/[^A-Z]/g, "");
  const uk = key.toUpperCase();
  let out = "";
  for (let i = 0; i < up.length; i++) {
    const p = up.charCodeAt(i) - A;
    const k = uk.charCodeAt(i % uk.length) - A;
    out += String.fromCharCode(((p + k) % 26) + A);
  }
  return out;
}

function vigenereDecode(cipher, key) {
  const A = "A".charCodeAt(0);
  const uc = cipher.toUpperCase().replace(/[^A-Z]/g, "");
  const uk = key.toUpperCase();
  let out = "";
  for (let i = 0; i < uc.length; i++) {
    const c = uc.charCodeAt(i) - A;
    const k = uk.charCodeAt(i % uk.length) - A;
    out += String.fromCharCode(((c - k + 26) % 26) + A);
  }
  return out;
}

// Puzzle data
const S1_SHIFT = 3; // <= classic
const S1_PLAINTEXT = "NEON MATRIX"; // Expected input (spaces allowed)
const S1_CIPHER = caesarDecode(S1_PLAINTEXT, -S1_SHIFT); // encode by reversing decode

const S2_KEY = 'K'; // 0x4b
const S2_PLAINTEXT = "CYBER NOVA"; // Expected
const S2_CIPHERHEX = xorHexFromPlain(S2_PLAINTEXT, S2_KEY);

const S3_KEY = "MATRIX";
const S3_PLAINTEXT = "DARK HACKER";
const S3_CIPHER = vigenereEncode(S3_PLAINTEXT, S3_KEY);

export const PUZZLES = [
  {
    id: "s1",
    title: "Stage 1 · Caesar Cipher",
    difficulty: "Easy",
    color: "#00FF41",
    prompt:
      "Decrypt the text below (classic Caesar). Submit the original phrase to claim the flag.",
    payload: S1_CIPHER,
    verify: (user) => {
      const norm = (user || "").trim().toUpperCase();
      return norm === S1_PLAINTEXT.toUpperCase();
    },
    reveal: () => FLAGS.s1
  },
  {
    id: "s2",
    title: "Stage 2 · XOR Hex",
    difficulty: "Medium",
    color: "#F78166",
    prompt:
      "Given a hex string produced by XOR with a single-byte key, recover the original phrase.",
    payload: S2_CIPHERHEX, // XOR of S2_PLAINTEXT with S2_KEY
    verify: (user) => {
      const norm = (user || "").trim().toUpperCase();
      return norm === S2_PLAINTEXT.toUpperCase();
    },
    reveal: () => FLAGS.s2
  },
  {
    id: "s3",
    title: "Stage 3 · Vigenère",
    difficulty: "Hard",
    color: "#FF0040",
    prompt:
      "Vigenère cipher with an unknown keyword. Decode and submit the original phrase.",
    payload: S3_CIPHER,
    verify: (user) => {
      const norm = (user || "").trim().toUpperCase();
      return norm === S3_PLAINTEXT.toUpperCase();
    },
    reveal: () => FLAGS.s3
  }
];

export function getMasterFlag() {
  const p = getProgress();
  if (p.solved.s1 && p.solved.s2 && p.solved.s3) return FLAGS.master;
  return null;
}

export function getPuzzleById(id) {
  return PUZZLES.find(p => p.id === id);
}

export function listStages() {
  return [
    { id: "s1", label: "Stage 1" },
    { id: "s2", label: "Stage 2" },
    { id: "s3", label: "Stage 3" },
    { id: "master", label: "Master Flag" }
  ];
}