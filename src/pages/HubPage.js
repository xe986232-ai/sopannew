import React from "react";
import { Link } from "react-router-dom";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import HeaderBase, { LogoLink as LogoLinkBase, NavLinks, NavLink } from "components/headers/light.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { ReactComponent as SvgDotPattern } from "images/dot-pattern.svg";
import { ReactComponent as SvgDecoratorBlob } from "images/svg-decorator-blob-3.svg";
import logoImageSrc from "images/logo-sopan.png";
import remixImageSrc from "images/remix.jpeg";
import creatorImageSrc from "images/creator.jpeg";
import leadisImageSrc from "images/leadis.jpeg";

// ─────────────────────────────────────────────────────────────────────────────
// HUB — SOPAN TEAM (/)
// Konsep visual dicontek dari demos/RestaurantLandingPage.js: heading besar
// dengan highlighted text yang di-skew, foto rounded-4xl, blob decorator di
// background, dan card yang punya efek hover halus. Kontennya diganti jadi
// 3 pilihan divisi: Remix, Creator, Leadies.
// ─────────────────────────────────────────────────────────────────────────────

const StyledHeader = tw(HeaderBase)`max-w-none py-4`;
const LogoLink = tw(LogoLinkBase)`text-gray-900`;

const HeroContainer = tw.div`relative`;
const HeroContent = tw.div`pt-16 pb-12 md:pt-20 text-center max-w-screen-md mx-auto relative z-10`;
const Subheading = tw.span`tracking-wider text-sm font-medium text-primary-500`;
const Heading = tw.h1`mt-4 font-black text-3xl sm:text-4xl md:text-5xl leading-snug text-gray-900`;
const HighlightedText = tw.span`bg-primary-500 text-gray-100 px-4 transform -skew-x-12 inline-block`;
const HeroDescription = tw.p`mt-6 text-sm sm:text-base font-medium text-gray-600 max-w-xl mx-auto`;

const DecoratorBlobTop = styled(SvgDotPattern)`
  ${tw`pointer-events-none fill-current text-primary-500 opacity-25 absolute top-0 right-0 w-32 h-32 transform translate-x-10 -translate-y-10 -z-10`}
`;
const DecoratorBlobBottom = styled(SvgDecoratorBlob)`
  ${tw`pointer-events-none absolute left-0 bottom-0 w-64 opacity-25 transform -translate-x-24 translate-y-16 -z-10`}
`;

const DivisionsGrid = tw.div`mt-4 flex flex-col items-center lg:items-stretch lg:flex-row flex-wrap lg:justify-center max-w-screen-lg mx-auto pb-20`;
const DivisionColumn = tw.div`w-full sm:w-80 mx-4 mb-10`;

const cardBaseStyles = tw`flex flex-col items-center text-center h-full px-6 py-10 rounded-lg bg-gray-100 transition-transform duration-300`;

const DivisionCardActive = styled(Link)`
  ${cardBaseStyles}
  ${tw`no-underline transform hover:-translate-y-1 hover:shadow-raised`}
`;
const DivisionCardInactive = styled.div`
  ${cardBaseStyles}
  ${tw`opacity-50`}
`;

const DivisionImageFrame = tw.div`w-32 h-32 sm:w-40 sm:h-40 rounded-4xl overflow-hidden shadow-lg flex-shrink-0`;
const DivisionImage = tw.img`w-full h-full object-cover`;

const DivisionTitle = tw.h4`mt-6 text-xl font-bold text-gray-900`;
const DivisionDescription = tw.p`mt-2 text-sm text-gray-600 leading-relaxed`;

const StatusBadge = styled.span`
  ${tw`mt-6 inline-block text-xs uppercase tracking-widest font-bold px-4 py-1 rounded-full transform -skew-x-12`}
  ${(props) => (props.active ? tw`bg-primary-500 text-gray-100` : tw`bg-gray-300 text-gray-600`)}
`;

// ── Data 3 divisi Sopan Team ──
const divisions = [
  {
    key: "remix",
    name: "Sopan Remix",
    description: "Produksi musik, mixing, mastering, dan sound engineering.",
    image: remixImageSrc,
    active: true,
    to: "/remix",
    status: "Aktif",
  },
  {
    key: "creator",
    name: "Sopan Creator",
    description: "Editing video gaya jedag-jedug menggunakan Alight Motion.",
    image: creatorImageSrc,
    active: false,
    status: "Segera hadir!",
  },
  {
    key: "leadis",
    name: "Sopan Leadies",
    description: "Editing video jedag-jedug khusus member perempuan.",
    image: leadisImageSrc,
    active: false,
    status: "Segera hadir",
  },
];

export default () => {
  const logoLink = (
    <LogoLink href="/">
      <img src={logoImageSrc} alt="Logo" />
      Sopan Team
    </LogoLink>
  );
  const navLinks = [
    <NavLinks key={1}>
      <NavLink href="/">Home</NavLink>
    </NavLinks>,
  ];

  return (
    <AnimationRevealPage>
      <Container>
        <StyledHeader logoLink={logoLink} links={navLinks} />

        <HeroContainer>
          <HeroContent>
            <Subheading>Sopan Team</Subheading>
            <Heading>
              Wadah Kreator Digital <HighlightedText>Independen.</HighlightedText>
            </Heading>
            <HeroDescription>
              Sopan Team menaungi beberapa divisi kreatif independen. Pilih salah satu
              untuk melihat karya, member, dan cara bergabung.
            </HeroDescription>
          </HeroContent>
          <DecoratorBlobTop />
        </HeroContainer>

        <ContentWithPaddingXl>
          <DivisionsGrid>
            {divisions.map((division) =>
              division.active ? (
                <DivisionColumn key={division.key}>
                  <DivisionCardActive to={division.to}>
                    <DivisionImageFrame>
                      <DivisionImage src={division.image} alt={division.name} />
                    </DivisionImageFrame>
                    <DivisionTitle>{division.name}</DivisionTitle>
                    <DivisionDescription>{division.description}</DivisionDescription>
                    <StatusBadge active>{division.status}</StatusBadge>
                  </DivisionCardActive>
                </DivisionColumn>
              ) : (
                <DivisionColumn key={division.key}>
                  <DivisionCardInactive>
                    <DivisionImageFrame>
                      <DivisionImage src={division.image} alt={division.name} />
                    </DivisionImageFrame>
                    <DivisionTitle>{division.name}</DivisionTitle>
                    <DivisionDescription>{division.description}</DivisionDescription>
                    <StatusBadge>{division.status}</StatusBadge>
                  </DivisionCardInactive>
                </DivisionColumn>
              )
            )}
          </DivisionsGrid>
          <DecoratorBlobBottom />
        </ContentWithPaddingXl>
      </Container>
    </AnimationRevealPage>
  );
};
