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
import remixImageSrc from "images/remix.jpeg";
import creatorImageSrc from "images/creator.jpeg";
import leadisImageSrc from "images/leadis.jpeg";

// ─────────────────────────────────────────────────────────────────────────────
// HUB SEMENTARA — SOPAN TEAM (/)
// TEMP: Ini BUKAN versi final sesuai brief PROMPT-SOPAN-TEAM.md bagian A.
// Dibuat sebagai placeholder navigasi selagi Antigravity belum menyelesaikan
// HubPage.js asli (yang seharusnya pakai TabCardGrid.js / PortfolioTwoCardsWithImage.js
// dan mencakup 3 divisi). Timpa file ini begitu HubPage.js asli sudah jadi.
// ─────────────────────────────────────────────────────────────────────────────

const HeadingContainer = tw.div`text-center mb-16`;
const Heading = tw(SectionHeading)``;
const Subheading = tw(SubheadingBase)`text-center mb-3`;
const Description = tw(SectionDescription)`mx-auto text-center max-w-2xl`;

const CardGrid = tw.div`mt-8 flex flex-wrap justify-center -mx-4`;

const Card = tw(Link)`
  mx-4 mb-8 w-full sm:w-80
  flex flex-col
  bg-gray-100 rounded-lg p-8
  no-underline
  transition duration-300
  hover:shadow-raised hover:-translate-y-1
`;

const CardTitle = tw.h4`text-2xl font-bold text-gray-900`;
const CardDescription = tw.p`mt-2 text-sm text-gray-600 leading-relaxed`;
const CardButton = tw(PrimaryButtonBase)`mt-6 w-full`;

const ComingSoonCard = tw.div`
  mx-4 mb-8 w-full sm:w-80
  flex flex-col
  bg-gray-100 rounded-lg p-8
  opacity-50
`;

// Helper: gambar divisi ditaruh sebagai background box, dibuat samar +
// dicampur gradient tipis (nuansa gray-100 → primary ungu) biar teks judul
// & deskripsi di depan tetap kebaca jelas, gak nabrak sama foto.
const divisionBg = (imageSrc) => ({
  backgroundImage: `linear-gradient(135deg, rgba(243,244,246,0.94) 0%, rgba(243,244,246,0.86) 45%, rgba(100,21,255,0.22) 100%), url(${imageSrc})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
});

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
            <Card to="/remix" style={divisionBg(remixImageSrc)}>
              <CardTitle>Sopan Remix</CardTitle>
              <CardDescription>
                Produksi musik, mixing, mastering, dan sound engineering.
              </CardDescription>
              <CardButton as="span">Lihat Divisi</CardButton>
            </Card>

            <ComingSoonCard style={divisionBg(creatorImageSrc)}>
              <CardTitle>Sopan Creator</CardTitle>
              <CardDescription>
                Editing video gaya jedag-jedug menggunakan Alight Motion.
              </CardDescription>
              <p tw="mt-6 text-xs uppercase tracking-widest font-bold text-gray-400">
                Segera hadir!
              </p>
            </ComingSoonCard>

            <ComingSoonCard style={divisionBg(leadisImageSrc)}>
              <CardTitle>Sopan Leadies</CardTitle>
              <CardDescription>
                Editing video jedag-jedug khusus member perempuan.
                {/* PLACEHOLDER: menunggu divisi ini selesai dikerjakan */}
              </CardDescription>
              <p tw="mt-6 text-xs uppercase tracking-widest font-bold text-gray-400">
                Segera hadir
              </p>
            </ComingSoonCard>
          </CardGrid>
        </ContentWithPaddingXl>
      </Container>
    </AnimationRevealPage>
  );
};
