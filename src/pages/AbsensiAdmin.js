import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container, ContentWithPaddingXl as ContentWithPaddingXlBase } from "components/misc/Layouts.js";
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import HeaderBase, { NavLinks, NavLink as HeaderNavLink } from "components/headers/light.js";
import { ReactComponent as PlusIcon } from "feather-icons/dist/icons/plus.svg";
import { ReactComponent as XIcon } from "feather-icons/dist/icons/x.svg";
import { ReactComponent as LogOutIcon } from "feather-icons/dist/icons/log-out.svg";
import { ReactComponent as CopyIcon } from "feather-icons/dist/icons/copy.svg";
import { ReactComponent as CheckIcon } from "feather-icons/dist/icons/check.svg";
import { ReactComponent as LinkIcon } from "feather-icons/dist/icons/link.svg";
import { ReactComponent as ChevronDownIcon } from "feather-icons/dist/icons/chevron-down.svg";
import { ReactComponent as DownloadIcon } from "feather-icons/dist/icons/download.svg";
import { ReactComponent as EyeIcon } from "feather-icons/dist/icons/eye.svg";
import { ReactComponent as EyeOffIcon } from "feather-icons/dist/icons/eye-off.svg";
import { ReactComponent as LockIcon } from "feather-icons/dist/icons/lock.svg";
import { ReactComponent as UsersIcon } from "feather-icons/dist/icons/users.svg";
import { ReactComponent as AlertTriangleIcon } from "feather-icons/dist/icons/alert-triangle.svg";
import { getSession, clearSession } from "helpers/session.js";
import { useRemixMembers } from "helpers/useRemixMembers.js";
import { useAbsensiSessions, useAbsensiRecords, createAbsensiSession } from "helpers/useAbsensi.js";
import { db } from "firebase.js";
import { ref, get } from "firebase/database";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD ADMIN — ABSENSI SOPAN TEAM (/absensi/admin)
//
// Fungsi halaman ini:
//   1) Admin bisa "Create Absensi" -> pilih tanggal mulai & tanggal tutup ->
//      tersimpan ke Firebase Realtime Database path baru OTOMATIS:
//      absensi/sessions/{sessionId} (sessionId = push-ID dari Firebase),
//      lengkap dengan "token" acak yang di-generate otomatis juga.
//   2) Begitu sesi dibuat, muncul kotak "Link Absensi" berisi URL
//      "{origin}/absensi/{token}" + tombol Copy Link, buat di-share admin ke
//      member. Member TIDAK bisa buka halaman absensi tanpa link ini —
//      lihat guard token di pages/Absensi.js.
//   3) Tiap sesi absensi ditampilkan sebagai GRUP ACCORDION (bisa
//      dibuka/tutup satu-satu) supaya daftar sesi tidak numpuk kalau makin
//      banyak sesi yang dibuat — hanya konten sesi yang lagi dibuka yang
//      "mengambil tempat" secara visual.
//   4) Di dalam tiap sesi yang dibuka, admin bisa lihat member mana yang
//      SUDAH absen dan mana yang BELUM (lengkap dengan foto profil member
//      dari field "profilePic"), dengan data member diambil dari path
//      "users" (= member Sopan Remix, lewat helpers/useRemixMembers.js).
//   5) Admin bisa download rekap kehadiran per-sesi dalam bentuk PDF
//      (tombol "Download PDF" di dalam tiap sesi).
//   6) Semua data realtime (onValue) — begitu member absen di halaman
//      pages/Absensi.js, daftar di sini otomatis update tanpa refresh.
//      Data kehadiran (records) HANYA di-listen untuk sesi yang lagi
//      dibuka (accordion open) supaya tidak buka banyak listener Firebase
//      sekaligus untuk sesi yang sedang tidak dilihat.
//
// AKSES: halaman ini hanya untuk user dengan role "admin" pada path
// users/{id}/role di Firebase. Kalau belum ada admin, ubah manual dulu field
// "role" salah satu user di Firebase Console jadi "admin", baru login pakai
// akun itu untuk bisa masuk ke halaman ini.
// ─────────────────────────────────────────────────────────────────────────────

const StyledHeader = tw(HeaderBase)`max-w-none py-4`;

// Halaman default (ContentWithPaddingXl) di-cap "max-w-screen-xl mx-auto",
// jadi kontennya nempel di tengah dan nyisain ruang kosong gede di kanan-kiri
// layar. Untuk dashboard admin ini kita mau isi penuh lebar layar (bukan
// cuma ambil tengah), jadi kita override max-width-nya di sini saja —
// halaman lain yang masih pakai ContentWithPaddingXl versi asli tidak
// terpengaruh sama sekali.
const ContentWithPaddingXl = tw(ContentWithPaddingXlBase)`max-w-full py-10 lg:py-12 px-4 sm:px-6 lg:px-10 xl:px-16`;

const HeadingRow = tw.div`flex flex-wrap items-center justify-between gap-4 mb-10`;
const PageHeading = tw(SectionHeading)`text-left text-3xl!`;
const Subheading = tw(SubheadingBase)`mb-2`;

const CreateButton = styled(PrimaryButtonBase)`
  ${tw`flex items-center gap-2`}
`;

const LogoutNavButton = styled.button`
  ${tw`flex items-center text-sm lg:mx-6 my-2 lg:my-0 font-semibold tracking-wide transition duration-300 px-4 py-2 rounded-full bg-red-100 text-red-400 hover:bg-red-200 hover:text-red-500 focus:outline-none`}
`;

// ── Daftar sesi absensi sebagai grup accordion (satu per satu, bisa buka/tutup) ──
const SessionAccordionList = tw.div`flex flex-col gap-4`;
const EmptySessionText = tw.p`text-sm text-gray-500 px-2 py-10 text-center bg-gray-100 rounded-lg`;

const AccordionCard = tw.div`bg-gray-100 rounded-lg overflow-hidden`;

const AccordionHeader = styled.button`
  ${tw`w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition duration-200 focus:outline-none hover:bg-gray-200`}
`;
const AccordionHeaderLeft = tw.div`flex items-center gap-3 min-w-0 flex-1`;
const AccordionHeaderRight = tw.div`flex items-center gap-3 flex-shrink-0`;
const AccordionTitleBlock = tw.div`min-w-0`;
const AccordionTitle = tw.p`font-bold text-sm sm:text-base text-gray-900 truncate`;
const AccordionDateRange = tw.p`text-xs text-gray-500 mt-1 truncate`;

const StatusPill = styled.span`
  ${tw`inline-block flex-shrink-0 text-xs font-bold px-3 rounded-full whitespace-nowrap`}
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  ${(props) => {
    if (props.status === "open") return tw`bg-green-100 text-green-600`;
    if (props.status === "not-started") return tw`bg-yellow-100 text-yellow-700`;
    return tw`bg-gray-300 text-gray-600`;
  }}
`;

const AccordionChevron = styled.div`
  ${tw`flex-shrink-0 text-gray-400 transition-transform duration-300`}
  ${(props) => props.open && tw`transform rotate-180 text-primary-500`}
`;

// Trik CSS grid-template-rows: 0fr -> 1fr buat animasi expand/collapse yang
// halus tanpa perlu hitung tinggi elemen manual pakai JS.
const AccordionBodyOuter = styled.div`
  display: grid;
  transition: grid-template-rows 0.3s ease;
  grid-template-rows: ${(props) => (props.open ? "1fr" : "0fr")};
`;
const AccordionBodyInner = tw.div`overflow-hidden`;
const AccordionBodyContent = tw.div`px-5 pb-5 pt-4 border-t border-gray-300 border-opacity-50`;

const StatsRow = tw.div`grid grid-cols-3 gap-3 sm:gap-4 mb-6`;
const StatBox = tw.div`bg-white rounded-lg p-3 sm:p-4 text-center shadow`;
const StatValue = tw.p`text-xl sm:text-2xl font-black text-gray-900`;
const StatLabel = tw.p`text-xs text-gray-500 mt-1 uppercase tracking-wide`;

// ── Kotak "Link Absensi" (buat di-share admin ke member) ──
const ShareLinkBox = tw.div`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white rounded-lg p-3 mb-4 shadow-sm`;
const ShareLinkIconWrap = tw.div`hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500 text-gray-100 flex-shrink-0`;
const ShareLinkText = tw.p`flex-1 text-sm text-gray-700 truncate font-mono px-1`;
const ShareCopyButton = styled.button`
  ${tw`flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition duration-200 focus:outline-none flex-shrink-0`}
  ${(props) => (props.copied ? tw`bg-green-100 text-green-600` : tw`bg-primary-500 text-gray-100 hover:bg-primary-700`)}
`;
const NoTokenText = tw.p`text-xs text-gray-400 italic mb-4`;

// ── Baris aksi (download PDF, dst) ──
const ActionsRow = tw.div`flex flex-wrap items-center justify-end gap-3 mb-6`;
const DownloadButton = styled.button`
  ${tw`flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-gray-900 text-gray-100 hover:bg-gray-700 transition duration-200 focus:outline-none flex-shrink-0`}
  ${(props) => props.disabled && tw`opacity-50 cursor-not-allowed`}
`;

// ── Daftar member: dirapikan pakai list card + avatar (foto profil / inisial) ──
const MemberListHeader = tw.div`flex items-center justify-between gap-3 mb-3`;
const MemberListTitle = tw.h5`text-sm font-bold uppercase tracking-wide text-gray-500`;
const MemberCount = tw.span`text-xs text-gray-400 flex-shrink-0`;

const MemberListWrap = tw.div`bg-white rounded-lg shadow-sm divide-y divide-gray-100 overflow-hidden`;
const MemberRow = tw.div`flex items-center justify-between gap-4 px-4 sm:px-5 py-3 sm:py-4 hover:bg-gray-100 transition duration-150`;
const MemberLeft = tw.div`flex items-center gap-3 min-w-0 flex-1`;

const MemberAvatarImg = styled.img`
  ${tw`border border-gray-200 flex-shrink-0`}
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  object-fit: cover;
`;
const MemberAvatarFallback = tw.div`w-10 h-10 rounded-full bg-primary-500 text-gray-100 flex items-center justify-center font-bold flex-shrink-0 text-sm`;

const MemberInfo = tw.div`min-w-0 flex-1`;
const MemberName = tw.p`font-semibold text-sm text-gray-900 truncate`;
const MemberPosition = tw.p`text-xs text-gray-500 truncate`;

const MemberRight = tw.div`flex items-center gap-2 flex-shrink-0`;
const AttendedBadge = tw.span`text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full whitespace-nowrap`;
const NotAttendedBadge = tw.span`text-xs font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full whitespace-nowrap`;
const AttendedTime = tw.span`hidden sm:inline text-xs text-gray-400 whitespace-nowrap`;

const EmptyDetailState = tw.div`bg-gray-100 rounded-lg p-8 text-center text-gray-500 text-sm`;

// ── Section "Daftar Seluruh Member" (path "users") — accordion terpisah dari sesi absensi ──
const SectionSpacerTop = tw.div`mt-10 mb-4`;
const SectionSpacerTitle = tw.h4`text-lg font-bold text-gray-900`;
const SectionSpacerSubtitle = tw.p`text-xs text-gray-500 mt-1`;

const MemberCountPill = tw.span`inline-block flex-shrink-0 text-xs font-bold px-3 rounded-full whitespace-nowrap bg-primary-100 text-primary-500 py-1`;

// ── Peringatan: PDF/tampilan ini berisi password ASLI (plaintext) member ──
const SecurityWarningBox = tw.div`flex items-start gap-2 bg-red-100 text-red-500 rounded-lg px-4 py-3 mb-4 text-xs leading-relaxed`;

const MemberRowButton = styled.button`
  ${tw`w-full flex items-center justify-between gap-4 px-4 sm:px-5 py-3 sm:py-4 hover:bg-gray-100 transition duration-150 text-left focus:outline-none`}
`;
const PasswordInlineWrap = tw.div`flex items-center gap-1 mt-1`;
const PasswordText = tw.span`font-mono text-xs text-red-500 bg-red-100 px-2 py-1 rounded truncate`;
const RevealHint = tw.span`hidden sm:inline text-xs text-gray-400`;

// ── Modal "Create Absensi" ──
const ModalOverlay = tw.div`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4`;
const ModalBox = tw.div`bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative`;
const ModalCloseButton = styled.button`
  ${tw`absolute text-gray-400 hover:text-gray-700 focus:outline-none`}
  top: 1rem;
  right: 1rem;
`;
const ModalTitle = tw.h3`text-xl font-bold text-gray-900 mb-6`;
const FieldLabel = tw.label`block text-sm font-semibold text-gray-700 mb-1 mt-4`;
const FieldInput = tw.input`w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary-500 text-sm`;
const FieldError = tw.p`text-xs text-red-500 mt-1`;
const ModalActions = tw.div`mt-8 flex gap-3`;
const CancelButton = tw.button`flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 focus:outline-none transition duration-200`;
const SubmitButton = styled.button`
  ${tw`flex-1 py-3 rounded-lg bg-primary-500 text-gray-100 font-semibold hover:bg-primary-700 focus:outline-none transition duration-200`}
  ${(props) => props.disabled && tw`opacity-50 cursor-not-allowed`}
`;

const AccessDeniedWrap = tw.div`min-h-screen flex items-center justify-center`;
const AccessDeniedCard = tw.div`text-center max-w-sm mx-auto p-8`;
const AccessDeniedTitle = tw.h3`text-xl font-bold text-gray-900 mb-2`;
const AccessDeniedText = tw.p`text-sm text-gray-600 mb-6`;

function getSessionStatus(session, now) {
  if (now < session.openAt) return "not-started";
  if (now > session.closeAt) return "closed";
  return "open";
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// datetime-local butuh format "YYYY-MM-DDTHH:mm" berbasis waktu lokal.
function toDatetimeLocalValue(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Bikin & download PDF rekap kehadiran untuk satu sesi absensi. Foto profil
// SENGAJA tidak disertakan di PDF (biar konsisten & cepat tanpa tergantung
// CORS/loading gambar dari luar) — PDF fokus ke data: nama, posisi, status,
// dan jam absen.
function buildAttendancePdf(session, memberRows, attendedCount, notAttendedCount) {
  const doc = new jsPDF();

  doc.setFontSize(15);
  doc.setTextColor(20, 20, 20);
  doc.text(`Rekap Absensi — ${session.title}`, 14, 18);

  doc.setFontSize(10);
  doc.setTextColor(110, 110, 110);
  doc.text(`${formatDate(session.openAt)}  —  ${formatDate(session.closeAt)}`, 14, 25);
  doc.text(
    `Total Member: ${memberRows.length}   |   Sudah Absen: ${attendedCount}   |   Belum Absen: ${notAttendedCount}`,
    14,
    31
  );

  autoTable(doc, {
    startY: 37,
    head: [["No", "Nama", "Posisi", "Status", "Jam Absen"]],
    body: memberRows.map((m, i) => [
      i + 1,
      m.name,
      m.position || "-",
      m.attended ? "Sudah Absen" : "Belum Absen",
      m.attended
        ? new Date(m.attendedAt).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })
        : "-",
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [31, 41, 55], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: { 0: { cellWidth: 12 } },
  });

  const safeTitle = session.title.trim().replace(/[^a-z0-9]+/gi, "_").slice(0, 60) || "absensi";
  doc.save(`Absensi-${safeTitle}.pdf`);
}

// Bikin & download PDF berisi SELURUH data member dari path "users",
// TERMASUK password asli (plaintext) mereka — sesuai permintaan fitur ini.
// PERINGATAN: ini data sensitif. Dokumennya dikasih catatan merah di
// halaman pertama supaya siapapun yang pegang filenya sadar itu bukan file
// biasa. Foto profil sengaja tidak disertakan di PDF (sama seperti PDF
// rekap absensi) — fokusnya ke data teks.
function buildMembersPdf(members) {
  const doc = new jsPDF();

  doc.setFontSize(15);
  doc.setTextColor(20, 20, 20);
  doc.text("Data Member — Sopan Remix", 14, 18);

  doc.setFontSize(9);
  doc.setTextColor(200, 40, 40);
  doc.text(
    "PERINGATAN: dokumen ini berisi password asli (plaintext) akun member. Jangan disebarluaskan.",
    14,
    26,
    { maxWidth: 180 }
  );

  autoTable(doc, {
    startY: 33,
    head: [["No", "Username", "Posisi", "Password", "Followers", "Tgl Gabung"]],
    body: members.map((m, i) => [
      i + 1,
      m.name,
      m.position || "-",
      m.passwordPlain || "-",
      typeof m.followers === "number" ? m.followers : "-",
      m.joinDate ? formatDate(m.joinDate) : "-",
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [31, 41, 55], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: { 0: { cellWidth: 10 } },
  });

  doc.save(`Data-Member-SopanRemix-${Date.now()}.pdf`);
}

// Hook KHUSUS halaman admin ini — ambil semua member dari path "users"
// TERMASUK field "passwordPlain".
//
// SENGAJA TIDAK memakai/mengubah helpers/useRemixMembers.js: hook itu
// dipakai juga oleh halaman-halaman PUBLIK (mis. daftar member, profil
// member) yang harus TIDAK PERNAH menampilkan password. Supaya field
// sensitif ini tidak bisa "kebawa" ke halaman lain secara tidak sengaja
// di masa depan, hook ini isolated di sini saja dan hanya dipakai di
// halaman yang sudah di-guard role === "admin" (lihat guard akses di
// bawah pada komponen utama halaman ini).
function useAllMembersRaw() {
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
          .map((id) => {
            const u = raw[id] || {};
            const roleRaw = u.role ? String(u.role) : "Member";
            return {
              id,
              name: u.username || "Member",
              position: roleRaw.charAt(0).toUpperCase() + roleRaw.slice(1),
              profilePic: u.profilePic || null,
              passwordPlain: u.passwordPlain ?? null,
              followers: typeof u.followers === "number" ? u.followers : null,
              joinDate: u.createdAt || null,
              status: u.status || null,
            };
          })
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


// Avatar member: pakai foto profil dari field "profilePic" kalau ada &
// berhasil dimuat, fallback ke lingkaran inisial nama kalau tidak ada foto
// atau gagal dimuat (link rusak/expired).
function MemberAvatar({ name, profilePic }) {
  const [imgError, setImgError] = useState(false);
  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";

  if (profilePic && !imgError) {
    return <MemberAvatarImg src={profilePic} alt={name} onError={() => setImgError(true)} />;
  }
  return <MemberAvatarFallback>{initial}</MemberAvatarFallback>;
}

// Satu grup accordion = satu sesi absensi. Data kehadiran (records) HANYA
// di-listen dari Firebase kalau sesi ini lagi dibuka ("isOpen"), supaya
// tidak ada banyak listener realtime nyala bersamaan untuk sesi yang
// sedang tidak dilihat admin.
function SessionAccordionItem({
  session,
  isOpen,
  onToggle,
  allMembers,
  membersLoading,
  copiedToken,
  onCopyLink,
  getAbsensiLink,
}) {
  const { records } = useAbsensiRecords(isOpen ? session.id : null);
  const status = getSessionStatus(session, Date.now());

  const memberRows = useMemo(() => {
    return allMembers
      .map((m) => ({
        ...m,
        attended: Boolean(records[m.id]),
        attendedAt: records[m.id]?.timestamp || null,
      }))
      .sort((a, b) => {
        if (a.attended !== b.attended) return a.attended ? -1 : 1;
        return (b.attendedAt || 0) - (a.attendedAt || 0);
      });
  }, [allMembers, records]);

  const attendedCount = memberRows.filter((m) => m.attended).length;
  const notAttendedCount = memberRows.length - attendedCount;

  const handleDownloadPdf = () => {
    if (membersLoading || memberRows.length === 0) return;
    buildAttendancePdf(session, memberRows, attendedCount, notAttendedCount);
  };

  return (
    <AccordionCard>
      <AccordionHeader type="button" onClick={onToggle} aria-expanded={isOpen}>
        <AccordionHeaderLeft>
          <AccordionTitleBlock>
            <AccordionTitle>{session.title}</AccordionTitle>
            <AccordionDateRange>
              {formatDate(session.openAt)} — {formatDate(session.closeAt)}
            </AccordionDateRange>
          </AccordionTitleBlock>
        </AccordionHeaderLeft>
        <AccordionHeaderRight>
          <StatusPill status={status}>
            {status === "open" && "Sedang Berlangsung"}
            {status === "not-started" && "Belum Dimulai"}
            {status === "closed" && "Selesai"}
          </StatusPill>
          <AccordionChevron open={isOpen}>
            <ChevronDownIcon tw="w-5 h-5" />
          </AccordionChevron>
        </AccordionHeaderRight>
      </AccordionHeader>

      <AccordionBodyOuter open={isOpen}>
        <AccordionBodyInner>
          <AccordionBodyContent>
            {session.token ? (
              <ShareLinkBox>
                <ShareLinkIconWrap>
                  <LinkIcon tw="w-4 h-4" />
                </ShareLinkIconWrap>
                <ShareLinkText>{getAbsensiLink(session.token)}</ShareLinkText>
                <ShareCopyButton
                  copied={copiedToken === session.token}
                  onClick={() => onCopyLink(session.token)}
                >
                  {copiedToken === session.token ? (
                    <>
                      <CheckIcon tw="w-4 h-4" />
                      Disalin!
                    </>
                  ) : (
                    <>
                      <CopyIcon tw="w-4 h-4" />
                      Copy Link
                    </>
                  )}
                </ShareCopyButton>
              </ShareLinkBox>
            ) : (
              <NoTokenText>
                Sesi ini dibuat sebelum fitur link diterapkan, jadi belum ada token — buat sesi baru untuk dapat link share.
              </NoTokenText>
            )}

            <ActionsRow>
              <DownloadButton
                type="button"
                onClick={handleDownloadPdf}
                disabled={membersLoading || memberRows.length === 0}
              >
                <DownloadIcon tw="w-4 h-4" />
                Download PDF
              </DownloadButton>
            </ActionsRow>

            <StatsRow>
              <StatBox>
                <StatValue>{membersLoading ? "…" : memberRows.length}</StatValue>
                <StatLabel>Total Member</StatLabel>
              </StatBox>
              <StatBox>
                <StatValue tw="text-green-600">{membersLoading ? "…" : attendedCount}</StatValue>
                <StatLabel>Sudah Absen</StatLabel>
              </StatBox>
              <StatBox>
                <StatValue tw="text-gray-400">{membersLoading ? "…" : notAttendedCount}</StatValue>
                <StatLabel>Belum Absen</StatLabel>
              </StatBox>
            </StatsRow>

            <MemberListHeader>
              <MemberListTitle>Daftar Member</MemberListTitle>
              <MemberCount>{membersLoading ? "" : `${memberRows.length} member`}</MemberCount>
            </MemberListHeader>

            {membersLoading && <EmptyDetailState>Memuat data member...</EmptyDetailState>}
            {!membersLoading && memberRows.length === 0 && (
              <EmptyDetailState>Belum ada data member di path "users".</EmptyDetailState>
            )}

            {!membersLoading && memberRows.length > 0 && (
              <MemberListWrap>
                {memberRows.map((m) => (
                  <MemberRow key={m.id}>
                    <MemberLeft>
                      <MemberAvatar name={m.name} profilePic={m.profilePic} />
                      <MemberInfo>
                        <MemberName>{m.name}</MemberName>
                        <MemberPosition>{m.position}</MemberPosition>
                      </MemberInfo>
                    </MemberLeft>
                    <MemberRight>
                      {m.attended ? (
                        <>
                          <AttendedTime>
                            {new Date(m.attendedAt).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </AttendedTime>
                          <AttendedBadge>Sudah Absen</AttendedBadge>
                        </>
                      ) : (
                        <NotAttendedBadge>Belum Absen</NotAttendedBadge>
                      )}
                    </MemberRight>
                  </MemberRow>
                ))}
              </MemberListWrap>
            )}
          </AccordionBodyContent>
        </AccordionBodyInner>
      </AccordionBodyOuter>
    </AccordionCard>
  );
}

export default () => {
  const [currentMember] = useState(() => getSession());
  const navigate = useNavigate();

  const { sessions } = useAbsensiSessions();
  const { members: allMembers, loading: membersLoading } = useRemixMembers();

  // Sesi yang lagi "dibuka" (accordion expanded). null = semua tertutup.
  const [openSessionId, setOpenSessionId] = useState(null);

  // ── Section "Daftar Seluruh Member" (path "users") ──
  const [memberListOpen, setMemberListOpen] = useState(false);
  const [revealedMemberIds, setRevealedMemberIds] = useState(() => new Set());
  const { members: allMembersRaw, loading: membersRawLoading } = useAllMembersRaw();

  const toggleMemberList = () => setMemberListOpen((prev) => !prev);

  const toggleRevealPassword = (memberId) => {
    setRevealedMemberIds((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) next.delete(memberId);
      else next.add(memberId);
      return next;
    });
  };

  const handleDownloadMembersPdf = () => {
    if (membersRawLoading || allMembersRaw.length === 0) return;
    buildMembersPdf(allMembersRaw);
  };

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formOpenAt, setFormOpenAt] = useState(() => toDatetimeLocalValue(new Date()));
  const [formCloseAt, setFormCloseAt] = useState("");
  const [formError, setFormError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [copiedToken, setCopiedToken] = useState(null);

  const handleLogout = () => {
    clearSession();
    navigate("/remix/login");
  };

  const openCreateModal = () => {
    setFormTitle("");
    setFormOpenAt(toDatetimeLocalValue(new Date()));
    setFormCloseAt("");
    setFormError("");
    setShowCreateModal(true);
  };

  const toggleSession = (sessionId) => {
    setOpenSessionId((prev) => (prev === sessionId ? null : sessionId));
  };

  const handleCreateSession = async () => {
    if (isCreating) return;
    setFormError("");

    if (!formTitle.trim()) {
      setFormError("Judul absensi tidak boleh kosong.");
      return;
    }
    if (!formOpenAt || !formCloseAt) {
      setFormError("Tanggal mulai dan tanggal tutup wajib diisi.");
      return;
    }

    const openAt = new Date(formOpenAt).getTime();
    const closeAt = new Date(formCloseAt).getTime();

    if (closeAt <= openAt) {
      setFormError("Tanggal tutup harus setelah tanggal mulai.");
      return;
    }

    setIsCreating(true);
    try {
      // push() ke absensi/sessions -> Firebase generate path/ID + token baru
      // otomatis. "token" inilah yang jadi bagian dari link share.
      const { id: newSessionId } = await createAbsensiSession({
        title: formTitle.trim(),
        openAt,
        closeAt,
      });
      // Sesi baru langsung dibuka accordion-nya, sisanya otomatis tertutup.
      setOpenSessionId(newSessionId);
      setShowCreateModal(false);
    } catch (err) {
      setFormError("Gagal menyimpan ke database. Coba lagi.");
    } finally {
      setIsCreating(false);
    }
  };

  const getAbsensiLink = (token) => `${window.location.origin}/absensi/${token}`;

  const handleCopyLink = async (token) => {
    const link = getAbsensiLink(token);
    try {
      await navigator.clipboard.writeText(link);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken((prev) => (prev === token ? null : prev)), 2000);
    } catch (err) {
      // Fallback kalau clipboard API diblokir browser: seleksi manual via prompt.
      window.prompt("Copy link absensi ini secara manual:", link);
    }
  };

  const navLinks = [
    <NavLinks key={1}>
      <HeaderNavLink href="/remix">Home</HeaderNavLink>
      <HeaderNavLink href="/absensi">Absensi</HeaderNavLink>
      {currentMember && (
        <LogoutNavButton type="button" onClick={handleLogout}>
          <LogOutIcon tw="w-4 h-4 mr-2" />
          Logout
        </LogoutNavButton>
      )}
    </NavLinks>,
  ];

  // ── Guard akses: hanya role "admin" yang boleh masuk ──
  if (!currentMember || currentMember.role !== "admin") {
    return (
      <AnimationRevealPage>
        <Container>
          <StyledHeader links={navLinks} />
        </Container>
        <AccessDeniedWrap>
          <AccessDeniedCard>
            <AccessDeniedTitle>Akses Ditolak</AccessDeniedTitle>
            <AccessDeniedText>
              Halaman ini cuma buat admin. {currentMember ? "Akun kamu belum punya akses admin." : "Login dulu pakai akun admin."}
            </AccessDeniedText>
            <PrimaryButtonBase as={Link} to="/remix/login">
              {currentMember ? "Kembali ke Home" : "Login"}
            </PrimaryButtonBase>
          </AccessDeniedCard>
        </AccessDeniedWrap>
      </AnimationRevealPage>
    );
  }

  return (
    <>
    <AnimationRevealPage>
      <Container>
        <StyledHeader links={navLinks} />

        <ContentWithPaddingXl>
          <HeadingRow>
            <div>
              <Subheading>Sopan Team</Subheading>
              <PageHeading>Dashboard Absensi</PageHeading>
            </div>
            <CreateButton onClick={openCreateModal}>
              <PlusIcon tw="w-5 h-5" />
              Create Absensi
            </CreateButton>
          </HeadingRow>

          {sessions.length === 0 ? (
            <EmptySessionText>
              Belum ada sesi absensi. Klik "Create Absensi" untuk membuat yang pertama.
            </EmptySessionText>
          ) : (
            <SessionAccordionList>
              {sessions.map((session) => (
                <SessionAccordionItem
                  key={session.id}
                  session={session}
                  isOpen={openSessionId === session.id}
                  onToggle={() => toggleSession(session.id)}
                  allMembers={allMembers}
                  membersLoading={membersLoading}
                  copiedToken={copiedToken}
                  onCopyLink={handleCopyLink}
                  getAbsensiLink={getAbsensiLink}
                />
              ))}
            </SessionAccordionList>
          )}

          {/* ── SECTION BARU: Daftar Seluruh Member (path "users") ──
              Terpisah dari accordion sesi absensi di atas. Satu grup besar:
              diklik -> tampil semua member (foto profil + username). Klik
              salah satu baris member -> reveal password akun itu (toggle,
              bisa buka beberapa sekaligus). Ada tombol download PDF data
              member (termasuk password) di dalamnya. ── */}
          <SectionSpacerTop>
            <SectionSpacerTitle>Daftar Seluruh Member</SectionSpacerTitle>
            <SectionSpacerSubtitle>Data ditarik langsung dari path Firebase "users".</SectionSpacerSubtitle>
          </SectionSpacerTop>

          <AccordionCard>
            <AccordionHeader type="button" onClick={toggleMemberList} aria-expanded={memberListOpen}>
              <AccordionHeaderLeft>
                <AccordionTitleBlock>
                  <AccordionTitle>
                    <span tw="inline-flex items-center gap-2">
                      <UsersIcon tw="w-4 h-4" />
                      Semua Member
                    </span>
                  </AccordionTitle>
                  <AccordionDateRange>Klik untuk lihat seluruh member & password akun mereka</AccordionDateRange>
                </AccordionTitleBlock>
              </AccordionHeaderLeft>
              <AccordionHeaderRight>
                <MemberCountPill>
                  {membersRawLoading ? "…" : `${allMembersRaw.length} Member`}
                </MemberCountPill>
                <AccordionChevron open={memberListOpen}>
                  <ChevronDownIcon tw="w-5 h-5" />
                </AccordionChevron>
              </AccordionHeaderRight>
            </AccordionHeader>

            <AccordionBodyOuter open={memberListOpen}>
              <AccordionBodyInner>
                <AccordionBodyContent>
                  <SecurityWarningBox>
                    <AlertTriangleIcon tw="w-4 h-4 flex-shrink-0 mt-1" />
                    <span>
                      Password di bawah ini adalah password ASLI (plaintext) akun member. Klik nama
                      member untuk menampilkan/menyembunyikan password-nya. Jangan screenshot atau
                      sebarkan data ini ke luar tim admin.
                    </span>
                  </SecurityWarningBox>

                  <ActionsRow>
                    <DownloadButton
                      type="button"
                      onClick={handleDownloadMembersPdf}
                      disabled={membersRawLoading || allMembersRaw.length === 0}
                    >
                      <DownloadIcon tw="w-4 h-4" />
                      Download PDF Data Member
                    </DownloadButton>
                  </ActionsRow>

                  {membersRawLoading && <EmptyDetailState>Memuat data member...</EmptyDetailState>}
                  {!membersRawLoading && allMembersRaw.length === 0 && (
                    <EmptyDetailState>Belum ada data member di path "users".</EmptyDetailState>
                  )}

                  {!membersRawLoading && allMembersRaw.length > 0 && (
                    <MemberListWrap>
                      {allMembersRaw.map((m) => {
                        const revealed = revealedMemberIds.has(m.id);
                        return (
                          <MemberRowButton
                            key={m.id}
                            type="button"
                            onClick={() => toggleRevealPassword(m.id)}
                            aria-expanded={revealed}
                          >
                            <MemberLeft>
                              <MemberAvatar name={m.name} profilePic={m.profilePic} />
                              <MemberInfo>
                                <MemberName>{m.name}</MemberName>
                                {revealed ? (
                                  <PasswordInlineWrap>
                                    <LockIcon tw="w-3 h-3 flex-shrink-0 text-red-500" />
                                    <PasswordText>{m.passwordPlain || "(belum ada password)"}</PasswordText>
                                  </PasswordInlineWrap>
                                ) : (
                                  <MemberPosition>{m.position}</MemberPosition>
                                )}
                              </MemberInfo>
                            </MemberLeft>
                            <MemberRight>
                              <RevealHint>{revealed ? "Sembunyikan" : "Lihat password"}</RevealHint>
                              {revealed ? (
                                <EyeIcon tw="w-4 h-4 text-gray-400" />
                              ) : (
                                <EyeOffIcon tw="w-4 h-4 text-gray-300" />
                              )}
                            </MemberRight>
                          </MemberRowButton>
                        );
                      })}
                    </MemberListWrap>
                  )}
                </AccordionBodyContent>
              </AccordionBodyInner>
            </AccordionBodyOuter>
          </AccordionCard>
        </ContentWithPaddingXl>
      </Container>
    </AnimationRevealPage>

      {/* ── MODAL: Create Absensi ──
          Sengaja dirender DI LUAR <AnimationRevealPage>, bukan sebagai
          child-nya. AnimationRevealPage membungkus tiap child langsung
          dengan motion.section yang diberi CSS "transform" untuk animasi
          slide-in. Kalau ModalOverlay (position: fixed) ada di dalam
          ancestor yang punya "transform", browser akan menjadikan ancestor
          itu sebagai containing block baru untuk elemen fixed (spesifikasi
          CSS), sehingga modal tidak lagi menempel ke viewport dan malah
          "terlempar" mengikuti offset animasi slide-in -> modal jadi
          ke-render tapi keluar dari layar / tidak pernah terlihat, padahal
          state showCreateModal sudah true. Ini penyebab tombol "Create
          Absensi" terlihat "tidak ada respon". ── */}
      {showCreateModal && (
        <ModalOverlay>
          <ModalBox>
            <ModalCloseButton onClick={() => setShowCreateModal(false)}>
              <XIcon tw="w-5 h-5" />
            </ModalCloseButton>
            <ModalTitle>Create Absensi</ModalTitle>

            <FieldLabel>Judul Absensi</FieldLabel>
            <FieldInput
              type="text"
              placeholder="Contoh: Absensi Sopan Team — Sesi Juli"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />

            <FieldLabel>Tanggal & Jam Mulai</FieldLabel>
            <FieldInput
              type="datetime-local"
              value={formOpenAt}
              onChange={(e) => setFormOpenAt(e.target.value)}
            />

            <FieldLabel>Tanggal & Jam Tutup</FieldLabel>
            <FieldInput
              type="datetime-local"
              value={formCloseAt}
              onChange={(e) => setFormCloseAt(e.target.value)}
            />

            {formError && <FieldError>{formError}</FieldError>}

            <ModalActions>
              <CancelButton onClick={() => setShowCreateModal(false)}>Batal</CancelButton>
              <SubmitButton onClick={handleCreateSession} disabled={isCreating}>
                {isCreating ? "Menyimpan..." : "Simpan"}
              </SubmitButton>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}
    </>
  );
};
