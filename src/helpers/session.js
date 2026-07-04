// ─────────────────────────────────────────────────────────────────────────────
// SESSION — Sopan Team
// Nyimpen data member yang lagi login di localStorage (browser), supaya
// halaman lain (misalnya Absensi) tahu siapa yang sedang login tanpa perlu
// login ulang tiap pindah halaman.
//
// CATATAN: field sensitif (email, passwordPlain) SENGAJA tidak pernah
// disimpan ke session ini — hanya data aman yang boleh tampil di UI.
// ─────────────────────────────────────────────────────────────────────────────

const SESSION_KEY = "sopan_session";

export function saveSession(user) {
  const safeUser = {
    id: user.id,
    username: user.username || "Member",
    role: user.role || "member",
    profilePic: user.profilePic || null,
  };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  } catch {
    // localStorage bisa gagal (mode privat dll) — abaikan, login tetap
    // berhasil untuk sesi berjalan ini saja.
  }
  return safeUser;
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // no-op
  }
}
