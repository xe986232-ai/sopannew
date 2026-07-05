import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container as ContainerBase } from "components/misc/Layouts.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import { ReactComponent as SaveIcon } from "feather-icons/dist/icons/save.svg";
import { ReactComponent as LoadingIcon } from "feather-icons/dist/icons/loader.svg";
import { ReactComponent as CheckIcon } from "feather-icons/dist/icons/check-circle.svg";
import { ReactComponent as AlertIcon } from "feather-icons/dist/icons/alert-circle.svg";
import { getSession, saveSession } from "helpers/session.js";
import { useRemixMember } from "helpers/useRemixMembers.js";
import { db } from "firebase.js";
import { ref, get, update } from "firebase/database";

// ─────────────────────────────────────────────────────────────────────────────
// EDIT PROFIL: SOPAN REMIX (/remix/profile)
//
// Halaman baru — belum ada padanannya di src/pages/ sebelumnya. Dibuka dari
// dropdown "Edit Profil" di navbar (demos/HostingCloudLandingPage.js).
//
// Member yang lagi login bisa ganti:
//   - Username (dicek dulu belum dipakai member lain — case-insensitive,
//     sama persis logic pengecekan di helpers/useAuth.js)
//   - Foto Profil (berupa URL gambar — sama seperti field profilePic yang
//     sudah ada di skema data "users", tidak ada infra upload file di
//     project ini jadi konsisten pakai URL)
//   - Link TikTok & YouTube (field yang sudah ada di skema data juga,
//     ditampilkan di halaman profil publik /remix/members/:id)
//
// Setelah simpan: data di Firebase (path users/{id}) di-update, DAN session
// lokal (localStorage, dipakai buat isi navbar) ikut di-update lewat
// saveSession() — supaya nama/foto baru langsung kepakai begitu balik ke
// halaman lain, tanpa perlu logout-login ulang.
//
// Basis visual: form card ala LoginRemix.js/SignupRemix.js (Container bg
// primary-900, card putih di tengah, Input & SubmitButton style identik),
// supaya konsisten sama halaman auth Sopan Remix lainnya.
// ─────────────────────────────────────────────────────────────────────────────

const Container = tw(ContainerBase)`min-h-screen bg-primary-900 text-white font-medium flex justify-center -m-8 px-4`;
const Content = tw.div`max-w-screen-sm w-full my-16 bg-white text-gray-900 shadow rounded-lg p-6 sm:p-10`;

const Heading = tw.h1`text-2xl font-extrabold text-center`;
const SubHeading = tw.p`text-sm text-gray-500 text-center mt-2`;

const AvatarPreviewWrap = tw.div`flex flex-col items-center mt-8`;
const AvatarPreview = tw.div`w-24 h-24 rounded-full overflow-hidden bg-primary-500 flex items-center justify-center flex-shrink-0`;
const AvatarPreviewImg = tw.img`w-full h-full object-cover`;
const AvatarPreviewInitial = tw.span`text-gray-100 text-3xl font-black select-none`;

const Form = tw.form`mx-auto max-w-sm mt-8`;
const FieldLabel = tw.label`block text-sm font-semibold text-gray-700 mb-1 mt-5 first:mt-0`;
const Input = tw.input`w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-primary-400 focus:bg-white`;
const FieldHint = tw.p`text-xs text-gray-400 mt-1`;
const FieldErrorText = tw.p`text-xs text-red-500 mt-1`;

const SubmitButton = styled.button`
  ${tw`mt-8 tracking-wide font-semibold bg-primary-500 text-gray-100 w-full py-4 rounded-lg hover:bg-primary-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  ${(props) => props.disabled && tw`opacity-50 cursor-not-allowed`}
  .icon {
    ${tw`w-5 h-5 mr-2`}
  }
`;
const Spinner = styled(LoadingIcon)`
  ${tw`w-5 h-5 mr-2 animate-spin`}
`;

const BackLink = tw(Link)`block text-center text-sm text-gray-500 mt-6 hover:text-primary-500 transition duration-150`;

const StatusContainer = tw.div`text-center py-20 text-gray-600`;

const GuardCard = tw.div`text-center max-w-sm mx-auto p-8`;
const GuardTitle = tw.h3`text-xl font-bold text-gray-900 mb-2`;
const GuardText = tw.p`text-sm text-gray-600 mb-6`;
const GuardButton = tw(PrimaryButtonBase)`text-sm`;

// ── Custom Alert (basis: LoginRemix.js/SignupRemix.js, style identik) ──
const AlertOverlay = styled.div`
  ${tw`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4`}
`;
const AlertBox = styled.div`
  ${tw`bg-white rounded-lg shadow-lg p-8 max-w-sm w-full mx-4 text-center transform transition-all duration-300`}
`;
const AlertIconWrapper = styled.div`
  ${tw`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center`}
  ${(props) => (props.type === "success" ? tw`bg-green-100` : tw`bg-red-100`)}
  .icon {
    ${tw`w-8 h-8`}
    ${(props) => (props.type === "success" ? tw`text-green-500` : tw`text-red-500`)}
  }
`;
const AlertTitle = tw.h3`text-lg font-bold text-gray-900 mb-2`;
const AlertMessage = tw.p`text-sm text-gray-600 mb-6`;
const AlertButton = tw.button`bg-primary-500 text-white font-semibold py-2 px-8 rounded-lg hover:bg-primary-900 transition-all duration-300 focus:outline-none`;

export default () => {
  const navigate = useNavigate();
  const [currentMember] = useState(() => getSession());

  const { member, loading: memberLoading } = useRemixMember(currentMember ? currentMember.id : null);

  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");
  const [avatarError, setAvatarError] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [alertInfo, setAlertInfo] = useState({ show: false, type: "success", title: "", message: "" });

  // Begitu data member (dari Firebase) sudah kepanggil, isi form dengan
  // data terbaru — supaya nggak mulai dari kosong.
  useEffect(() => {
    if (!member) return;
    setUsername(member.name || "");
    setProfilePic(member.profilePic || "");
    setTiktok(member.tiktok || "");
    setYoutube(member.youtube || "");
  }, [member]);

  // ── Guard: harus login dulu ──
  if (!currentMember) {
    return (
      <AnimationRevealPage>
        <StatusContainer>
          <GuardCard>
            <GuardTitle>Belum Login</GuardTitle>
            <GuardText>Login dulu buat bisa edit profil kamu.</GuardText>
            <GuardButton as={Link} to="/remix/login">
              Login
            </GuardButton>
          </GuardCard>
        </StatusContainer>
      </AnimationRevealPage>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setFormError("Username tidak boleh kosong.");
      return;
    }
    if (trimmedUsername.length < 3) {
      setFormError("Username minimal 3 karakter.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Cek username belum dipakai member lain (case-insensitive), sama
      // persis logic pengecekan di helpers/useAuth.js — kecuali punya
      // sendiri (biar simpan ulang tanpa ganti username tidak ke-block).
      const snapshot = await get(ref(db, "users"));
      if (snapshot.exists()) {
        const raw = snapshot.val();
        const taken = Object.entries(raw).some(
          ([id, u]) =>
            id !== currentMember.id &&
            (u.username || "").trim().toLowerCase() === trimmedUsername.toLowerCase()
        );
        if (taken) {
          setFormError("Username sudah dipakai member lain. Coba nama lain.");
          setIsSubmitting(false);
          return;
        }
      }

      const trimmedProfilePic = profilePic.trim();
      const trimmedTiktok = tiktok.trim();
      const trimmedYoutube = youtube.trim();

      await update(ref(db, `users/${currentMember.id}`), {
        username: trimmedUsername,
        profilePic: trimmedProfilePic || null,
        tiktok: trimmedTiktok || null,
        youtube: trimmedYoutube || null,
      });

      // Update session lokal juga, biar navbar & halaman lain langsung
      // kepakai nama/foto baru tanpa perlu logout-login ulang.
      saveSession({ ...currentMember, username: trimmedUsername, profilePic: trimmedProfilePic || null });

      setAlertInfo({
        show: true,
        type: "success",
        title: "Profil Tersimpan!",
        message: "Perubahan profil kamu berhasil disimpan.",
      });
    } catch (err) {
      setAlertInfo({
        show: true,
        type: "error",
        title: "Gagal Menyimpan",
        message: "Gagal terhubung ke server. Coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeAlert = () => {
    const wasSuccess = alertInfo.type === "success";
    setAlertInfo((prev) => ({ ...prev, show: false }));
    if (wasSuccess) {
      navigate(`/remix/members/${currentMember.id}`);
    }
  };

  const initial = (username || currentMember.username || "?").trim().charAt(0).toUpperCase();

  return (
    <AnimationRevealPage>
      <Container>
        <Content>
          <Heading>Edit Profil</Heading>
          <SubHeading>Perbarui username & foto profil Sopan Remix kamu.</SubHeading>

          <AvatarPreviewWrap>
            <AvatarPreview>
              {profilePic.trim() && !avatarError ? (
                <AvatarPreviewImg
                  src={profilePic.trim()}
                  alt={username}
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <AvatarPreviewInitial>{initial}</AvatarPreviewInitial>
              )}
            </AvatarPreview>
          </AvatarPreviewWrap>

          {memberLoading ? (
            <StatusContainer>Memuat data profil...</StatusContainer>
          ) : (
            <Form onSubmit={handleSubmit}>
              <FieldLabel>Username</FieldLabel>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
                required
              />

              <FieldLabel>URL Foto Profil</FieldLabel>
              <Input
                type="url"
                placeholder="https://... (link gambar)"
                value={profilePic}
                onChange={(e) => {
                  setProfilePic(e.target.value);
                  setAvatarError(false);
                }}
                disabled={isSubmitting}
              />
              <FieldHint>Tempel link gambar dari hosting foto (Imgur, Google Drive, dll). Kosongkan kalau mau pakai avatar inisial.</FieldHint>

              <FieldLabel>Link TikTok</FieldLabel>
              <Input
                type="url"
                placeholder="https://tiktok.com/@username"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                disabled={isSubmitting}
              />

              <FieldLabel>Link YouTube</FieldLabel>
              <Input
                type="url"
                placeholder="https://youtube.com/@username"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                disabled={isSubmitting}
              />

              {formError && <FieldErrorText>{formError}</FieldErrorText>}

              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <SaveIcon className="icon" />
                    Simpan Perubahan
                  </>
                )}
              </SubmitButton>

              <BackLink to="/remix">← Kembali ke Sopan Remix</BackLink>
            </Form>
          )}
        </Content>
      </Container>

      {alertInfo.show && ReactDOM.createPortal(
        <AlertOverlay>
          <AlertBox>
            <AlertIconWrapper type={alertInfo.type}>
              {alertInfo.type === "success" ? (
                <CheckIcon className="icon" />
              ) : (
                <AlertIcon className="icon" />
              )}
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
