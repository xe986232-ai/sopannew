import React from "react";
import { Link } from "react-router-dom";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { ReactComponent as MusicIcon } from "feather-icons/dist/icons/music.svg";
import { ReactComponent as FilmIcon } from "feather-icons/dist/icons/film.svg";
import { ReactComponent as UsersIcon } from "feather-icons/dist/icons/users.svg";
import { ReactComponent as ArrowRightIcon } from "feather-icons/dist/icons/arrow-right.svg";
import { ReactComponent as SvgDotPattern } from "images/dot-pattern.svg";
import { ReactComponent as SvgDecoratorBlob1 } from "images/svg-decorator-blob-6.svg";

// ─────────────────────────────────────────────────────────────────────────────
// HUB — SOPAN TEAM (/)
// Halaman index yang menampilkan pilihan divisi Sopan Team.
// Data disusun jadi satu array `divisions` di bawah supaya gampang diubah
// statusnya (misalnya kalau Sopan Creator sudah siap, tinggal ganti
// status: "active" dan isi field `to`-nya).
// ─────────────────────────────────────────────────────────────────────────────

const Hero = styled.div`
  ${tw`relative -mt-8 -mx-8 px-6 sm:px-8 pt-16 pb-16 sm:pt-20 sm:pb-20 bg-primary-900 overflow-hidden text-center`}
`;

const HeroDotPattern = styled(SvgDotPattern)`
  ${tw`absolute pointer-events-none -z-10 opacity-25 text-primary-500 top-0 right-0 w-56 h-56 transform translate-x-1/2 -translate-y-1/2`}
`;

const HeroBlob = styled(SvgDecoratorBlob1)`
  ${tw`absolute pointer-events-none -z-10 opacity-15 text-primary-500 bottom-0 left-0 w-80 h-80 transform -translate-x-1/2 translate-y-1/2`}
`;

const Badge = styled.div`
  ${tw`w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary-500 flex items-center justify-center shadow-raised`}
`;

const BadgeLetter = tw.span`text-2xl font-black text-gray-100`;

const Eyebrow = tw.span`inline-block text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold text-primary-300 mb-4`;

const HeroHeading = tw.h1`text-3xl sm:text-4xl lg:text-5xl font-black text-gray-100 leading-tight max-w-2xl mx-auto`;

const HeroDescription = tw.p`mt-5 text-sm sm:text-base lg:text-lg text-gray-400 max-w-md sm:max-w-xl mx-auto leading-relaxed`;

const Content = styled.div`
  ${tw`relative -mx-8 px-8 pt-12 pb-16 sm:pt-16 sm:pb-20 bg-gray-100`}
`;

const Inner = tw.div`max-w-screen-lg mx-auto`;

const DivisionList = tw.div`flex flex-col gap-4 sm:gap-5`;

const cardBaseStyles = tw`
  relative flex items-center gap-4 sm:gap-6
  bg-gray-100 rounded-2xl p-5 sm:p-6
  border border-gray-200
`;

const DivisionCard = styled(Link)`
  ${cardBaseStyles}
  ${tw`bg-white no-underline transition-all duration-300 hocus:shadow-raised hocus:-translate-y-1 hocus:border-primary-300`}
`;

const DivisionCardDisabled = styled.div`
  ${cardBaseStyles}
  ${tw`bg-white`}
`;

const IconCircle = styled.div`
  ${tw`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-colors duration-300`}
  ${props => (props.$active ? tw`bg-primary-100 text-primary-600` : tw`bg-gray-200 text-gray-400`)}
`;

const TextBlock = tw.div`flex-1 min-w-0`;

const TitleRow = tw.div`flex items-center gap-2 flex-wrap`;

const DivisionName = styled.h3`
  ${tw`text-base sm:text-xl font-bold leading-snug`}
  ${props => (props.$active ? tw`text-gray-900` : tw`text-gray-400`)}
`;

const SoonTag = tw.span`text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-gray-400 bg-gray-100 rounded-full px-3 py-1 whitespace-nowrap`;

const DivisionDescription = styled.p`
  ${tw`mt-1 text-xs sm:text-sm leading-relaxed`}
  ${props => (props.$active ? tw`text-gray-500` : tw`text-gray-400`)}
`;

const ArrowCircle = styled.div`
  ${tw`hidden sm:flex flex-shrink-0 w-10 h-10 rounded-full items-center justify-center border-2 border-gray-200 text-gray-400 transition-all duration-300`}
  ${props => props.$active && tw`group-hocus:border-primary-500 group-hocus:text-primary-500 group-hocus:translate-x-1`}
  svg {
    ${tw`w-4 h-4`}
  }
`;

const FootNote = tw.p`mt-10 sm:mt-12 pt-8 border-t border-gray-200 text-center text-xs sm:text-sm text-gray-400`;

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
      <Hero>
        <HeroDotPattern />
        <HeroBlob />
        <Badge>
          <BadgeLetter>S</BadgeLetter>
        </Badge>
        <Eyebrow>Sopan Team</Eyebrow>
        <HeroHeading>Satu keluarga, tiga divisi kreatif.</HeroHeading>
        <HeroDescription>
          Pilih divisi untuk melihat karya, member, dan cara bergabung.
        </HeroDescription>
      </Hero>

      <Content>
        <Inner>
          <DivisionList>
            {divisions.map((division) => {
              const isActive = division.status === "active";
              const Icon = division.icon;

              const cardContent = (
                <>
                  <IconCircle $active={isActive}>
                    <Icon className={tw`w-5 h-5 sm:w-6 sm:h-6`} />
                  </IconCircle>
                  <TextBlock>
                    <TitleRow>
                      <DivisionName $active={isActive}>{division.name}</DivisionName>
                      {!isActive && <SoonTag>Segera Hadir</SoonTag>}
                    </TitleRow>
                    <DivisionDescription $active={isActive}>
                      {division.description}
                    </DivisionDescription>
                  </TextBlock>
                  {isActive && (
                    <ArrowCircle $active={isActive}>
                      <ArrowRightIcon />
                    </ArrowCircle>
                  )}
                </>
              );

              if (isActive) {
                return (
                  <DivisionCard key={division.name} to={division.to} className="group">
                    {cardContent}
                  </DivisionCard>
                );
              }

              return (
                <DivisionCardDisabled key={division.name} aria-disabled="true">
                  {cardContent}
                </DivisionCardDisabled>
              );
            })}
          </DivisionList>

          <FootNote>
            Divisi baru akan terus ditambahkan seiring berkembangnya Sopan Team.
          </FootNote>
        </Inner>
      </Content>
    </AnimationRevealPage>
  );
};
