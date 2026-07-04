import React from "react";
import { Link } from "react-router-dom";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings.js";
import { SectionDescription } from "components/misc/Typography.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import { ReactComponent as MusicIcon } from "feather-icons/dist/icons/music.svg";
import { ReactComponent as FilmIcon } from "feather-icons/dist/icons/film.svg";
import { ReactComponent as UsersIcon } from "feather-icons/dist/icons/users.svg";
import { ReactComponent as CheckCircleIcon } from "feather-icons/dist/icons/check-circle.svg";
import { ReactComponent as ClockIcon } from "feather-icons/dist/icons/clock.svg";

// ─────────────────────────────────────────────────────────────────────────────
// HUB SEMENTARA — SOPAN TEAM (/)
// TEMP: Ini BUKAN versi final sesuai brief PROMPT-SOPAN-TEAM.md bagian A.
// Dibuat sebagai placeholder navigasi selagi Antigravity belum menyelesaikan
// HubPage.js asli (yang seharusnya pakai TabCardGrid.js / PortfolioTwoCardsWithImage.js
// dan mencakup 3 divisi). Timpa file ini begitu HubPage.js asli sudah jadi.
//
// STATUS DIVISI SAAT INI:
// - Sopan Remix   → AKTIF, bisa diklik, mengarah ke /remix
// - Sopan Creator → SEGERA HADIR (belum bisa diklik)
// - Sopan Leadies → SEGERA HADIR (belum bisa diklik)
// Data disusun jadi satu array `divisions` di bawah supaya gampang diubah
// statusnya (misalnya kalau Sopan Creator sudah siap, tinggal ganti
// status: "active" dan isi field `to`-nya).
// ─────────────────────────────────────────────────────────────────────────────

const HeadingContainer = tw.div`text-center mb-16`;
const Heading = tw(SectionHeading)``;
const Subheading = tw(SubheadingBase)`text-center mb-3`;
const Description = tw(SectionDescription)`mx-auto text-center max-w-2xl`;

const CardGrid = tw.div`mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch`;

const cardBaseStyles = tw`
  relative flex flex-col h-full
  bg-gray-100 rounded-lg p-8
  border-2 border-transparent
`;

const Card = styled(Link)`
  ${cardBaseStyles}
  ${tw`no-underline transition duration-300 hocus:shadow-raised hocus:-translate-y-1 hocus:border-primary-500`}
`;

const ComingSoonCard = styled.div`
  ${cardBaseStyles}
  ${tw`border-dashed border-gray-300 bg-gray-100`}
`;

const StatusBadge = styled.span`
  ${tw`absolute top-[1.5rem] right-[1.5rem] inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full`}
  ${props => (props.$active ? tw`bg-primary-100 text-primary-600` : tw`bg-gray-200 text-gray-500`)}
`;

const IconCircle = styled.div`
  ${tw`w-16 h-16 rounded-full flex items-center justify-center mb-6`}
  ${props => (props.$active ? tw`bg-primary-500 text-gray-100` : tw`bg-gray-300 text-gray-500`)}
`;

const CardTitle = styled.h4`
  ${tw`text-2xl font-bold pr-16`}
  ${props => (props.$active ? tw`text-gray-900` : tw`text-gray-500`)}
`;
const CardDescription = tw.p`mt-2 text-sm text-gray-600 leading-relaxed flex-1`;
const CardButton = tw(PrimaryButtonBase)`mt-8 w-full`;

const ComingSoonFooter = tw.p`
  mt-8 text-xs uppercase tracking-widest font-bold text-gray-400
  flex items-center gap-2
`;

const FootNote = tw.p`mt-16 text-center text-sm text-gray-500`;

// Data divisi — cukup ubah `status` & `to` di sini kalau ada divisi baru
// yang siap diluncurkan, tidak perlu ubah struktur JSX di bawah.
const divisions = [
  {
    name: "Sopan Remix",
    description: "Produksi musik, mixing, mastering, dan sound engineering.",
    icon: MusicIcon,
    status: "active",
    to: "/remix",
  },
  {
    name: "Sopan Creator",
    description: "Editing video gaya jedag-jedug menggunakan Alight Motion.",
    icon: FilmIcon,
    status: "coming-soon",
  },
  {
    name: "Sopan Leadies",
    description: "Editing video jedag-jedug khusus member perempuan.",
    icon: UsersIcon,
    status: "coming-soon",
  },
];

export default () => {
  return (
    <AnimationRevealPage>
      <Container>
        <ContentWithPaddingXl>
          <HeadingContainer>
            <Subheading>Sopan Team</Subheading>
            <Heading>Pilih Divisimu</Heading>
            <Description>
              Sopan Team menaungi beberapa divisi kreatif independen.
              Pilih salah satu untuk melihat karya, member, dan cara bergabung.
              {/* TEMP: Hub sederhana sementara — versi final menyusul dari Antigravity */}
            </Description>
          </HeadingContainer>

          <CardGrid>
            {divisions.map((division) => {
              const isActive = division.status === "active";
              const Icon = division.icon;

              if (isActive) {
                return (
                  <Card key={division.name} to={division.to}>
                    <StatusBadge $active>
                      <CheckCircleIcon tw="w-3 h-3 fill-current" />
                      Aktif
                    </StatusBadge>
                    <IconCircle $active>
                      <Icon className={tw`w-6 h-6`} />
                    </IconCircle>
                    <CardTitle $active>{division.name}</CardTitle>
                    <CardDescription>{division.description}</CardDescription>
                    <CardButton as="span">Lihat Divisi</CardButton>
                  </Card>
                );
              }

              return (
                <ComingSoonCard key={division.name} aria-disabled="true">
                  <StatusBadge>
                    <ClockIcon tw="w-3 h-3 fill-current" />
                    Segera Hadir
                  </StatusBadge>
                  <IconCircle>
                    <Icon className={tw`w-6 h-6`} />
                  </IconCircle>
                  <CardTitle>{division.name}</CardTitle>
                  <CardDescription>{division.description}</CardDescription>
                  <ComingSoonFooter>
                    <ClockIcon tw="w-3 h-3 fill-current" />
                    Sedang dipersiapkan tim
                  </ComingSoonFooter>
                </ComingSoonCard>
              );
            })}
          </CardGrid>

          <FootNote>
            Divisi baru akan terus ditambahkan seiring berkembangnya Sopan Team.
          </FootNote>
        </ContentWithPaddingXl>
      </Container>
    </AnimationRevealPage>
  );
};
