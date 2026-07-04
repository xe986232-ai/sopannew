import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container, ContentWithPaddingXl, Content2Xl, ContentWithVerticalPadding } from "components/misc/Layouts.js";
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings.js";
import { SectionDescription } from "components/misc/Typography.js";
import HeaderBase from "components/headers/light.js";
import { ReactComponent as CheckCircleIcon } from "images/checkbox-circle.svg";
import { ReactComponent as AlertIcon } from "feather-icons/dist/icons/alert-circle.svg";

// ─────────────────────────────────────────────────────────────────────────────
// HALAMAN ABSENSI — SOPAN TEAM (/absensi)
// Style dasar mengikuti demos/HostingCloudLandingPage.js: hero primary
// background + section konten di bawahnya dengan Container/ContentWithPaddingXl.
//
// CATATAN PENTING (baca sebelum integrasi Firebase):
// Halaman ini SEMENTARA murni UI + state lokal (belum nyambung Firebase),
// sesuai arahan: "build halamannya dulu, integrasi Firebase belakangan".
// Semua bagian yang nanti perlu diganti ke Firebase Realtime Database sudah
// ditandai dengan komentar "TODO-FIREBASE" di bawah, supaya gampang dicari.
//
// Rencana struktur data waktu integrasi nanti:
//   absensi/session -> { sessionId, title, openAt, closeAt }
//   absensi/records/{sessionId}/{pushId} -> { name, timestamp }
// Admin membuka/menutup sesi cukup dengan ubah "openAt" / "closeAt" langsung
// di Firebase Console (sesuai kesepakatan, tanpa halaman admin terpisah dulu).
//
// TIDAK ADA input nama manual lagi di halaman ini. Sesuai arahan terbaru:
// nama diambil otomatis dari akun member yang sudah login/terdaftar — tinggal
// tekan tombol ABSENSI, nama langsung tercatat. Karena sistem login member
// belum jalan, dipakai CURRENT_MEMBER (mock) di bawah sebagai placeholder;
// ganti dengan nama member dari session/auth yang sedang login begitu itu
// sudah siap (lihat komentar TODO-FIREBASE / TODO-AUTH).
// ─────────────────────────────────────────────────────────────────────────────

// TODO-FIREBASE: ganti 2 konstanta ini dengan nilai dari absensi/session
// (openAt / closeAt) yang dibaca real-time pakai onValue().
const SESSION_TITLE = "Absensi Sopan Team — Sesi Pembersihan Member";
const SESSION_OPEN_AT = "2026-07-01T00:00:00";
const SESSION_CLOSE_AT = "2026-12-31T23:59:59";

// TODO-AUTH: ganti dengan nama member yang sedang login (dari session/auth),
// begitu sistem login member sudah jalan. Untuk sekarang dipakai data contoh.
const CURRENT_MEMBER = { id: "mock-1", name: "Jj" };

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

const AbsensiButton = styled.button`
  ${tw`w-full tracking-wide font-black text-lg bg-primary-500 text-gray-100 py-5 rounded-lg hover:bg-primary-700 transition-all duration-300 focus:outline-none focus:shadow-outline`}
  ${(props) => props.disabled && tw`opacity-50 cursor-not-allowed hover:bg-primary-500`}
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

// Menentukan status window absensi berdasarkan waktu "now" vs open/close.
// TODO-FIREBASE: fungsi ini nanti menerima objek "session" dari Firebase,
// bukan konstanta hardcode di atas.
function getAbsensiStatus(now) {
  const openAt = new Date(SESSION_OPEN_AT).getTime();
  const closeAt = new Date(SESSION_CLOSE_AT).getTime();
  if (now < openAt) return "not-started";
  if (now > closeAt) return "closed";
  return "open";
}

function formatWindow(iso) {
  return new Date(iso).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// Format teks lengkap: "Senin, 2 Desember 2026 pukul 19.00"
function formatFullDate(iso) {
  const date = new Date(iso);
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
  // TODO-FIREBASE: ganti useState([]) ini dengan hook realtime yang baca
  // absensi/records/{sessionId} pakai onValue(), supaya daftar hadir update
  // otomatis di semua device yang buka halaman ini bersamaan.
  const [attendees, setAttendees] = useState([]);
  const [alertInfo, setAlertInfo] = useState({ show: false, type: "success", title: "", message: "" });
  const [now, setNow] = useState(Date.now());

  // Cek ulang status buka/tutup absensi secara berkala (gak perlu tiap detik
  // lagi karena tampilannya sekarang teks biasa, bukan angka berjalan).
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  const status = useMemo(() => getAbsensiStatus(now), [now]);

  const alreadyAbsen = attendees.some((a) => a.id === CURRENT_MEMBER.id);

  const closeAlert = () => setAlertInfo((prev) => ({ ...prev, show: false }));

  const handleAbsen = () => {
    // 1) Cek jendela waktu absensi
    if (status === "not-started") {
      setAlertInfo({
        show: true,
        type: "error",
        title: "Absensi Belum Dibuka",
        message: `Absensi baru dibuka mulai ${formatWindow(SESSION_OPEN_AT)}. Coba lagi nanti ya.`,
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

    // 2) Cek duplikat (sudah absen sebelumnya di sesi ini)
    if (alreadyAbsen) {
      setAlertInfo({
        show: true,
        type: "error",
        title: "Sudah Tercatat",
        message: `Kamu (${CURRENT_MEMBER.name}) sudah melakukan absensi sebelumnya di sesi ini.`,
      });
      return;
    }

    // 3) Simpan absensi — nama diambil otomatis dari akun yang sedang login
    // TODO-FIREBASE: ganti setAttendees(...) ini dengan push() ke
    // absensi/records/{sessionId} di Firebase Realtime Database, berisi
    // { id: CURRENT_MEMBER.id, name: CURRENT_MEMBER.name, timestamp }.
    setAttendees((prev) => [
      ...prev,
      { id: CURRENT_MEMBER.id, name: CURRENT_MEMBER.name, timestamp: Date.now() },
    ]);
    setAlertInfo({
      show: true,
      type: "success",
      title: "Absensi Berhasil!",
      message: `Terima kasih, ${CURRENT_MEMBER.name}. Kehadiran kamu sudah tercatat.`,
    });
  };

  return (
    <AnimationRevealPage>
      {/* ── HERO ── */}
      <PrimaryBackgroundContainer>
        <Content2Xl>
          <HeaderWrapper>
            <HeaderBase />
          </HeaderWrapper>
          <Container>
            <ContentWithVerticalPadding>
              <Row>
                <TextColumn>
                  <Heading>{SESSION_TITLE}</Heading>
                  <Description>
                    Tinggal tekan tombol ABSENSI di bawah, nama kamu langsung
                    tercatat otomatis dari akun member kamu.
                  </Description>

                  {status === "not-started" && (
                    <StatusText>Absensi dibuka pada {formatFullDate(SESSION_OPEN_AT)}</StatusText>
                  )}
                  {status === "open" && (
                    <StatusText>Absensi tutup pada {formatFullDate(SESSION_CLOSE_AT)}</StatusText>
                  )}
                  {status === "closed" && (
                    <StatusText>Absensi sudah ditutup sejak {formatFullDate(SESSION_CLOSE_AT)}</StatusText>
                  )}
                </TextColumn>
              </Row>

              <AbsensiCard>
                <WelcomeText>Login sebagai</WelcomeText>
                <MemberNameText>{CURRENT_MEMBER.name}</MemberNameText>
                <AbsensiButton onClick={handleAbsen} disabled={alreadyAbsen || status === "closed"}>
                  {alreadyAbsen ? "SUDAH ABSEN" : "ABSENSI"}
                </AbsensiButton>
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
              .map((a, idx) => (
                <AttendeeRow key={`${a.id}-${a.timestamp}-${idx}`}>
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
