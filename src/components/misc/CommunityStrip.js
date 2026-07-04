import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line

import { ReactComponent as TiktokIcon } from "images/tiktok-icon.svg";
import { ReactComponent as YoutubeIcon } from "images/youtube-icon.svg";

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: Community Strip
// Ditaruh tepat di bawah Hero untuk menegaskan "vibe" komunitas remix — genre
// tags yang digarap member + ajakan follow TikTok/YouTube. Full-bleed dark
// band, dibuat mobile-first (chip wrap, icon row center di layar kecil).
// ─────────────────────────────────────────────────────────────────────────────

const Container = tw.div`-mx-8 px-8 bg-secondary-900 text-gray-100`;
const Content = tw.div`max-w-screen-xl mx-auto py-8 sm:py-10 flex flex-col lg:flex-row items-center justify-between gap-6`;

const TagsWrapper = tw.div`w-full lg:w-auto`;
const TagsLabel = tw.p`text-xs sm:text-sm text-gray-400 font-semibold tracking-wide uppercase mb-3 text-center lg:text-left`;
const Tags = tw.div`flex flex-wrap justify-center lg:justify-start gap-2`;
const Tag = tw.span`text-xs sm:text-sm px-3 py-[6px] rounded-full bg-primary-900 text-primary-100 border border-primary-700 font-medium`;

const SocialWrapper = tw.div`flex flex-col items-center lg:items-end gap-3 shrink-0`;
const SocialLabel = tw.p`text-xs sm:text-sm text-gray-400 font-semibold tracking-wide uppercase`;
const SocialLinks = tw.div`flex gap-4`;

const SocialLink = styled.a`
  ${tw`flex items-center justify-center w-[44px] h-[44px] sm:w-12 sm:h-12 rounded-full bg-gray-800 text-gray-100 transition duration-300 hocus:bg-primary-500 hocus:text-gray-100`}
  svg {
    ${tw`w-5 h-5 sm:w-6 sm:h-6 fill-current`}
  }
`;

export default ({
  genres = ["Lo-fi", "Trap", "EDM", "Pop", "Hip-Hop", "Acoustic", "R&B", "Remix & Bootleg"],
  tiktokUrl = "https://www.tiktok.com/@team.sopan.remix",
  youtubeUrl = "https://www.tiktok.com/@team.sopan.remix",
}) => (
  <Container>
    <Content>
      <TagsWrapper>
        <TagsLabel>Genre yang digarap member kami</TagsLabel>
        <Tags>
          {genres.map((genre, i) => (
            <Tag key={i}>{genre}</Tag>
          ))}
        </Tags>
      </TagsWrapper>
      <SocialWrapper>
        <SocialLabel>Dengarkan karya terbaru</SocialLabel>
        <SocialLinks>
          <SocialLink href={tiktokUrl} target="_blank" rel="noreferrer" aria-label="TikTok Sopan Remix">
            <TiktokIcon />
          </SocialLink>
          <SocialLink href={youtubeUrl} target="_blank" rel="noreferrer" aria-label="YouTube Sopan Remix">
            <YoutubeIcon />
          </SocialLink>
        </SocialLinks>
      </SocialWrapper>
    </Content>
  </Container>
);
