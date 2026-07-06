import React from "react";
import tw from "twin.macro";
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

const PrimaryBackgroundContainer = tw.div`-mx-8 px-8 bg-primary-900 text-gray-100`;
const Header = tw(HeaderBase)`max-w-none -mt-8 py-8 -mx-8 px-8`;
const NavLink = tw(NavLinkBase)`lg:text-gray-100 lg:hocus:text-gray-300 lg:hocus:border-gray-100`;
const LogoLink = tw(LogoLinkBase)`text-gray-100 hocus:text-gray-300`;
const PrimaryLink = tw(PrimaryLinkBase)`shadow-raised lg:bg-primary-400 lg:hocus:bg-primary-500`;

const Container = tw(ContainerBase)``;
const Row = tw.div`flex items-center flex-col`;
const TextColumn = tw.div`text-center`;
const Heading = tw(SectionHeading)`max-w-3xl lg:max-w-4xl leading-tight`;
const Description = tw(SectionDescription)`mt-4 max-w-2xl text-gray-100 lg:text-base mx-auto`;
const PrimaryButton = tw(PrimaryButtonBase)`mt-8 text-sm sm:text-base px-6 py-5 sm:px-10 sm:py-5 bg-primary-400 inline-block hocus:bg-primary-500`;

export default ({
  heading = "High Performant Servers tailored to your needs",
  description = "Our cloud provisions the best servers, with fast SSD, powerful Xeon Processors, whenever you need it. Oh, and we have 99.9% SLA",
  primaryButtonText = "Start Your 15 Day Free Trial",
  primaryButtonUrl = "#",
  showPrimaryButton = true, // set false buat sembunyiin tombol CTA (mis. kalau user sudah login)
  links, // opsional: kalau dioper dari halaman pemanggil (mis. HostingCloudLandingPage.js
         // buat navbar login-aware), dipakai. Kalau tidak, fallback ke defaultNavLinks di bawah
         // (perilaku lama, tidak berubah buat halaman lain yang belum butuh custom links).
  logoLabel = "Sopan Team", // opsional: teks/JSX di sebelah logo navbar. Bisa diisi string biasa
                            // atau elemen JSX custom (mis. buat kasih warna beda per kata) — kalau
                            // tidak dioper, tetap "Sopan Team" polos seperti sebelumnya.
}) => {
  const logoLink = (
    <LogoLink href="/">
      <img src={logoImageSrc} alt="Logo" />
      {logoLabel}
    </LogoLink>
  );
  const defaultNavLinks = [
  <NavLinks key={1}>
    <NavLink href="/remix">Home</NavLink>
    <NavLink href="/remix/members">Member</NavLink>
    <NavLink href="/remix/login">Login</NavLink>
    <PrimaryLink href="/remix/join">Join Sekarang</PrimaryLink>
  </NavLinks>
];
  const navLinks = links || defaultNavLinks;
  return (
    <PrimaryBackgroundContainer>
      <Content2Xl>
        <Header logoLink={logoLink} links={navLinks} />
        <Container>
          <ContentWithVerticalPadding>
            <Row>
              <TextColumn>
                <Heading>{heading}</Heading>
                <Description>{description}</Description>
                {showPrimaryButton && (
                  <PrimaryButton as="a" href={primaryButtonUrl}>{primaryButtonText}</PrimaryButton>
                )}
              </TextColumn>
            </Row>
          </ContentWithVerticalPadding>
        </Container>
      </Content2Xl>
    </PrimaryBackgroundContainer>
  );
};
