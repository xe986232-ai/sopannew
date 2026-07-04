import { useState, useEffect } from "react";
import { db } from "firebase.js";
import { ref, get, child } from "firebase/database";

// ─────────────────────────────────────────────────────────────────────────────
// Hook untuk ambil data member Sopan Remix dari Firebase Realtime Database,
// path "users". Semua user di path ini adalah member Sopan Remix.
//
// CATATAN KEAMANAN: field "email" dan "passwordPlain" SENGAJA tidak diambil
// sama sekali di sini — data itu sensitif dan tidak boleh ditampilkan publik.
// Hanya field yang aman & relevan untuk ditampilkan yang dipetakan.
//
// Hanya user dengan status "success" yang ditampilkan (asumsi: status approval
// pendaftaran). Kalau asumsi ini salah, cukup hapus baris .filter di bawah.
// ─────────────────────────────────────────────────────────────────────────────

function mapUser(id, u = {}) {
  const roleRaw = u.role ? String(u.role) : "Member";
  return {
    id,
    name: u.username || "Member",
    position: roleRaw.charAt(0).toUpperCase() + roleRaw.slice(1),
    profilePic: u.profilePic || null,
    tiktok: u.tiktok || null,
    youtube: u.youtube || null,
    followers: typeof u.followers === "number" ? u.followers : null,
    joinDate: u.createdAt || null,
    status: u.status || null,
  };
}

export function useRemixMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    get(ref(db, "users"))
      .then((snapshot) => {
        if (!isMounted) return;
        if (!snapshot.exists()) {
          setMembers([]);
          return;
        }
        const raw = snapshot.val();
        const list = Object.keys(raw)
          .map((id) => mapUser(id, raw[id]))
          .filter((m) => !m.status || m.status === "success");
        setMembers(list);
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { members, loading, error };
}

export function useRemixMember(id) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let isMounted = true;
    get(child(ref(db), `users/${id}`))
      .then((snapshot) => {
        if (!isMounted) return;
        if (!snapshot.exists()) {
          setMember(null);
          return;
        }
        setMember(mapUser(id, snapshot.val()));
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  return { member, loading, error };
}
