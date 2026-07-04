import { db } from "firebase.js";
import { ref, get } from "firebase/database";
import { saveSession } from "helpers/session.js";

// ─────────────────────────────────────────────────────────────────────────────
// AUTH — Login pakai Firebase Realtime Database, path "users"
//
// Karena "users" tersimpan sebagai object dengan key = push-ID (bukan
// username), proses login di sini ambil seluruh node "users" lalu cari
// entry yang field "username"-nya cocok (case-insensitive), lalu cocokkan
// "passwordPlain"-nya persis.
//
// CATATAN KEAMANAN (sudah pernah diingatkan sebelumnya juga):
// - Password disimpan PLAINTEXT di database ("passwordPlain"), dan proses
//   ini nge-download seluruh node "users" (termasuk semua password member
//   lain) ke browser buat dicocokkan di sisi client. Ini cara paling
//   sederhana yang sesuai skema data yang sudah ada, tapi TIDAK aman untuk
//   produksi jangka panjang — idealnya pindah ke Firebase Authentication
//   atau minimal validasi password di server (Cloud Function), bukan di
//   client. Ditandai di sini supaya tidak lupa dibenahi nanti.
// ─────────────────────────────────────────────────────────────────────────────

export async function loginWithUsername(username, password) {
  const trimmedUsername = (username || "").trim();
  const trimmedPassword = (password || "").trim();

  if (!trimmedUsername || !trimmedPassword) {
    return { ok: false, reason: "empty" };
  }

  let snapshot;
  try {
    snapshot = await get(ref(db, "users"));
  } catch (err) {
    return { ok: false, reason: "network" };
  }

  if (!snapshot.exists()) {
    return { ok: false, reason: "not-found" };
  }

  const raw = snapshot.val();
  const entry = Object.entries(raw).find(
    ([, u]) => (u.username || "").trim().toLowerCase() === trimmedUsername.toLowerCase()
  );

  if (!entry) {
    return { ok: false, reason: "not-found" };
  }

  const [id, user] = entry;
  if (String(user.passwordPlain ?? "") !== trimmedPassword) {
    return { ok: false, reason: "wrong-password" };
  }

  const session = saveSession({ id, ...user });
  return { ok: true, user: session };
}
