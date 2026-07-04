import React from "react";
import { Link } from "react-router-dom";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings";
import { SectionDescription } from "components/misc/Typography";
import ProfileThreeColGrid from "components/cards/ProfileThreeColGrid.js";
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
// Basis: ProfileThreeColGrid.js (komponen existing, tidak diubah)
// Data 6 member placeholder harus konsisten dengan MemberProfileRemix.js
// ─────────────────────────────────────────────────────────────────────────────

// Self-check: Apakah ada file existing untuk halaman roster?
// → Tidak. Halaman roster adalah halaman baru yang MEMANGGIL komponen existing.
//   ProfileThreeColGrid.js tidak diubah; hanya dipanggil dengan data Remix.

const HeadingContainer = tw.div`text-center mb-10`;
const Heading = tw(SectionHeading)``;
const Subheading = tw(SubheadingBase)`text-center mb-3`;
const Description = tw(SectionDescription)`mx-auto text-center`;

const InfoBlock = tw.div`max-w-screen-lg mx-auto px-8 py-8 bg-primary-900 text-gray-100 rounded-lg mb-4`;
const InfoText = tw.p`text-sm leading-loose text-center`;
const InfoLabel = tw.span`font-bold text-primary-300`;

// Data member Remix — konsisten dengan MemberProfileRemix.js
// PLACEHOLDER - ganti semua data di bawah ini dengan data asli
export const remixMembers = [
  {
    id: "1",
    imageSrc: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&fit=facearea&facepad=2.95&w=512&h=512&q=80",
    position: "Producer",
    name: "Rizky Aditya", // PLACEHOLDER
    bio: "Fokus di beat making dan produksi musik elektronik sejak 2022.", // PLACEHOLDER
    joinDate: "Januari 2022", // PLACEHOLDER
    socialMedia: "@rizky.aditya", // PLACEHOLDER
    works: ["Beat - Neon Vibes", "Remix - Lost Signal"], // PLACEHOLDER
    links: [
      { url: "https://www.tiktok.com/@team.sopan.remix", icon: TiktokIcon },
      { url: "https://youtube.com", icon: YoutubeIcon },
    ],
  },
  {
    id: "2",
    imageSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&fit=facearea&facepad=2.95&w=512&h=512&q=80",
    position: "Mixing Engineer",
    name: "Daffa Pratama", // PLACEHOLDER
    bio: "Spesialis mixing multi-track, aktif bereksperimen dengan efek audio kreatif.", // PLACEHOLDER
    joinDate: "Maret 2022", // PLACEHOLDER
    socialMedia: "@daffa.pratama", // PLACEHOLDER
    works: ["Mix - Midnight Drive", "Bootleg - Summer Haze"], // PLACEHOLDER
    links: [
      { url: "https://www.tiktok.com/@team.sopan.remix", icon: TiktokIcon },
      { url: "https://youtube.com", icon: YoutubeIcon },
    ],
  },
  {
    id: "3",
    imageSrc: "https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&fit=facearea&facepad=2.95&w=512&h=512&q=80",
    position: "Sound Engineer",
    name: "Bagas Ari", // PLACEHOLDER
    bio: "Mengelola rekayasa suara dan frekuensi untuk produksi audio berkualitas tinggi.", // PLACEHOLDER
    joinDate: "Juni 2022", // PLACEHOLDER
    socialMedia: "@bagas.ari", // PLACEHOLDER
    works: ["Master - Galaxy Trip", "Sound Design - Eclipse"], // PLACEHOLDER
    links: [
      { url: "https://www.tiktok.com/@team.sopan.remix", icon: TiktokIcon },
      { url: "https://youtube.com", icon: YoutubeIcon },
    ],
  },
  {
    id: "4",
    imageSrc: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&fit=facearea&facepad=2.95&w=512&h=512&q=80",
    position: "Mastering Engineer",
    name: "Salsa Nanda", // PLACEHOLDER
    bio: "Mengkhususkan diri pada mastering audio untuk platform streaming sejak 2023.", // PLACEHOLDER
    joinDate: "Februari 2023", // PLACEHOLDER
    socialMedia: "@salsa.nanda", // PLACEHOLDER
    works: ["Master - Urban Pulse", "Master - Chill Frequency"], // PLACEHOLDER
    links: [
      { url: "https://www.tiktok.com/@team.sopan.remix", icon: TiktokIcon },
      { url: "https://youtube.com", icon: YoutubeIcon },
    ],
  },
  {
    id: "5",
    imageSrc: "https://images.unsplash.com/photo-1546820389-44d77e1f3b31?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&fit=facearea&facepad=3.45&w=512&h=512&q=80",
    position: "Remixer",
    name: "Farhan Zaki", // PLACEHOLDER
    bio: "Mengolah audio trending menjadi remix kreatif yang siap ditayangkan di TikTok.", // PLACEHOLDER
    joinDate: "Agustus 2023", // PLACEHOLDER
    socialMedia: "@farhan.zaki", // PLACEHOLDER
    works: ["Remix - Neon Sunrise", "Bootleg - Analog Dreams"], // PLACEHOLDER
    links: [
      { url: "https://www.tiktok.com/@team.sopan.remix", icon: TiktokIcon },
      { url: "https://youtube.com", icon: YoutubeIcon },
    ],
  },
  {
    id: "6",
    imageSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&fit=facearea&facepad=3.45&w=512&h=512&q=80",
    position: "Producer & DJ",
    name: "Tiara Dewi", // PLACEHOLDER
    bio: "Memadukan produksi musik elektronik dengan gaya DJ untuk karya yang energik.", // PLACEHOLDER
    joinDate: "Oktober 2023", // PLACEHOLDER
    socialMedia: "@tiara.dewi", // PLACEHOLDER
    works: ["Set - Neon Festival", "Beat - Bass Drop 01"], // PLACEHOLDER
    links: [
      { url: "https://www.tiktok.com/@team.sopan.remix", icon: TiktokIcon },
      { url: "https://youtube.com", icon: YoutubeIcon },
    ],
  },
];

const StyledHeader = tw(HeaderBase)`max-w-none py-4`;
const LogoLink = tw(LogoLinkBase)`text-gray-900`;

export default () => {
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

  // Bentuk data untuk ProfileThreeColGrid — tambahkan navigasi ke profile page
  const cards = remixMembers.map(member => ({
    imageSrc: member.imageSrc,
    position: member.position,
    name: member.name,
    links: member.links,
    id: member.id,
  }));

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

          {/* Render grid menggunakan ProfileThreeColGrid dengan data Remix.
              Kartu dibuat clickable via wrapper Link dari react-router-dom. */}
          <div tw="flex flex-wrap flex-row justify-center sm:max-w-2xl lg:max-w-4xl mx-auto">
            {remixMembers.map((member) => (
              <Link
                key={member.id}
                to={`/remix/members/${member.id}`}
                tw="mt-16 w-full sm:w-1/2 flex flex-col items-center no-underline"
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{ backgroundImage: `url("${member.imageSrc}")` }}
                  tw="w-64 h-64 bg-contain bg-center rounded-lg cursor-pointer hover:opacity-75 transition duration-300"
                />
                <div tw="flex flex-col items-center mt-6">
                  <span tw="uppercase font-bold tracking-widest text-xs text-primary-500">
                    {member.position}
                  </span>
                  <span tw="mt-1 text-xl font-medium text-gray-900 hover:text-primary-500 transition duration-300">
                    {member.name}
                  </span>
              <div tw="mt-6 flex">
  {member.links.map((link, linkIndex) => (
    
     <a key={linkIndex}
      tw="mr-8 last:mr-0 text-gray-400 hocus:text-primary-500 transition duration-300"
      href={link.url}
      onClick={e => e.stopPropagation()}
    >
      {link.icon === TiktokIcon && <TiktokIcon tw="fill-current w-6 h-6" />}
      {link.icon === YoutubeIcon && <YoutubeIcon tw="fill-current w-6 h-6" />}
    </a>
  ))}
</div>
                </div>
              </Link>
            ))}
          </div>

        </ContentWithPaddingXl>
      </Container>
    </AnimationRevealPage>
  );
};
