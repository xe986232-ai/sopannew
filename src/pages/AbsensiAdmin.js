import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import HeaderBase, { NavLinks, NavLink as HeaderNavLink } from "components/headers/light.js";
import { ReactComponent as PlusIcon } from "feather-icons/dist/icons/plus.svg";
import { ReactComponent as XIcon } from "feather-icons/dist/icons/x.svg";
import { ReactComponent as LogOutIcon } from "feather-icons/dist/icons/log-out.svg";
import { ReactComponent as CopyIcon } from "feather-icons/dist/icons/copy.svg";
import { ReactComponent as CheckIcon } from "feather-icons/dist/icons/check.svg";
import { ReactComponent as LinkIcon } from "feather-icons/dist/icons/link.svg";
import { getSession, clearSession } from "helpers/session.js";
import { useRemixMembers } from "helpers/useRemixMembers.js";
import { useAbsensiSessions, useAbsensiRecords, createAbsensiSession } from "helpers/useAbsensi.js";

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
//   3) Admin bisa pilih salah satu sesi yang sudah dibuat, lalu lihat member
//      mana yang SUDAH absen dan mana yang BELUM, dengan data member diambil
//      dari path "users" (= member Sopan Remix, lewat helpers/useRemixMembers.js).
//   4) Semua data realtime (onValue) — begitu member absen di halaman
//      pages/Absensi.js, daftar di sini otomatis update tanpa refresh.
//
// AKSES: halaman ini hanya untuk user dengan role "admin" pada path
// users/{id}/role di Firebase. Kalau belum ada admin, ubah manual dulu field
// "role" salah satu user di Firebase Console jadi "admin", baru login pakai
// akun itu untuk bisa masuk ke halaman ini.
// ─────────────────────────────────────────────────────────────────────────────

const StyledHeader = tw(HeaderBase)`max-w-none py-4`;

const HeadingRow = tw.div`flex flex-wrap items-center justify-between gap-4 mb-10`;
const PageHeading = tw(SectionHeading)`text-left text-3xl!`;
const Subheading = tw(SubheadingBase)`mb-2`;

const CreateButton = styled(PrimaryButtonBase)`
  ${tw`flex items-center gap-2`}
`;

const LogoutNavButton = styled.button`
  ${tw`flex items-center text-sm lg:mx-6 my-2 lg:my-0 font-semibold tracking-wide transition duration-300 px-4 py-2 rounded-full bg-red-100 text-red-400 hover:bg-red-200 hover:text-red-500 focus:outline-none`}
`;

// ── Layout dua kolom: daftar sesi (kiri) + detail rekap (kanan) ──
const DashboardGrid = tw.div`grid grid-cols-1 lg:grid-cols-3 gap-8`;
const SessionListColumn = tw.div`lg:col-span-1`;
const DetailColumn = tw.div`lg:col-span-2`;

const SessionListCard = tw.div`bg-gray-100 rounded-lg p-4`;
const SessionListTitle = tw.h5`text-sm font-bold uppercase tracking-wide text-gray-500 mb-4 px-2`;
const SessionItem = styled.button`
  ${tw`w-full text-left px-4 py-3 rounded-lg mb-2 transition duration-200 focus:outline-none`}
  ${(props) => (props.active ? tw`bg-primary-500 text-gray-100` : tw`bg-white text-gray-900 hover:bg-gray-200`)}
`;
const SessionItemTitle = tw.p`font-bold text-sm`;
const SessionItemDate = styled.p`
  ${tw`text-xs mt-1`}
  ${(props) => (props.active ? tw`text-gray-200` : tw`text-gray-500`)}
`;
const SessionStatusPill = styled.span`
  ${tw`inline-block mt-2 text-xs font-bold px-2 rounded-full`}
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
  ${(props) => {
    if (props.status === "open") return tw`bg-green-100 text-green-600`;
    if (props.status === "not-started") return tw`bg-yellow-100 text-yellow-700`;
    return tw`bg-gray-300 text-gray-600`;
  }}
`;
const EmptySessionText = tw.p`text-sm text-gray-500 px-2 py-6 text-center`;

const DetailCard = tw.div`bg-gray-100 rounded-lg p-6`;
const DetailHeaderRow = tw.div`flex flex-wrap items-start justify-between gap-4 mb-6`;
const DetailTitle = tw.h4`text-xl font-bold text-gray-900`;
const DetailDateRange = tw.p`text-sm text-gray-500 mt-1`;

const StatsRow = tw.div`grid grid-cols-3 gap-4 mb-8`;
const StatBox = tw.div`bg-white rounded-lg p-4 text-center shadow`;
const StatValue = tw.p`text-2xl font-black text-gray-900`;
const StatLabel = tw.p`text-xs text-gray-500 mt-1 uppercase tracking-wide`;

const MemberListTitle = tw.h5`text-sm font-bold uppercase tracking-wide text-gray-500 mb-3`;
const MemberRow = tw.div`flex items-center justify-between bg-white rounded-lg px-5 py-3 mb-2 shadow-sm`;
const MemberAvatar = tw.div`w-8 h-8 rounded-full bg-primary-500 text-gray-100 flex items-center justify-center font-bold mr-4 flex-shrink-0 text-sm`;
const MemberName = tw.span`font-medium text-gray-900`;
const AttendedBadge = tw.span`text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full`;
const NotAttendedBadge = tw.span`text-xs font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full`;
const AttendedTime = tw.span`text-xs text-gray-400 ml-3`;

const EmptyDetailState = tw.div`bg-gray-100 rounded-lg p-12 text-center text-gray-500`;

// ── Kotak "Link Absensi" (buat di-share admin ke member) ──
const ShareLinkBox = tw.div`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white rounded-lg p-3 mb-6 shadow-sm`;
const ShareLinkIconWrap = tw.div`hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500 text-gray-100 flex-shrink-0`;
const ShareLinkText = tw.p`flex-1 text-sm text-gray-700 truncate font-mono px-1`;
const ShareCopyButton = styled.button`
  ${tw`flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition duration-200 focus:outline-none flex-shrink-0`}
  ${(props) => (props.copied ? tw`bg-green-100 text-green-600` : tw`bg-primary-500 text-gray-100 hover:bg-primary-700`)}
`;
const NoTokenText = tw.p`text-xs text-gray-400 italic mb-6`;

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

export default () => {
  const [currentMember] = useState(() => getSession());
  const navigate = useNavigate();

  const { sessions } = useAbsensiSessions();
  const { members: allMembers, loading: membersLoading } = useRemixMembers();

  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formOpenAt, setFormOpenAt] = useState(() => toDatetimeLocalValue(new Date()));
  const [formCloseAt, setFormCloseAt] = useState("");
  const [formError, setFormError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [copiedToken, setCopiedToken] = useState(null);

  const now = Date.now();

  // Sesi yang lagi dipilih untuk dilihat detailnya. Default: sesi paling
  // baru dibuat (sessions sudah di-sort terbaru-dulu di helpers/useAbsensi.js).
  const activeSessionId = selectedSessionId || (sessions[0] && sessions[0].id) || null;
  const selectedSession = sessions.find((s) => s.id === activeSessionId) || null;

  const { records } = useAbsensiRecords(activeSessionId);

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
      setSelectedSessionId(newSessionId);
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

          <DashboardGrid>
            {/* ── KOLOM KIRI: daftar sesi ── */}
            <SessionListColumn>
              <SessionListCard>
                <SessionListTitle>Sesi Absensi</SessionListTitle>
                {sessions.length === 0 && (
                  <EmptySessionText>
                    Belum ada sesi absensi. Klik "Create Absensi" untuk membuat yang pertama.
                  </EmptySessionText>
                )}
                {sessions.map((session) => {
                  const status = getSessionStatus(session, now);
                  const isActive = session.id === activeSessionId;
                  return (
                    <SessionItem
                      key={session.id}
                      active={isActive}
                      onClick={() => setSelectedSessionId(session.id)}
                    >
                      <SessionItemTitle>{session.title}</SessionItemTitle>
                      <SessionItemDate active={isActive}>
                        {formatDate(session.openAt)} — {formatDate(session.closeAt)}
                      </SessionItemDate>
                      <SessionStatusPill status={status}>
                        {status === "open" && "Sedang Berlangsung"}
                        {status === "not-started" && "Belum Dimulai"}
                        {status === "closed" && "Selesai"}
                      </SessionStatusPill>
                    </SessionItem>
                  );
                })}
              </SessionListCard>
            </SessionListColumn>

            {/* ── KOLOM KANAN: detail rekap kehadiran ── */}
            <DetailColumn>
              {!selectedSession ? (
                <EmptyDetailState>
                  Pilih atau buat sesi absensi untuk melihat rekap kehadiran member.
                </EmptyDetailState>
              ) : (
                <DetailCard>
                  <DetailHeaderRow>
                    <div>
                      <DetailTitle>{selectedSession.title}</DetailTitle>
                      <DetailDateRange>
                        {formatDate(selectedSession.openAt)} — {formatDate(selectedSession.closeAt)}
                      </DetailDateRange>
                    </div>
                  </DetailHeaderRow>

                  {selectedSession.token ? (
                    <ShareLinkBox>
                      <ShareLinkIconWrap>
                        <LinkIcon tw="w-4 h-4" />
                      </ShareLinkIconWrap>
                      <ShareLinkText>{getAbsensiLink(selectedSession.token)}</ShareLinkText>
                      <ShareCopyButton
                        copied={copiedToken === selectedSession.token}
                        onClick={() => handleCopyLink(selectedSession.token)}
                      >
                        {copiedToken === selectedSession.token ? (
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

                  <MemberListTitle>Daftar Member (dari path "users")</MemberListTitle>
                  {membersLoading && <EmptyDetailState>Memuat data member...</EmptyDetailState>}
                  {!membersLoading && memberRows.length === 0 && (
                    <EmptyDetailState>Belum ada data member di path "users".</EmptyDetailState>
                  )}
                  {!membersLoading &&
                    memberRows.map((m) => (
                      <MemberRow key={m.id}>
                        <div tw="flex items-center">
                          <MemberAvatar>{m.name.trim().charAt(0).toUpperCase()}</MemberAvatar>
                          <MemberName>{m.name}</MemberName>
                        </div>
                        <div tw="flex items-center">
                          {m.attended ? (
                            <>
                              <AttendedBadge>Sudah Absen</AttendedBadge>
                              <AttendedTime>
                                {new Date(m.attendedAt).toLocaleTimeString("id-ID", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </AttendedTime>
                            </>
                          ) : (
                            <NotAttendedBadge>Belum Absen</NotAttendedBadge>
                          )}
                        </div>
                      </MemberRow>
                    ))}
                </DetailCard>
              )}
            </DetailColumn>
          </DashboardGrid>
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
