import React, { useState } from "react";
import { Link } from "react-router-dom";
import tw from "twin.macro";
import styled from "styled-components"; //eslint-disable-line
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { useRemixMembers } from "helpers/useRemixMembers.js";
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

// ─────────────────────────────────────────────────────────────────────────────
// MEMBER ROSTER: SOPAN REMIX (/remix/members)
// Data member sekarang diambil LIVE dari Firebase Realtime Database (path
// "users") lewat hook useRemixMembers, bukan hardcode lagi.
// Field sensitif (email, passwordPlain) sengaja TIDAK ditarik ke tampilan ini.
// ─────────────────────────────────────────────────────────────────────────────

const HeadingContainer = tw.div`text-center mb-10`;
const Heading = tw(SectionHeading)``;
const Subheading = tw(SubheadingBase)`text-center mb-3`;
const Description = tw(SectionDescription)`mx-auto text-center`;

const InfoBlock = tw.div`max-w-screen-lg mx-auto px-8 py-8 bg-primary-900 text-gray-100 rounded-lg mb-4`;
const InfoText = tw.p`text-sm leading-loose text-center`;
const InfoLabel = tw.span`font-bold text-primary-300`;

const StatusMessage = tw.p`text-center text-gray-600 mt-16`;

const StyledHeader = tw(HeaderBase)`max-w-none py-4`;
const LogoLink = tw(LogoLinkBase)`text-gray-900`;

// Avatar member: pakai foto dari database, fallback ke avatar inisial
// (lingkaran primary color + huruf depan nama) kalau profilePic kosong/error.
const MemberAvatar = ({ src, name }) => {
  const [failed, setFailed] = useState(false);
  const initial = (name || "?").trim().charAt(0).toUpperCase();

  if (!src || failed) {
    return (
      <div tw="w-64 h-64 rounded-lg bg-primary-500 text-gray-100 flex items-center justify-center text-6xl font-black select-none">
        {initial}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      tw="w-64 h-64 object-cover rounded-lg"
    />
  );
};

export default () => {
  const { members, loading, error } = useRemixMembers();

  const logoLink = (
    <LogoLink href="/remix">
      <img src={logoImageSrc} alt="Logo" />
      Sopan Remix
    </LogoLink>
  );
  const navLinks = [
    <NavLinks key={1}>
      <NavLink href="/remix">Home</NavLink>
      <NavLink href="/remix/members">Member</NavLink>
      <NavLink href="/remix/login">Login</NavLink>
      <PrimaryLink href="/remix/join">Join Sekarang</PrimaryLink>
    </NavLinks>
  ];

  return (
    <AnimationRevealPage>
      <Container>
        <StyledHeader logoLink={logoLink} links={navLinks} />
        <ContentWithPaddingXl>

          {/* Info pendiri & admin divisi */}
          <InfoBlock>
            <InfoText>
              <InfoLabel>Pendiri: </InfoLabel>Admin Sopan Remix {/* PLACEHOLDER - ganti dengan data asli */}
              {"  ·  "}
              <InfoLabel>Pengelola: </InfoLabel>Tim Admin Sopan Remix {/* PLACEHOLDER - ganti dengan data asli */}
              {"  ·  "}
              <InfoLabel>Berdiri: </InfoLabel>2022 {/* PLACEHOLDER - ganti dengan data asli */}
            </InfoText>
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
            <div tw="flex flex-wrap flex-row justify-center sm:max-w-2xl lg:max-w-4xl mx-auto">
              {members.map((member) => (
                <Link
                  key={member.id}
                  to={`/remix/members/${member.id}`}
                  tw="mt-16 w-full sm:w-1/2 flex flex-col items-center no-underline"
                  style={{ textDecoration: "none" }}
                >
                  <MemberAvatar src={member.profilePic} name={member.name} />
                  <div tw="flex flex-col items-center mt-6">
                    <span tw="uppercase font-bold tracking-widest text-xs text-primary-500">
                      {member.position}
                    </span>
                    <span tw="mt-1 text-xl font-medium text-gray-900 hover:text-primary-500 transition duration-300">
                      {member.name}
                    </span>
                    <div tw="mt-6 flex">
                      {member.tiktok && (
                        <a
                          tw="mr-8 last:mr-0 text-gray-400 hocus:text-primary-500 transition duration-300"
                          href={member.tiktok}
                          target="_blank"
                          rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                        >
                          <TiktokIcon tw="fill-current w-6 h-6" />
                        </a>
                      )}
                      {member.youtube && (
                        <a
                          tw="mr-8 last:mr-0 text-gray-400 hocus:text-primary-500 transition duration-300"
                          href={member.youtube}
                          target="_blank"
                          rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                        >
                          <YoutubeIcon tw="fill-current w-6 h-6" />
                        </a>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </ContentWithPaddingXl>
      </Container>
    </AnimationRevealPage>
  );
};
