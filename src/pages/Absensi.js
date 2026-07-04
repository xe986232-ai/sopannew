import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { Link, useNavigate, useParams } from "react-router-dom";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container, ContentWithPaddingXl, Content2Xl, ContentWithVerticalPadding } from "components/misc/Layouts.js";
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings.js";
import { SectionDescription } from "components/misc/Typography.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import HeaderBase, { NavLinks, NavLink as HeaderNavLink, PrimaryLink } from "components/headers/light.js";
import { ReactComponent as CheckCircleIcon } from "images/checkbox-circle.svg";
import { ReactComponent as AlertIcon } from "feather-icons/dist/icons/alert-circle.svg";
import { ReactComponent as LogOutIcon } from "feather-icons/dist/icons/log-out.svg";
import { ReactComponent as LockIcon } from "feather-icons/dist/icons/lock.svg";
import { getSession, clearSession } from "helpers/session.js";
import { useAbsensiSessions, useAbsensiRecords, findSessionByToken, markAttendance } from "helpers/useAbsensi.js";

// ─────────────────────────────────────────────────────────────────────────────
// HALAMAN ABSENSI — SOPAN TEAM (/absensi/:token)
// Style dasar mengikuti demos/HostingCloudLandingPage.js: hero primary
// background + section konten di bawahnya dengan Container/ContentWithPaddingXl.
//
// SUDAH TERHUBUNG KE FIREBASE REALTIME DATABASE (bukan lagi state lokal):
//   absensi/sessions/{sessionId}           -> { title, openAt, closeAt, createdAt, token }
//   absensi/records/{sessionId}/{memberId} -> { name, timestamp }
//
// AKSES DIBATASI LEWAT TOKEN DI URL: halaman ini TIDAK bisa dibuka langsung
// via "/absensi" biasa. Wajib lewat link "/absensi/{token}" yang di-generate
// otomatis pas admin klik "Create Absensi" di pages/AbsensiAdmin.js (link itu
// yang di-share admin ke member). Kalau token kosong/tidak cocok sama sesi
// manapun, halaman ini nolak akses (bukan nampilin sesi manapun by default).
//
// Sesi absensi (tanggal mulai/tutup) dibuat oleh admin lewat halaman
// pages/AbsensiAdmin.js — halaman ini HANYA membaca sesi yang token-nya cocok
// dengan URL, tidak ada lagi tanggal hardcode ataupun auto-pick sesi "aktif".
//
// TIDAK ADA input nama manual. Nama diambil otomatis dari akun member yang
// lagi login (helpers/session.js, diisi oleh proses login di LoginRemix.js).
// Kalau belum login, halaman ini nampilin ajakan buat login dulu, bukan
// tombol absen.
// ─────────────────────────────────────────────────────────────────────────────

const PrimaryBackgroundContainer = tw.div`-mx-8 px-8 bg-primary-900 text-gray-100`;
const HeaderWrapper = tw.div`max-w-none -mt-8 py-8 -mx-8 px-8`;

const Row = tw.div`flex items-center flex-col`;
const TextColumn = tw.div`text-center max-w-3xl`;
const Heading = tw(SectionHeading)`leading-tight`;
const Description = tw(SectionDescription)`mt-4 max-w-2xl text-gray-100 lg:text-base mx-auto`;

const StatusText = tw.p`mt-6 text-base sm:text-lg font-medium text-gray-200`;

const AbsensiCard = tw.div`mt-10 w-full max-w-md bg-white text-gray-900 rounded-lg shadow-raised p-8 mx-auto text-center`;
const WelcomeText = tw.p`text-sm text-gray-500 mb-1`;
const MemberNameText = tw.p`text-2xl font-black text-gray-900 mb-6`;

const LoginPromptText = tw.p`text-sm text-gray-600 mb-6`;
const LoginButton = tw(PrimaryButtonBase)`w-full py-5 text-base`;

const AbsensiButton = styled.button`
  ${tw`w-full flex items-center justify-center tracking-wide font-black text-lg bg-primary-500 text-gray-100 py-5 rounded-lg hover:bg-primary-700 transition-all duration-300 focus:outline-none focus:shadow-outline`}
  ${(props) => props.disabled && tw`opacity-50 cursor-not-allowed hover:bg-primary-500`}
`;
const Spinner = styled.span`
  ${tw`inline-block w-5 h-5 mr-3 rounded-full border-2 border-gray-100 border-t-transparent animate-spin`}
`;

const HeadingContainer = tw.div`text-center mb-10`;
const Subheading = tw(SubheadingBase)`text-center mb-3`;

const AttendeeList = tw.div`max-w-2xl mx-auto`;
const AttendeeRow = tw.div`flex items-center justify-between bg-gray-100 rounded-lg px-6 py-4 mb-3`;
const AttendeeAvatar = tw.div`w-10 h-10 rounded-full bg-primary-500 text-gray-100 flex items-center justify-center font-bold mr-4 flex-shrink-0`;
const AttendeeName = tw.span`font-medium text-gray-900`;
const AttendeeTime = tw.span`text-sm text-gray-500`;
const EmptyState = tw.p`text-center text-gray-500 mt-8`;
const CountBadge = tw.span`ml-3 inline-block bg-primary-500 text-gray-100 text-xs font-bold px-3 py-1 rounded-full align-middle`;

// ── Custom Alert (dipakai buat "Absensi Ditutup", "Sudah Absen", "Berhasil") ──
const AlertOverlay = styled.div`
  ${tw`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4`}
`;
const AlertBox = tw.div`bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center`;
const AlertIconWrapper = styled.div`
  ${tw`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center`}
  ${(props) => (props.type === "success" ? tw`bg-green-100` : tw`bg-red-100`)}
  svg { ${tw`w-8 h-8`} ${(props) => (props.type === "success" ? tw`text-green-500` : tw`text-red-500`)} }
`;
const AlertTitle = tw.h3`text-lg font-bold text-gray-900 mb-2`;
const AlertMessage = tw.p`text-sm text-gray-600 mb-6`;
const AlertButton = tw.button`bg-primary-500 text-white font-semibold py-2 px-8 rounded-lg hover:bg-primary-700 transition-all duration-300 focus:outline-none`;

// ── Elemen navbar tambahan buat state "sudah login" (avatar + nama + logout) ──
const ProfileAvatarLink = tw(Link)`flex items-center lg:ml-12! border-b-0`;
const AvatarCircle = tw.div`w-10 h-10 rounded-full overflow-hidden bg-primary-500 flex items-center justify-center flex-shrink-0`;
const AvatarImg = tw.img`w-full h-full object-cover`;
const AvatarInitial = tw.span`text-gray-100 text-sm font-bold select-none`;
const MemberNameNavSpan = tw.span`
  flex items-center text-lg my-2 lg:text-sm lg:mx-6 lg:my-0 font-semibold tracking-wide text-primary-500
`;
const LogoutNavButton = styled.button`
  ${tw`flex items-center text-sm lg:mx-6 my-2 lg:my-0 font-semibold tracking-wide transition duration-300 px-4 py-2 rounded-full bg-red-100 text-red-400 hover:bg-red-200 hover:text-red-500 focus:outline-none`}
`;

// ── Tampilan kalau link diakses tanpa token / token tidak valid ──
const DeniedWrap = tw.div`min-h-screen flex items-center justify-center px-4`;
const DeniedCard = tw.div`text-center max-w-sm mx-auto`;
const DeniedIconWrapper = tw.div`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center`;
const DeniedTitle = tw.h3`text-xl font-bold text-gray-900 mb-2`;
const DeniedText = tw.p`text-sm text-gray-600`;

// Menentukan status window absensi berdasarkan waktu "now" vs sesi yang ditemukan dari token.
function getAbsensiStatus(session, now) {
  if (!session) return "no-session";
  if (now < session.openAt) return "not-started";
  if (now > session.closeAt) return "closed";
  return "open";
}

function formatWindow(timestamp) {
  return new Date(timestamp).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// Format teks lengkap: "Senin, 2 Desember 2026 pukul 19.00"
function formatFullDate(timestamp) {
  const date = new Date(timestamp);
  const tanggal = date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const jam = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${tanggal} pukul ${jam}`;
}

export default () => {
  // Token WAJIB ada di URL ("/absensi/:token") — inilah satu-satunya cara
  // halaman ini boleh diakses. Tanpa token yang cocok, akses ditolak.
  const { token } = useParams();

  // Semua sesi absensi yang pernah dibuat admin (realtime dari Firebase).
  const { sessions, loading: sessionsLoading } = useAbsensiSessions();
  const [alertInfo, setAlertInfo] = useState({ show: false, type: "success", title: "", message: "" });
  const [now, setNow] = useState(Date.now());

  // Member yang lagi login, diambil dari localStorage (diisi pas login lewat
  // LoginRemix.js). null kalau belum login sama sekali.
  const [currentMember, setCurrentMember] = useState(() => getSession());
  const [avatarError, setAvatarError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  // Sesi yang cocok dengan token di URL. null kalau token kosong/tidak valid
  // — dan HANYA dalam kasus itu (bukan auto-pick sesi manapun).
  const currentSession = useMemo(() => findSessionByToken(sessions, token), [sessions, token]);

  // Rekap kehadiran REALTIME untuk sesi tersebut, langsung dari Firebase.
  const { records: attendeeRecords } = useAbsensiRecords(currentSession?.id);
  const attendees = useMemo(
    () =>
      Object.keys(attendeeRecords).map((memberId) => ({
        id: memberId,
        name: attendeeRecords[memberId].name,
        timestamp: attendeeRecords[memberId].timestamp,
      })),
    [attendeeRecords]
  );

  const status = useMemo(() => getAbsensiStatus(currentSession, now), [currentSession, now]);

  const alreadyAbsen = currentMember
    ? Boolean(attendeeRecords[currentMember.id])
    : false;

  const closeAlert = () => setAlertInfo((prev) => ({ ...prev, show: false }));

  // Logout: hapus session, langsung refresh state biar tombol Login/Join
  // Sekarang muncul lagi tanpa perlu reload manual.
  const handleLogout = () => {
    clearSession();
    setCurrentMember(null);
    navigate("/remix");
  };

  // Navbar khusus halaman ini: Home & Member selalu tampil. Login & Join
  // Sekarang di-hide kalau sudah login, digantikan Profile + Nama + Logout.
  const navLinks = [
    <NavLinks key={1}>
      <HeaderNavLink href="/remix">Home</HeaderNavLink>
      <HeaderNavLink href="/remix/members">Member</HeaderNavLink>

      {!currentMember && (
        <HeaderNavLink as={Link} to="/remix/login" tw="lg:ml-12!">
          Login
        </HeaderNavLink>
      )}
      {!currentMember && (
        <PrimaryLink as={Link} to="/remix/join">
          Join Sekarang
        </PrimaryLink>
      )}

      {currentMember && (
        <ProfileAvatarLink to={`/remix/members/${currentMember.id}`} title={currentMember.username}>
          <AvatarCircle>
            {currentMember.profilePic && !avatarError ? (
              <AvatarImg
                src={currentMember.profilePic}
                alt={currentMember.username}
                onError={() => setAvatarError(true)}
              />
            ) : (
              <AvatarInitial>{currentMember.username.trim().charAt(0).toUpperCase()}</AvatarInitial>
            )}
          </AvatarCircle>
        </ProfileAvatarLink>
      )}
      {currentMember && <MemberNameNavSpan>{currentMember.username}</MemberNameNavSpan>}
      {currentMember && (
        <LogoutNavButton type="button" onClick={handleLogout}>
          <LogOutIcon tw="w-4 h-4 mr-2" />
          Logout
        </LogoutNavButton>
      )}
    </NavLinks>,
  ];

  const handleAbsen = async () => {
    if (isSubmitting) return; // cegah klik dobel selagi loading
    setIsSubmitting(true);

    try {
      // 0) Harus login dulu
      if (!currentMember) {
        setAlertInfo({
          show: true,
          type: "error",
          title: "Belum Login",
          message: "Login dulu pakai akun member kamu sebelum melakukan absensi.",
        });
        return;
      }

      // 1) Harus ada sesi yang dibuat admin
      if (!currentSession) {
        setAlertInfo({
          show: true,
          type: "error",
          title: "Belum Ada Sesi Absensi",
          message: "Admin belum membuat sesi absensi. Coba lagi nanti ya.",
        });
        return;
      }

      // 2) Cek jendela waktu absensi
      if (status === "not-started") {
        setAlertInfo({
          show: true,
          type: "error",
          title: "Absensi Belum Dibuka",
          message: `Absensi "${currentSession.title}" baru dibuka mulai ${formatWindow(currentSession.openAt)}. Coba lagi nanti ya.`,
        });
        return;
      }
      if (status === "closed") {
        setAlertInfo({
          show: true,
          type: "error",
          title: "Absensi Telah Ditutup",
          message: "Waktu absensi untuk sesi ini sudah berakhir. Hubungi admin kalau ada kendala.",
        });
        return;
      }

      // 3) Cek duplikat (sudah absen sebelumnya di sesi ini) — dicek juga
      // secara struktural di Firebase karena key record = memberId.
      if (alreadyAbsen) {
        setAlertInfo({
          show: true,
          type: "error",
          title: "Sudah Tercatat",
          message: `Kamu (${currentMember.username}) sudah melakukan absensi sebelumnya di sesi ini.`,
        });
        return;
      }

      // 4) Simpan absensi ke Firebase — path:
      // absensi/records/{sessionId}/{memberId}
      await markAttendance(currentSession.id, currentMember.id, currentMember.username);

      setAlertInfo({
        show: true,
        type: "success",
        title: "Absensi Berhasil!",
        message: `Terima kasih, ${currentMember.username}. Kehadiran kamu sudah tercatat.`,
      });
    } catch (err) {
      setAlertInfo({
        show: true,
        type: "error",
        title: "Gagal Menyimpan",
        message: "Terjadi kesalahan saat menyimpan absensi. Coba lagi ya.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Guard akses: WAJIB via link token yang valid ──
  // Tunggu sessions selesai di-load dulu sebelum memutuskan "ditolak", biar
  // gak sempat kelip nampilin akses ditolak pas Firebase masih fetch data.
  if (!sessionsLoading && !currentSession) {
    return (
      <AnimationRevealPage>
        <DeniedWrap>
          <DeniedCard>
            <DeniedIconWrapper>
              <LockIcon tw="w-8 h-8 text-gray-500" />
            </DeniedIconWrapper>
            <DeniedTitle>Link Tidak Valid</DeniedTitle>
            <DeniedText>
              Halaman absensi cuma bisa diakses lewat link resmi yang di-share admin.
              Minta link absensi terbaru ke admin Sopan Team ya.
            </DeniedText>
          </DeniedCard>
        </DeniedWrap>
      </AnimationRevealPage>
    );
  }

  return (
    <AnimationRevealPage>
      {/* ── HERO ── */}
      <PrimaryBackgroundContainer>
        <Content2Xl>
          <HeaderWrapper>
            <HeaderBase links={navLinks} />
          </HeaderWrapper>
          <Container>
            <ContentWithVerticalPadding>
              <Row>
                <TextColumn>
                  <Heading>{currentSession ? currentSession.title : "Absensi Sopan Team"}</Heading>
                  <Description>
                    Tinggal tekan tombol ABSENSI di bawah, nama kamu langsung
                    tercatat otomatis dari akun member kamu.
                  </Description>

                  {sessionsLoading && <StatusText>Memuat data sesi absensi...</StatusText>}
                  {!sessionsLoading && status === "no-session" && (
                    <StatusText>Admin belum membuat sesi absensi.</StatusText>
                  )}
                  {status === "not-started" && (
                    <StatusText>Absensi dibuka pada {formatFullDate(currentSession.openAt)}</StatusText>
                  )}
                  {status === "open" && (
                    <StatusText>Absensi tutup pada {formatFullDate(currentSession.closeAt)}</StatusText>
                  )}
                  {status === "closed" && (
                    <StatusText>Absensi sudah ditutup sejak {formatFullDate(currentSession.closeAt)}</StatusText>
                  )}
                </TextColumn>
              </Row>

              <AbsensiCard>
                {currentMember ? (
                  <>
                    <WelcomeText>Login sebagai</WelcomeText>
                    <MemberNameText>{currentMember.username}</MemberNameText>
                    <AbsensiButton
                      onClick={handleAbsen}
                      disabled={alreadyAbsen || status === "closed" || status === "no-session" || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner />
                          MEMPROSES...
                        </>
                      ) : alreadyAbsen ? (
                        "SUDAH ABSEN"
                      ) : (
                        "ABSENSI"
                      )}
                    </AbsensiButton>
                  </>
                ) : (
                  <>
                    <LoginPromptText>
                      Kamu harus login pakai akun member dulu sebelum bisa absen.
                    </LoginPromptText>
                    <LoginButton as={Link} to="/remix/login">
                      Login Dulu
                    </LoginButton>
                  </>
                )}
              </AbsensiCard>
            </ContentWithVerticalPadding>
          </Container>
        </Content2Xl>
      </PrimaryBackgroundContainer>

      {/* ── DAFTAR HADIR ── */}
      <Container>
        <ContentWithPaddingXl>
          <HeadingContainer>
            <Subheading>Sopan Team</Subheading>
            <SectionHeading>
              Daftar Hadir
              <CountBadge>{attendees.length}</CountBadge>
            </SectionHeading>
          </HeadingContainer>

          <AttendeeList>
            {attendees.length === 0 && (
              <EmptyState>Belum ada member yang absen di sesi ini.</EmptyState>
            )}
            {[...attendees]
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((a) => (
                <AttendeeRow key={a.id}>
                  <div tw="flex items-center">
                    <AttendeeAvatar>{a.name.trim().charAt(0).toUpperCase()}</AttendeeAvatar>
                    <AttendeeName>{a.name}</AttendeeName>
                  </div>
                  <AttendeeTime>
                    {new Date(a.timestamp).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </AttendeeTime>
                </AttendeeRow>
              ))}
          </AttendeeList>
        </ContentWithPaddingXl>
      </Container>

      {/* ── CUSTOM ALERT ── */}
      {alertInfo.show &&
        ReactDOM.createPortal(
          <AlertOverlay>
            <AlertBox>
              <AlertIconWrapper type={alertInfo.type}>
                {alertInfo.type === "success" ? <CheckCircleIcon /> : <AlertIcon />}
              </AlertIconWrapper>
              <AlertTitle>{alertInfo.title}</AlertTitle>
              <AlertMessage>{alertInfo.message}</AlertMessage>
              <AlertButton onClick={closeAlert}>Oke, Mengerti</AlertButton>
            </AlertBox>
          </AlertOverlay>,
          document.body
        )}
    </AnimationRevealPage>
  );
};
