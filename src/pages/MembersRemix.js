import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import tw from "twin.macro";
import styled from "styled-components"; //eslint-disable-line
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { useRemixMembers } from "helpers/useRemixMembers.js";
import { getSession, clearSession } from "helpers/session.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings";
import { SectionDescription } from "components/misc/Typography";
import HeaderBase, {
  LogoLink as LogoLinkBase,
  NavLinks,
  NavLink,
  PrimaryLink,
} from "components/headers/light.js";
import logoImageSrc from "images/logo-sopan.png";
import { ReactComponent as TiktokIcon } from "images/tiktok-icon.svg";
import { ReactComponent as YoutubeIcon } from "images/youtube-icon.svg";
import { ReactComponent as UserIcon } from "feather-icons/dist/icons/user.svg";
import { ReactComponent as UsersIcon } from "feather-icons/dist/icons/users.svg";
import { ReactComponent as CalendarIcon } from "feather-icons/dist/icons/calendar.svg";
import { ReactComponent as LogOutIcon } from "feather-icons/dist/icons/log-out.svg";
import BoringAvatar from "boring-avatars";

// ─────────────────────────────────────────────────────────────────────────────
// MEMBER ROSTER: SOPAN REMIX (/remix/members)
// Data member sekarang diambil LIVE dari Firebase Realtime Database (path
// "users") lewat hook useRemixMembers, bukan hardcode lagi.
// Field sensitif (email, passwordPlain) sengaja TIDAK ditarik ke tampilan ini.
// ─────────────────────────────────────────────────────────────────────────────

// ── Palet warna avatar fallback (Boring Avatars, variant "beam") — disamain
// sama palet ungu Sopan Remix biar avatar generate-annya tetap senada sama
// tema, bukan warna acak default library.
const BORING_AVATAR_COLORS = ["#3c0d99", "#5a13e6", "#742cff", "#935bff", "#a273ff"];

const HeadingContainer = tw.div`text-center mb-10`;
const Heading = tw(SectionHeading)``;
const Subheading = tw(SubheadingBase)`text-center mb-3`;
const Description = tw(SectionDescription)`mx-auto text-center`;

// ── Header info (Pendiri/Pengelola/Berdiri) — versi "pop", bukan teks polos ──
const InfoBlock = styled.div`
  ${tw`max-w-screen-lg mx-auto px-6 py-8 sm:px-12 sm:py-10 rounded-3xl mb-4 shadow-xl relative overflow-hidden`}
  background: linear-gradient(135deg, #8344ff 0%, #3c0d99 100%);
`;
const InfoGlow = styled.div`
  ${tw`absolute w-64 h-64 rounded-full bg-white opacity-10 pointer-events-none`}
  top: -5rem;
  right: -5rem;
`;
const InfoStatsRow = tw.div`relative flex flex-wrap items-center justify-center gap-3 sm:gap-6`;
const InfoPill = styled.div`
  ${tw`flex items-center gap-2 rounded-full px-4 py-3 sm:px-6`}
  background: rgba(255, 255, 255, 0.12);
`;
const InfoPillIconWrap = tw.span`w-8 h-8 rounded-full bg-primary-100 bg-opacity-25 flex items-center justify-center flex-shrink-0`;
const InfoPillText = tw.span`flex flex-col leading-tight text-left`;
const InfoPillLabel = tw.span`text-xs font-bold text-primary-100 uppercase tracking-wide`;
const InfoPillValue = tw.span`text-sm sm:text-base text-gray-100 font-semibold`;

const StatusMessage = tw.p`text-center text-gray-600 mt-16`;

const StyledHeader = tw(HeaderBase)`max-w-none py-4`;
const LogoLink = tw(LogoLinkBase)`text-gray-900`;

// ── Navbar login-aware — sama logic-nya kayak HostingCloudLandingPage.js:
// kalau user sudah login, Login & Join Sekarang di-hide, muncul foto profil
// (avatar bulat, fallback inisial), nama, dan tombol Logout. Header di
// halaman ini pakai light.js (background terang), jadi nama member dikasih
// warna ungu (primary) biar kebaca jelas, bukan putih kayak di Hero.
const ProfileAvatarLink = tw(Link)`flex items-center lg:ml-12! border-b-0`;
const AvatarCircle = tw.div`w-10 h-10 rounded-full overflow-hidden bg-primary-500 flex items-center justify-center flex-shrink-0`;
const AvatarImg = tw.img`w-full h-full object-cover`;
const MemberNameNavSpan = tw.span`
  flex items-center text-lg my-2 lg:text-sm lg:mx-6 lg:my-0 font-semibold tracking-wide text-primary-500
`;
const LogoutNavButton = styled.button`
  ${tw`flex items-center text-sm lg:mx-6 my-2 lg:my-0 font-semibold tracking-wide transition duration-300 px-4 py-2 rounded-full bg-red-100 text-red-400 hover:bg-red-200 hover:text-red-500 focus:outline-none`}
`;

// ── Grid daftar member: 3 kolom rapi di mobile, membesar di layar lebih lebar ──
const MembersGrid = tw.div`grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-8 md:gap-10 max-w-screen-lg mx-auto`;
const MemberCard = styled(Link)`
  ${tw`flex flex-col items-center no-underline transition duration-300 hover:-translate-y-1`}
  text-decoration: none;
`;
const MemberAvatarFrame = styled.div`
  ${tw`w-full overflow-hidden shadow-md h-24 sm:h-32 md:h-40 lg:h-48`}

  /* ── Squircle border (menggantikan rounded-xl/2xl biasa) ── */
  --r: 50%; /* antara 0% [kotak] dan 50% [squircle penuh] */
  --_r: clamp(0%, var(--r) / 2, 25%);
  --_v: calc(var(--_r) * (1 - sqrt(2) / 4));
  --_p: calc(var(--_v) - var(--_r) / 2);
  clip-path: shape(
    from var(--_v) var(--_p),
    curve to 50% 0 with var(--_r) 0,
    curve to calc(100% - var(--_v)) var(--_p) with calc(100% - var(--_r)) 0,
    curve to calc(100% - var(--_p)) var(--_v) with calc(100% - 2*var(--_p)) calc(2*var(--_p)),
    curve to 100% 50% with 100% var(--_r),
    curve to calc(100% - var(--_p)) calc(100% - var(--_v)) with 100% calc(100% - var(--_r)),
    curve to calc(100% - var(--_v)) calc(100% - var(--_p)) with calc(100% - 2*var(--_p)) calc(100% - 2*var(--_p)),
    curve to 50% 100% with calc(100% - var(--_r)) 100%,
    curve to var(--_v) calc(100% - var(--_p)) with var(--_r) 100%,
    curve to var(--_p) calc(100% - var(--_v)) with calc(2*var(--_p)) calc(100% - 2*var(--_p)),
    curve to 0 50% with 0 calc(100% - var(--_r)),
    curve to var(--_p) var(--_v) with 0 var(--_r),
    curve to var(--_v) var(--_p) with calc(2*var(--_p)) calc(2*var(--_p))
  );
`;
const MemberPosition = tw.span`mt-3 uppercase font-bold tracking-widest text-primary-500 text-xs text-center px-1`;
const MemberName = tw.span`mt-1 text-xs sm:text-lg font-medium text-gray-900 hover:text-primary-500 transition duration-300 text-center px-1`;
const MemberSocials = tw.div`mt-2 sm:mt-4 flex`;

// Avatar member: pakai foto dari database, fallback ke Boring Avatars
// (https://boringavatars.com — avatar unik auto-generate dari nama) kalau
// profilePic kosong/error.
const MemberAvatar = ({ src, name }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <MemberAvatarFrame>
        <BoringAvatar
          name={name || "Sopan Remix"}
          variant="beam"
          colors={BORING_AVATAR_COLORS}
          size="100%"
          square
        />
      </MemberAvatarFrame>
    );
  }
  return (
    <MemberAvatarFrame>
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        tw="w-full h-full object-cover"
      />
    </MemberAvatarFrame>
  );
};

export default () => {
  const { members, loading, error } = useRemixMembers();

  // Member yang lagi login, diambil dari localStorage (diisi pas login lewat
  // LoginRemix.js). null kalau belum login sama sekali.
  const [currentMember, setCurrentMember] = useState(() => getSession());
  const [avatarError, setAvatarError] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    setCurrentMember(null);
    navigate("/remix");
  };

  const logoLink = (
    <LogoLink href="/remix">
      <img src={logoImageSrc} alt="Logo" />
      Sopan Remix
    </LogoLink>
  );

  // Home & Member selalu tampil. Login & Join Sekarang di-hide kalau sudah
  // login, digantikan Avatar + Nama + Logout.
  const navLinks = [
    <NavLinks key={1}>
      <NavLink href="/remix">Home</NavLink>
      <NavLink href="/remix/members">Member</NavLink>

      {!currentMember && <NavLink href="/remix/login">Login</NavLink>}
      {!currentMember && <PrimaryLink href="/remix/join">Join Sekarang</PrimaryLink>}

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
              <BoringAvatar
                name={currentMember.username || "Sopan Remix"}
                variant="beam"
                colors={BORING_AVATAR_COLORS}
                size="100%"
              />
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
    </NavLinks>
  ];

  return (
    <AnimationRevealPage>
      <Container>
        <StyledHeader logoLink={logoLink} links={navLinks} />
        <ContentWithPaddingXl>

          {/* Info pendiri & admin divisi — versi "pop": pill stats + gradient */}
          <InfoBlock>
            <InfoGlow />
            <InfoStatsRow>
              <InfoPill>
                <InfoPillIconWrap>
                  <UserIcon tw="w-4 h-4 text-gray-100" />
                </InfoPillIconWrap>
                <InfoPillText>
                  <InfoPillLabel>Pendiri</InfoPillLabel>
                  <InfoPillValue>Admin Sopan Remix</InfoPillValue> {/* PLACEHOLDER - ganti dengan data asli */}
                </InfoPillText>
              </InfoPill>

              <InfoPill>
                <InfoPillIconWrap>
                  <UsersIcon tw="w-4 h-4 text-gray-100" />
                </InfoPillIconWrap>
                <InfoPillText>
                  <InfoPillLabel>Pengelola</InfoPillLabel>
                  <InfoPillValue>Tim Admin Sopan Remix</InfoPillValue> {/* PLACEHOLDER - ganti dengan data asli */}
                </InfoPillText>
              </InfoPill>

              <InfoPill>
                <InfoPillIconWrap>
                  <CalendarIcon tw="w-4 h-4 text-gray-100" />
                </InfoPillIconWrap>
                <InfoPillText>
                  <InfoPillLabel>Berdiri</InfoPillLabel>
                  <InfoPillValue>2022</InfoPillValue> {/* PLACEHOLDER - ganti dengan data asli */}
                </InfoPillText>
              </InfoPill>
            </InfoStatsRow>
          </InfoBlock>

          <HeadingContainer>
            <Subheading>Sopan Remix</Subheading>
            <Heading>Member Roster</Heading>
            <Description>
              Kenalan dengan para kreator audio di balik Sopan Remix.
              Klik nama atau foto member untuk melihat profil lengkap.
            </Description>
          </HeadingContainer>

          {loading && <StatusMessage>Memuat data member...</StatusMessage>}
          {!loading && error && (
            <StatusMessage>Gagal memuat data member. Coba muat ulang halaman.</StatusMessage>
          )}
          {!loading && !error && members.length === 0 && (
            <StatusMessage>Belum ada member yang terdaftar.</StatusMessage>
          )}

          {!loading && !error && members.length > 0 && (
            <MembersGrid>
              {members.map((member) => (
                <MemberCard key={member.id} to={`/remix/members/${member.id}`}>
                  <MemberAvatar src={member.profilePic} name={member.name} />
                  <MemberPosition>{member.position}</MemberPosition>
                  <MemberName>{member.name}</MemberName>
                  <MemberSocials>
                    {member.tiktok && (
                      <a
                        tw="mr-4 sm:mr-8 last:mr-0 text-gray-400 hocus:text-primary-500 transition duration-300"
                        href={member.tiktok}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                      >
                        <TiktokIcon tw="fill-current w-4 h-4 sm:w-6 sm:h-6" />
                      </a>
                    )}
                    {member.youtube && (
                      <a
                        tw="mr-4 sm:mr-8 last:mr-0 text-gray-400 hocus:text-primary-500 transition duration-300"
                        href={member.youtube}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                      >
                        <YoutubeIcon tw="fill-current w-4 h-4 sm:w-6 sm:h-6" />
                      </a>
                    )}
                  </MemberSocials>
                </MemberCard>
              ))}
            </MembersGrid>
          )}

        </ContentWithPaddingXl>
      </Container>
    </AnimationRevealPage>
  );
};
