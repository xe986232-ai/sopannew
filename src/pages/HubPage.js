import React from "react";
import { Link } from "react-router-dom";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { SectionDescription } from "components/misc/Typography.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import { ReactComponent as SvgDecoratorBlob } from "images/svg-decorator-blob-3.svg";

// ─────────────────────────────────────────────────────────────────────────────
// HUB SEMENTARA — SOPAN TEAM (/)
// TEMP: Ini BUKAN versi final sesuai brief PROMPT-SOPAN-TEAM.md bagian A.
// Dibuat sebagai placeholder navigasi selagi Antigravity belum menyelesaikan
// HubPage.js asli (yang seharusnya pakai TabCardGrid.js / PortfolioTwoCardsWithImage.js
// dan mencakup 3 divisi). Timpa file ini begitu HubPage.js asli sudah jadi.
//
// Struktur konten tetap sama seperti sebelumnya (heading + 3 card divisi),
// cuma tampilannya dipoles pakai gaya visual demos/RestaurantLandingPage.js:
// highlighted text yang di-skew, card rounded-4xl, dan blob decorator halus
// di background — simple tapi tetap cantik.
// ─────────────────────────────────────────────────────────────────────────────

const HeadingContainer = tw.div`text-center mb-16 relative z-10`;
const Subheading = tw.span`tracking-wider text-sm font-medium text-primary-500`;
const Heading = tw.h2`mt-4 font-black text-3xl sm:text-4xl text-gray-900`;
const HighlightedText = tw.span`bg-primary-500 text-gray-100 px-4 transform -skew-x-12 inline-block`;
const Description = tw(SectionDescription)`mt-8 mx-auto text-center max-w-2xl`;

const CardGrid = tw.div`mt-8 flex flex-wrap justify-center -mx-4 relative z-10`;

const Card = tw(Link)`
  mx-4 mb-8 w-full sm:w-80
  flex flex-col
  bg-gray-100 rounded-4xl p-8
  no-underline
  transition duration-300 transform
  hover:shadow-raised hover:-translate-y-1
`;

const CardTitle = tw.h4`text-2xl font-bold text-gray-900`;
const CardDescription = tw.p`mt-2 text-sm text-gray-600 leading-relaxed`;
const CardButton = tw(PrimaryButtonBase)`mt-6 w-full`;

const ComingSoonCard = tw.div`
  mx-4 mb-8 w-full sm:w-80
  flex flex-col
  bg-gray-100 rounded-4xl p-8
  opacity-50
`;

const StatusBadge = tw.p`mt-6 inline-block text-xs uppercase tracking-widest font-bold text-gray-400 transform -skew-x-12`;

const DecoratorBlob = styled(SvgDecoratorBlob)`
  ${tw`pointer-events-none absolute right-0 top-0 w-64 opacity-15 transform translate-x-24 -translate-y-16 -z-10`}
`;

export default () => {
  return (
    <AnimationRevealPage>
      <Container>
        <ContentWithPaddingXl>
          <HeadingContainer>
            <Subheading>Sopan Team</Subheading>
            <Heading>
              Pilih <HighlightedText>Divisimu.</HighlightedText>
            </Heading>
            <Description>
              Sopan Team menaungi beberapa divisi kreatif independen.
              Pilih salah satu untuk melihat karya, member, dan cara bergabung.
              {/* TEMP: Hub sederhana sementara — versi final menyusul dari Antigravity */}
            </Description>
          </HeadingContainer>

          <CardGrid>
            <Card to="/remix">
              <CardTitle>Sopan Remix</CardTitle>
              <CardDescription>
                Produksi musik, mixing, mastering, dan sound engineering.
              </CardDescription>
              <CardButton as="span">Lihat Divisi</CardButton>
            </Card>

            <Card to="/creator">
              <CardTitle>Sopan Creator</CardTitle>
              <CardDescription>
                Editing video gaya jedag-jedug menggunakan Alight Motion.
              </CardDescription>
              <CardButton as="span">Lihat Divisi</CardButton>
            </Card>

            <ComingSoonCard>
              <CardTitle>Sopan Leadies</CardTitle>
              <CardDescription>
                Editing video jedag-jedug khusus member perempuan.
                {/* PLACEHOLDER: menunggu divisi ini selesai dikerjakan */}
              </CardDescription>
              <StatusBadge>Segera hadir</StatusBadge>
            </ComingSoonCard>
          </CardGrid>
          <DecoratorBlob />
        </ContentWithPaddingXl>
      </Container>
    </AnimationRevealPage>
  );
};
