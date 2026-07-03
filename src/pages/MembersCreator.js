import React from "react";
import { Link } from "react-router-dom";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings";
import { SectionDescription } from "components/misc/Typography";
import { ReactComponent as TwitterIcon } from "images/twitter-icon.svg";
import { ReactComponent as LinkedinIcon } from "images/linkedin-icon.svg";
import { ReactComponent as GithubIcon } from "images/github-icon.svg";

// ─────────────────────────────────────────────────────────────────────────────
// MEMBER ROSTER: SOPAN CREATOR (/creator/members)
// Data konsisten dengan MemberProfileCreator.js
// ─────────────────────────────────────────────────────────────────────────────

const HeadingContainer = tw.div`text-center mb-10`;
const Heading = tw(SectionHeading)``;
const Subheading = tw(SubheadingBase)`text-center mb-3`;
const Description = tw(SectionDescription)`mx-auto text-center`;
const InfoBlock = tw.div`max-w-screen-lg mx-auto px-8 py-8 bg-primary-900 text-gray-100 rounded-lg mb-4`;
const InfoText = tw.p`text-sm leading-loose text-center`;
const InfoLabel = tw.span`font-bold text-primary-300`;

// PLACEHOLDER - ganti semua data di bawah ini dengan data asli
export const creatorMembers = [
  {
    id: "1",
    imageSrc: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&fit=facearea&facepad=2.95&w=512&h=512&q=80",
    position: "Video Editor",
    name: "Fauzan Ardiansyah", // PLACEHOLDER
    bio: "Spesialis editing jedag-jedug dengan Alight Motion, aktif membuat konten trending sejak 2022.", // PLACEHOLDER
    joinDate: "Februari 2022", // PLACEHOLDER
    socialMedia: "@fauzan.ardi", // PLACEHOLDER
    works: ["Edit - Neon Glitch", "Video - Beat Drop 01"], // PLACEHOLDER
    links: [
      { url: "https://twitter.com", icon: TwitterIcon },
      { url: "https://linkedin.com", icon: LinkedinIcon },
      { url: "https://github.com", icon: GithubIcon },
    ],
  },
  {
    id: "2",
    imageSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&fit=facearea&facepad=2.95&w=512&h=512&q=80",
    position: "Video Editor",
    name: "Aulia Rahmawati", // PLACEHOLDER
    bio: "Expert color grading dan transisi Alight Motion, konten konsisten tembus ribuan views.", // PLACEHOLDER
    joinDate: "April 2022", // PLACEHOLDER
    socialMedia: "@aulia.rahma", // PLACEHOLDER
    works: ["Edit - Sunset Flow", "Collab - Viral Cut 02"], // PLACEHOLDER
    links: [
      { url: "https://twitter.com", icon: TwitterIcon },
      { url: "https://linkedin.com", icon: LinkedinIcon },
      { url: "https://github.com", icon: GithubIcon },
    ],
  },
  {
    id: "3",
    imageSrc: "https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&fit=facearea&facepad=2.95&w=512&h=512&q=80",
    position: "Motion Graphics",
    name: "Aldi Saputra", // PLACEHOLDER
    bio: "Menambahkan elemen motion graphics dan teks animasi untuk memperkaya visual konten.", // PLACEHOLDER
    joinDate: "Juli 2022", // PLACEHOLDER
    socialMedia: "@aldi.saputra", // PLACEHOLDER
    works: ["Motion - City Lights", "Collab - Flash Edit"], // PLACEHOLDER
    links: [
      { url: "https://twitter.com", icon: TwitterIcon },
      { url: "https://linkedin.com", icon: LinkedinIcon },
      { url: "https://github.com", icon: GithubIcon },
    ],
  },
  {
    id: "4",
    imageSrc: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&fit=facearea&facepad=2.95&w=512&h=512&q=80",
    position: "Video Editor",
    name: "Reza Nugraha", // PLACEHOLDER
    bio: "Fokus di sinkronisasi beat dan cutting yang presisi untuk konten jedag-jedug.", // PLACEHOLDER
    joinDate: "September 2022", // PLACEHOLDER
    socialMedia: "@reza.nugr", // PLACEHOLDER
    works: ["Edit - Dark Mode Series", "Cut - Bass Sync 03"], // PLACEHOLDER
    links: [
      { url: "https://twitter.com", icon: TwitterIcon },
      { url: "https://linkedin.com", icon: LinkedinIcon },
      { url: "https://github.com", icon: GithubIcon },
    ],
  },
  {
    id: "5",
    imageSrc: "https://images.unsplash.com/photo-1546820389-44d77e1f3b31?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&fit=facearea&facepad=3.45&w=512&h=512&q=80",
    position: "Video Editor",
    name: "Hendra Wijaya", // PLACEHOLDER
    bio: "Kreator video dengan estetika cinematic, aktif bereksperimen dengan teknik editing baru.", // PLACEHOLDER
    joinDate: "Januari 2023", // PLACEHOLDER
    socialMedia: "@hendra.wij", // PLACEHOLDER
    works: ["Edit - Cinematic Cut", "Collab - Gold Series"], // PLACEHOLDER
    links: [
      { url: "https://twitter.com", icon: TwitterIcon },
      { url: "https://linkedin.com", icon: LinkedinIcon },
      { url: "https://github.com", icon: GithubIcon },
    ],
  },
  {
    id: "6",
    imageSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&fit=facearea&facepad=3.45&w=512&h=512&q=80",
    position: "Content Creator",
    name: "Maya Sari", // PLACEHOLDER
    bio: "Menggabungkan storytelling visual dengan editing jedag-jedug yang kuat dan berkarakter.", // PLACEHOLDER
    joinDate: "Maret 2023", // PLACEHOLDER
    socialMedia: "@maya.sari", // PLACEHOLDER
    works: ["Story - Visual Series 01", "Edit - Drama Sync"], // PLACEHOLDER
    links: [
      { url: "https://twitter.com", icon: TwitterIcon },
      { url: "https://linkedin.com", icon: LinkedinIcon },
      { url: "https://github.com", icon: GithubIcon },
    ],
  },
];

export default () => {
  return (
    <AnimationRevealPage>
      <Container>
        <ContentWithPaddingXl>
          <InfoBlock>
            <InfoText>
              <InfoLabel>Pendiri: </InfoLabel>Admin Sopan Creator {/* PLACEHOLDER - ganti dengan data asli */}
              {"  ·  "}
              <InfoLabel>Pengelola: </InfoLabel>Tim Admin Sopan Creator {/* PLACEHOLDER - ganti dengan data asli */}
              {"  ·  "}
              <InfoLabel>Berdiri: </InfoLabel>2022 {/* PLACEHOLDER - ganti dengan data asli */}
            </InfoText>
          </InfoBlock>

          <HeadingContainer>
            <Subheading>Sopan Creator</Subheading>
            <Heading>Member Roster</Heading>
            <Description>
              Kenali para video editor di balik Sopan Creator.
              Klik nama atau foto member untuk melihat profil lengkap.
            </Description>
          </HeadingContainer>

          <div tw="flex flex-wrap flex-row justify-center sm:max-w-2xl lg:max-w-5xl mx-auto">
            {creatorMembers.map((member) => (
              <Link
                key={member.id}
                to={`/creator/members/${member.id}`}
                tw="mt-24 w-full sm:w-1/2 lg:w-1/3 flex flex-col items-center no-underline"
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{ backgroundImage: `url("${member.imageSrc}")` }}
                  tw="w-64 h-64 bg-contain bg-center rounded cursor-pointer hover:opacity-75 transition duration-300"
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
      {link.icon === TwitterIcon && <TwitterIcon tw="fill-current w-6 h-6" />}
      {link.icon === LinkedinIcon && <LinkedinIcon tw="fill-current w-6 h-6" />}
      {link.icon === GithubIcon && <GithubIcon tw="fill-current w-6 h-6" />}
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
