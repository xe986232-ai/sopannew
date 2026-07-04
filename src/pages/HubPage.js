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

// ── Avatar divisi dengan bingkai blob (CSS Shapes: border-shape) ──
// CATATAN KOMPATIBILITAS: `border-shape` masih fitur CSS yang sangat baru
// dan BELUM didukung luas di browser (baru mulai muncul di Chromium
// terbaru). Di browser yang belum support, avatar akan tampil sebagai
// kotak biasa dengan border ungu solid (fallback aman, tidak rusak/error).
const DivisionAvatarWrap = tw.div`w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6`;

const REMIX_BLOB_SHAPE = `shape(from 55.86% 86.61%,curve to 34.13% 85.31% with 45.13% 88.51%,smooth to 13.89% 73.14%,smooth to 3.24% 50.45%,smooth to 12.54% 28.46%,smooth to 33.63% 16.49%,smooth to 56.47% 9.68%,smooth to 78.53% 15.57%,smooth to 86.42% 36.99%,smooth to 84.92% 60.57%,smooth to 75.85% 78.22%,smooth to 55.86% 86.61%)`;
const CREATOR_BLOB_SHAPE = `shape(from 57.36% 96.01%,curve to 32.55% 91.39% with 43.89% 98.38%,smooth to 12.96% 74.27%,smooth to 3.98% 50.64%,smooth to 10.51% 25.60%,smooth to 30.10% 8.57%,smooth to 53.63% 9.54%,smooth to 76.10% 20.54%,smooth to 92.94% 37.11%,smooth to 92.33% 60.77%,smooth to 78.50% 83.00%,smooth to 57.36% 96.01%)`;
const LEADIS_BLOB_SHAPE = `shape(from 55.78% 86.65%,curve to 32.74% 87.11% with 45.10% 88.82%,smooth to 12.14% 74.90%,smooth to 4.19% 50.94%,smooth to 14.29% 29.31%,smooth to 33.33% 12.51%,smooth to 53.76% 9.79%,smooth to 75.28% 20.97%,smooth to 89.18% 37.76%,smooth to 87.73% 59.75%,smooth to 74.59% 77.36%,smooth to 55.78% 86.65%)`;

const DivisionAvatar = styled.img`
  ${tw`w-full h-full object-cover`}
  aspect-ratio: 1;
  border: 8px solid #6415FF;
  border-shape: ${(props) => props.blobShape};
`;

const StatusBadge = styled.span`
  ${tw`inline-block mt-4 text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full`}
  ${(props) => (props.active ? tw`bg-green-100 text-green-600` : tw`bg-gray-200 text-gray-500`)}
`;

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
            <Card to="/remix">
              <DivisionAvatarWrap>
                <DivisionAvatar src={remixImageSrc} alt="Sopan Remix" blobShape={REMIX_BLOB_SHAPE} />
              </DivisionAvatarWrap>
              <CardTitle>Sopan Remix</CardTitle>
              <CardDescription>
                Produksi musik, mixing, mastering, dan sound engineering.
              </CardDescription>
              <StatusBadge active>Aktif</StatusBadge>
              <CardButton as="span">Lihat Divisi</CardButton>
            </Card>

            <ComingSoonCard>
              <DivisionAvatarWrap>
                <DivisionAvatar src={creatorImageSrc} alt="Sopan Creator" blobShape={CREATOR_BLOB_SHAPE} />
              </DivisionAvatarWrap>
              <CardTitle>Sopan Creator</CardTitle>
              <CardDescription>
                Editing video gaya jedag-jedug menggunakan Alight Motion.
              </CardDescription>
              <StatusBadge>Coming Soon</StatusBadge>
            </ComingSoonCard>

            <ComingSoonCard>
              <DivisionAvatarWrap>
                <DivisionAvatar src={leadisImageSrc} alt="Sopan Leadies" blobShape={LEADIS_BLOB_SHAPE} />
              </DivisionAvatarWrap>
              <CardTitle>Sopan Leadies</CardTitle>
              <CardDescription>
                Editing video jedag-jedug khusus member perempuan.
                {/* PLACEHOLDER: menunggu divisi ini selesai dikerjakan */}
              </CardDescription>
              <StatusBadge>Coming Soon</StatusBadge>
            </ComingSoonCard>
          </CardGrid>
        </ContentWithPaddingXl>
      </Container>
    </AnimationRevealPage>
  );
};
