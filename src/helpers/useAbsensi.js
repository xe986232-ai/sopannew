import { useState, useEffect } from "react";
import { db } from "firebase.js";
import { ref, onValue, push, set, remove } from "firebase/database";

// ─────────────────────────────────────────────────────────────────────────────
// ABSENSI — Firebase Realtime Database
//
// Struktur data (path dibuat OTOMATIS oleh Firebase, bukan hardcode manual):
//
//   absensi/sessions/{sessionId}        -> { title, openAt, closeAt, createdAt, token }
//   absensi/records/{sessionId}/{memberId} -> { name, timestamp }
//
// - "sessionId" didapat otomatis dari push() (Firebase generate ID unik).
// - "token" adalah string acak (12 karakter) yang dibuat sekali pas sesi
//   dibuat, dipakai sebagai bagian URL "/absensi/{token}". Halaman absensi
//   HANYA bisa diakses lewat link yang mengandung token yang cocok dengan
//   salah satu sesi — tanpa token yang valid, halaman menolak akses. Admin
//   dapat link ini dari dashboard (AbsensiAdmin.js) buat di-share ke member.
// - "memberId" di records SENGAJA dipakai sebagai key (bukan push-ID lagi),
//   supaya 1 member cuma bisa punya 1 baris record per sesi (mencegah dobel
//   absen secara struktural, bukan cuma dicek di client).
// - Semua data di sini realtime (pakai onValue), jadi dashboard admin dan
//   halaman absensi member auto-update tanpa perlu refresh manual.
// ─────────────────────────────────────────────────────────────────────────────

// String token acak, cukup panjang (12 karakter alfanumerik campur besar/kecil)
// supaya praktis tidak bisa ditebak/di-brute-force orang lain.
export function generateToken(length = 12) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

// ── Sesi Absensi ──────────────────────────────────────────────────────────

export function useAbsensiSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionsRef = ref(db, "absensi/sessions");
    const unsubscribe = onValue(
      sessionsRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setSessions([]);
          setLoading(false);
          return;
        }
        const raw = snapshot.val();
        const list = Object.keys(raw).map((id) => ({
          id,
          title: raw[id].title || "Absensi",
          openAt: Number(raw[id].openAt),
          closeAt: Number(raw[id].closeAt),
          createdAt: Number(raw[id].createdAt) || 0,
          token: raw[id].token || null,
        }));
        // Terbaru di atas
        list.sort((a, b) => b.createdAt - a.createdAt);
        setSessions(list);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return { sessions, loading, error };
}

// Buat sesi absensi baru. "sessionId"-nya di-generate otomatis oleh
// Firebase (push ID), jadi admin tidak perlu (dan tidak bisa) menentukan
// path-nya sendiri — selalu path baru yang unik. "token" juga di-generate
// otomatis di sini, dipakai buat link share (/absensi/{token}).
export async function createAbsensiSession({ title, openAt, closeAt }) {
  const sessionsRef = ref(db, "absensi/sessions");
  const newRef = push(sessionsRef);
  const token = generateToken();
  await set(newRef, {
    title: title || "Absensi",
    openAt,
    closeAt,
    createdAt: Date.now(),
    token,
  });
  return { id: newRef.key, token };
}

export async function deleteAbsensiSession(sessionId) {
  await remove(ref(db, `absensi/sessions/${sessionId}`));
  await remove(ref(db, `absensi/records/${sessionId}`));
}

// Cari sesi berdasarkan token dari URL (/absensi/:token). Dipakai halaman
// pages/Absensi.js supaya HANYA bisa diakses lewat link yang valid — kalau
// token kosong atau tidak cocok sama sesi manapun, hasilnya null (halaman
// akan menampilkan "akses ditolak", bukan sesi manapun secara default).
export function findSessionByToken(sessions, token) {
  if (!token) return null;
  return sessions.find((s) => s.token === token) || null;
}

// Tentukan sesi "yang relevan ditampilkan sekarang" dari semua sesi yang ada.
// Dipakai HANYA di dashboard admin (buat highlight sesi terbaru secara
// default), BUKAN di halaman absensi member — member wajib pakai token.
// 1) Kalau ada sesi yang sedang OPEN (now di antara openAt & closeAt) -> pakai itu.
// 2) Kalau tidak ada yang open, pakai sesi UPCOMING terdekat (openAt paling dekat di masa depan).
// 3) Kalau semua sudah closed, pakai sesi yang paling terakhir ditutup.
export function pickCurrentSession(sessions, now) {
  if (!sessions || sessions.length === 0) return null;

  const open = sessions.find((s) => now >= s.openAt && now <= s.closeAt);
  if (open) return open;

  const upcoming = sessions
    .filter((s) => now < s.openAt)
    .sort((a, b) => a.openAt - b.openAt)[0];
  if (upcoming) return upcoming;

  return [...sessions].sort((a, b) => b.closeAt - a.closeAt)[0];
}

// ── Rekap Kehadiran (per sesi) ────────────────────────────────────────────

export function useAbsensiRecords(sessionId) {
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setRecords({});
      setLoading(false);
      return;
    }
    setLoading(true);
    const recordsRef = ref(db, `absensi/records/${sessionId}`);
    const unsubscribe = onValue(
      recordsRef,
      (snapshot) => {
        setRecords(snapshot.exists() ? snapshot.val() : {});
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [sessionId]);

  return { records, loading, error };
}

// Catat kehadiran satu member di satu sesi. Key-nya = memberId (bukan
// push-ID), jadi kalau member yang sama coba nulis lagi, isinya cuma
// ke-overwrite pada key yang sama, bukan bikin baris baru.
export async function markAttendance(sessionId, memberId, name) {
  const recordRef = ref(db, `absensi/records/${sessionId}/${memberId}`);
  await set(recordRef, {
    name,
    timestamp: Date.now(),
  });
}
