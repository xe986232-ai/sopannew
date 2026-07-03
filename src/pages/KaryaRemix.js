import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Header from "components/headers/light.js";
import Footer from "components/footers/FooterRemix.js";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { Container as ContainerBase, Content2Xl } from "components/misc/Layouts.js";
import { SectionHeading } from "components/misc/Headings.js";
import { SectionDescription } from "components/misc/Typography.js";

// ─────────────────────────────────────────────────────────────────────────────
// HALAMAN: LIHAT KARYA — SOPAN REMIX
// Menampilkan gambar cover + audio player untuk tiap karya member
// ─────────────────────────────────────────────────────────────────────────────

const Container = tw(ContainerBase)`bg-white text-gray-900 min-h-screen`;
const HeaderRow = tw.div`flex flex-col items-center text-center pt-16 pb-8`;
const Heading = tw(SectionHeading)``;
const Description = tw(SectionDescription)`mt-4 max-w-2xl mx-auto`;

const Grid = tw.div`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-20`;

const Card = styled.div`
  ${tw`rounded-lg shadow-md overflow-hidden bg-gray-100 flex flex-col`}
`;
const CoverImage = styled.div`
  ${props => `background-image: url("${props.imageSrc}");`}
  ${tw`h-56 bg-cover bg-center`}
`;
const CardContent = tw.div`p-6 flex flex-col flex-1`;
const CardTitle = tw.h3`text-lg font-bold text-gray-900`;
const CardCreator = tw.p`text-sm text-gray-600 mt-1 mb-4`;
const AudioPlayer = tw.audio`w-full mt-auto`;

export default ({
  heading = "Lihat Karya",
  description = "Kumpulan karya audio dari member Sopan Remix — dengarkan langsung hasil produksi, remix, dan mixing mereka.",
  karyaList = [
    {
      // PLACEHOLDER - ganti dengan data karya asli
      title: "Midnight Drive (Remix)",
      creator: "Rizky Aditya",
      imageSrc: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80",
      audioSrc: ""
    },
    {
      // PLACEHOLDER - ganti dengan data karya asli
      title: "Ocean Waves (Original)",
      creator: "Daffa Pratama",
      imageSrc: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
      audioSrc: ""
    },
    {
      // PLACEHOLDER - ganti dengan data karya asli
      title: "City Lights (Mixing Demo)",
      creator: "Bagus Setiawan",
      imageSrc: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=600&q=80",
      audioSrc: ""
    }
  ]
}) => (
  <AnimationRevealPage>
    <Header />
    <Container>
      <Content2Xl>
        <HeaderRow>
          <Heading>{heading}</Heading>
          <Description>{description}</Description>
        </HeaderRow>
        <Grid>
          {karyaList.map((karya, index) => (
            <Card key={index}>
              <CoverImage imageSrc={karya.imageSrc} />
              <CardContent>
                <CardTitle>{karya.title}</CardTitle>
                <CardCreator>oleh {karya.creator}</CardCreator>
                <AudioPlayer controls src={karya.audioSrc}>
                  Browser kamu tidak mendukung audio player.
                </AudioPlayer>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Content2Xl>
    </Container>
    <Footer />
  </AnimationRevealPage>
);