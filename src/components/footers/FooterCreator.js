import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line

import LogoImage from "images/logo-light.svg";
import { ReactComponent as FacebookIcon } from "images/facebook-icon.svg";
import { ReactComponent as TwitterIcon } from "images/twitter-icon.svg";
import { ReactComponent as YoutubeIcon } from "images/youtube-icon.svg";
import { ReactComponent as SvgDecoratorBlob1 } from "images/svg-decorator-blob-9.svg";

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER: SOPAN CREATOR
// Basis: FiveColumnWithBackground.js — struktur identik, konten diubah untuk Creator
// Link TikTok: https://www.tiktok.com/@teamsopanofficial
// ─────────────────────────────────────────────────────────────────────────────

const Container = tw.div`relative bg-primary-500 text-gray-100 -mb-8 -mx-8 px-8 py-20 lg:py-24`;
const Content = tw.div`max-w-screen-xl mx-auto relative z-10`;
const FiveColumns = tw.div`flex flex-wrap text-center sm:text-left justify-center sm:justify-start md:justify-between -mt-12`;

const Column = tw.div`px-4 sm:px-0 sm:w-1/3 md:w-auto mt-12`;

const ColumnHeading = tw.h5`uppercase font-bold`;

const LinkList = tw.ul`mt-6 text-sm font-medium`;
const LinkListItem = tw.li`mt-3`;
const Link = tw.a`border-b-2 border-transparent hocus:border-gray-100 pb-1 transition duration-300`;

const Divider = tw.div`my-16 border-b-2 border-primary-400 w-full`;

const ThreeColRow = tw.div`flex flex-col md:flex-row items-center justify-between`;

const LogoContainer = tw.div`flex items-center justify-center md:justify-start`;
const LogoImg = tw.img`w-8`;
const LogoText = tw.h5`ml-2 text-xl font-black tracking-wider text-gray-100`;

const CopywrightNotice = tw.p`text-center text-sm sm:text-base mt-8 md:mt-0 font-medium text-gray-400`;

const SocialLinksContainer = tw.div`mt-8 md:mt-0 flex`;
const SocialLink = styled.a`
  ${tw`cursor-pointer p-2 rounded-full bg-gray-100 text-gray-900 hover:bg-gray-400 transition duration-300 mr-4 last:mr-0`}
  svg {
    ${tw`w-4 h-4`}
  }
`;

const DecoratorBlobContainer = tw.div`absolute inset-0 overflow-hidden rounded-lg`;
const DecoratorBlob1 = tw(
  SvgDecoratorBlob1
)`absolute top-0 left-0 w-80 h-80 transform -translate-x-20 -translate-y-32 text-primary-700 opacity-50`;
const DecoratorBlob2 = tw(
  SvgDecoratorBlob1
)`absolute bottom-0 right-0 w-80 h-80 transform  translate-x-32 translate-y-48 text-primary-700 opacity-50`;

export default () => {
  return (
    <Container>
      <Content>
        <FiveColumns>
          <Column>
            <ColumnHeading>Navigasi</ColumnHeading>
            <LinkList>
              <LinkListItem>
                <Link href="/creator">Beranda Creator</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="/creator/members">Member Roster</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="/creator/join">Daftar</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="/creator/login">Sign In</Link>
              </LinkListItem>
            </LinkList>
          </Column>
          <Column>
            <ColumnHeading>Divisi Lain</ColumnHeading>
            <LinkList>
              <LinkListItem>
                <Link href="/">Hub Sopan Team</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="/remix">Sopan Remix</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="/leadies">Sopan Leadies</Link>
              </LinkListItem>
            </LinkList>
          </Column>
          <Column>
            <ColumnHeading>Bergabung</ColumnHeading>
            <LinkList>
              <LinkListItem>
                <Link href="/creator/join">Daftar Jadi Member</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="/creator/login">Login Member</Link>
              </LinkListItem>
            </LinkList>
          </Column>
          <Column>
            <ColumnHeading>Media Sosial</ColumnHeading>
            <LinkList>
              <LinkListItem>
                <Link href="https://www.tiktok.com/@teamsopanofficial" target="_blank" rel="noreferrer">
                  TikTok @teamsopanofficial
                </Link>
              </LinkListItem>
            </LinkList>
          </Column>
        </FiveColumns>
        <Divider />
        <ThreeColRow>
          <LogoContainer>
            <LogoImg src={LogoImage} />
            <LogoText>Sopan Creator</LogoText>
          </LogoContainer>
          <CopywrightNotice>© 2024 Sopan Creator. Bagian dari Sopan Team.</CopywrightNotice>
          <SocialLinksContainer>
            <SocialLink href="https://www.tiktok.com/@teamsopanofficial" target="_blank" rel="noreferrer">
              <FacebookIcon />
            </SocialLink>
            <SocialLink href="https://www.tiktok.com/@teamsopanofficial" target="_blank" rel="noreferrer">
              <TwitterIcon />
            </SocialLink>
            <SocialLink href="https://www.tiktok.com/@teamsopanofficial" target="_blank" rel="noreferrer">
              <YoutubeIcon />
            </SocialLink>
          </SocialLinksContainer>
        </ThreeColRow>
      </Content>
      <DecoratorBlobContainer>
        <DecoratorBlob1 />
        <DecoratorBlob2 />
      </DecoratorBlobContainer>
    </Container>
  );
};
