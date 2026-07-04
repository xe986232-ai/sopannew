import React from "react";
import tw from "twin.macro";
import styled, { keyframes } from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import HeaderBase, {
  LogoLink as LogoLinkBase,
  NavLinks,
  NavLink as NavLinkBase,
  PrimaryLink as PrimaryLinkBase
} from "../headers/light.js";
import { Container as ContainerBase, ContentWithVerticalPadding, Content2Xl } from "components/misc/Layouts.js";
import { SectionHeading } from "components/misc/Headings.js";
import { SectionDescription } from "components/misc/Typography.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import logoImageSrc from "images/logo-sopan.png";
import dotPatternImageSrc from "images/dot-pattern.svg";

const PrimaryBackgroundContainer = tw.div`-mx-8 px-8 bg-primary-900 text-gray-100 relative overflow-hidden`;
const Header = tw(HeaderBase)`max-w-none -mt-8 py-8 -mx-8 px-8 relative z-20`;
const NavLink = tw(NavLinkBase)`lg:text-gray-100 lg:hocus:text-gray-300 lg:hocus:border-gray-100`;
const LogoLink = tw(LogoLinkBase)`text-gray-100 hocus:text-gray-300`;
const PrimaryLink = tw(PrimaryLinkBase)`shadow-raised lg:bg-primary-400 lg:hocus:bg-primary-500`;

const Container = tw(ContainerBase)`relative z-10`;

// Faint dotted texture in the background, gives the hero some studio/print depth without needing a photo
const DotPattern = styled.div`
  background-image: url(${dotPatternImageSrc});
  ${tw`absolute inset-0 opacity-10 pointer-events-none`}
  background-size: 24px 24px;
`;

const GlowBlob = styled.div`
  ${tw`absolute rounded-full bg-primary-500 opacity-15 blur-3xl pointer-events-none`}
`;

const Row = tw.div`flex items-center flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-8`;
const TextColumn = tw.div`text-center lg:text-left w-full lg:w-6/12`;
const VisualColumn = tw.div`w-full max-w-[220px] sm:max-w-[260px] lg:max-w-[300px] lg:w-5/12 flex justify-center`;

const RoleBadges = tw.div`flex flex-wrap justify-center lg:justify-start gap-2 mb-6`;
const RoleBadge = tw.span`text-xs sm:text-sm font-semibold tracking-wide px-3 py-1 rounded-full border border-primary-400 text-primary-100 bg-primary-800 bg-opacity-50`;

const Heading = tw(SectionHeading)`text-left lg:text-left max-w-none text-3xl sm:text-4xl lg:text-5xl leading-tight text-center lg:text-left`;
const Description = tw(SectionDescription)`mt-4 max-w-xl text-gray-100 text-sm sm:text-base mx-auto lg:mx-0 text-center lg:text-left`;

const ButtonRow = tw.div`mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4`;
const PrimaryButton = tw(PrimaryButtonBase)`w-full sm:w-auto text-sm sm:text-base px-6 py-4 sm:px-10 sm:py-5 bg-primary-400 inline-block text-center hocus:bg-primary-500`;
const SecondaryButton = tw.a`w-full sm:w-auto text-sm sm:text-base px-6 py-4 sm:px-10 sm:py-5 inline-block text-center font-bold rounded border-2 border-primary-300 text-gray-100 hocus:bg-primary-800 transition duration-300`;

/* ── Visual identity: a spinning vinyl record + a live-looking equalizer,
   both built with inline SVG/CSS so no external photo assets are needed. ── */

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const VinylWrapper = styled.div`
  ${tw`relative w-full aspect-square`}
`;

const VinylDisc = styled.svg`
  ${tw`w-full h-full drop-shadow-2xl`}
  animation: ${spin} 9s linear infinite;
`;

const barPulse = (delay) => keyframes`
  0%, 100% { transform: scaleY(0.25); }
  50% { transform: scaleY(1); }
`;

const EqualizerBar = styled.span`
  ${tw`inline-block w-[6px] sm:w-2 rounded-full bg-primary-300`}
  height: 28px;
  transform-origin: bottom;
  animation: ${(props) => barPulse(props.$delay)} ${(props) => props.$duration || "1s"} ease-in-out infinite;
  animation-delay: ${(props) => props.$delay || "0s"};
`;

const EqualizerRow = tw.div`flex items-end justify-center gap-[6px] sm:gap-2 mt-6`;

const Vinyl = () => (
  <VinylWrapper>
    <VinylDisc viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="98" fill="#16041f" />
      <circle cx="100" cy="100" r="98" fill="none" stroke="#3c0d99" strokeWidth="1" />
      <circle cx="100" cy="100" r="82" fill="none" stroke="#2a0a5c" strokeWidth="1.5" opacity="0.7" />
      <circle cx="100" cy="100" r="68" fill="none" stroke="#2a0a5c" strokeWidth="1.5" opacity="0.6" />
      <circle cx="100" cy="100" r="54" fill="none" stroke="#2a0a5c" strokeWidth="1.5" opacity="0.5" />
      <circle cx="100" cy="100" r="40" fill="#6415FF" />
      <circle cx="100" cy="100" r="40" fill="none" stroke="#a273ff" strokeWidth="1" />
      <circle cx="100" cy="100" r="6" fill="#16041f" />
    </VinylDisc>
  </VinylWrapper>
);

export default ({
  heading = "High Performant Servers tailored to your needs",
  description = "Our cloud provisions the best servers, with fast SSD, powerful Xeon Processors, whenever you need it. Oh, and we have 99.9% SLA",
  primaryButtonText = "Start Your 15 Day Free Trial",
  primaryButtonUrl = "#",
  secondaryButtonText = "Dengarkan Karya",
  secondaryButtonUrl = "/remix/karya",
  roleBadges = ["Producer", "Mixing Engineer", "Sound Engineer", "Remix Artist"],
}) => {
  const logoLink = (
    <LogoLink href="/">
      <img src={logoImageSrc} alt="Logo" />
      Sopan Team
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
    <PrimaryBackgroundContainer>
      <DotPattern />
      <GlowBlob css={tw`w-72 h-72 top-[-5rem] left-[-5rem]`} />
      <GlowBlob css={tw`w-96 h-96 bottom-[-8rem] right-[-6rem]`} />
      <Content2Xl>
        <Header logoLink={logoLink} links={navLinks} />
        <Container>
          <ContentWithVerticalPadding>
            <Row>
              <TextColumn>
                <RoleBadges>
                  {roleBadges.map((role, i) => (
                    <RoleBadge key={i}>{role}</RoleBadge>
                  ))}
                </RoleBadges>
                <Heading>{heading}</Heading>
                <Description>{description}</Description>
                <ButtonRow>
                  <PrimaryButton as="a" href={primaryButtonUrl}>{primaryButtonText}</PrimaryButton>
                  <SecondaryButton href={secondaryButtonUrl}>{secondaryButtonText}</SecondaryButton>
                </ButtonRow>
              </TextColumn>
              <VisualColumn>
                <div tw="w-full">
                  <Vinyl />
                  <EqualizerRow>
                    <EqualizerBar $delay="0s" $duration="0.9s" />
                    <EqualizerBar $delay="0.15s" $duration="1.1s" />
                    <EqualizerBar $delay="0.3s" $duration="0.8s" />
                    <EqualizerBar $delay="0.45s" $duration="1.2s" />
                    <EqualizerBar $delay="0.1s" $duration="1s" />
                    <EqualizerBar $delay="0.25s" $duration="0.95s" />
                  </EqualizerRow>
                </div>
              </VisualColumn>
            </Row>
          </ContentWithVerticalPadding>
        </Container>
      </Content2Xl>
    </PrimaryBackgroundContainer>
  );
};
