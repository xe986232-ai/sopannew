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
import { ReactComponent as SvgDecoratorBlob } from "images/svg-decorator-blob-6.svg";
import LogoSopanImage from "images/logo-sopan.png";

// ─────────────────────────────────────────────────────────────────────────────
// HUB — SOPAN TEAM (/)
// Halaman index yang menampilkan pilihan divisi Sopan Team.
// Data disusun jadi satu array `divisions` di bawah supaya gampang diubah
// statusnya (misalnya kalau Sopan Creator sudah siap, tinggal ganti
// status: "active" dan isi field `to`-nya).
// ─────────────────────────────────────────────────────────────────────────────

const Hero = styled.div`
  ${tw`relative -mt-8 -mx-8 px-8 pt-20 pb-24 lg:pt-24 lg:pb-32 bg-primary-900 overflow-hidden text-center`}
`;

const HeroDotPattern = styled(SvgDotPattern)`
  ${tw`absolute pointer-events-none -z-10 opacity-25 text-primary-500 top-0 right-0 w-56 h-56 transform translate-x-1/2 -translate-y-1/2`}
`;

const HeroBlob = styled(SvgDecoratorBlob)`
  ${tw`absolute pointer-events-none -z-10 opacity-10 text-primary-100 bottom-0 left-0 w-96 h-96 transform -translate-x-1/2 translate-y-1/2`}
`;

const Logo = styled.img`
  ${tw`h-12 sm:h-16 mx-auto mb-10 select-none`}
`;

const Eyebrow = tw.span`inline-block text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold text-primary-300 mb-5`;

const HeroHeading = tw.h1`text-3xl sm:text-4xl lg:text-5xl font-black text-gray-100 leading-tight max-w-2xl mx-auto`;

const HeroDescription = tw.p`mt-6 text-base sm:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed`;

const Content = tw.div`max-w-screen-lg mx-auto py-16 lg:py-20`;

const DivisionList = tw.div`flex flex-col`;

const rowBaseStyles = tw`
  relative grid grid-cols-12 items-center gap-4 sm:gap-6
  py-8 sm:py-10 px-4 -mx-4 sm:px-6 sm:-mx-6 rounded-xl
  border-b border-gray-200 last:border-none
`;

const DivisionRow = styled(Link)`
  ${rowBaseStyles}
  ${tw`no-underline transition-colors duration-300 hocus:bg-gray-100`}
`;

const DivisionRowDisabled = styled.div`
  ${rowBaseStyles}
  ${tw`opacity-50 cursor-not-allowed`}
`;

const Index = styled.span`
  ${tw`col-span-2 sm:col-span-1 text-3xl sm:text-4xl font-black text-gray-200 transition-colors duration-300`}
  ${props => props.$active && tw`group-hocus:text-primary-500`}
`;

const IconCircle = styled.div`
  ${tw`hidden sm:flex col-span-2 w-16 h-16 rounded-full items-center justify-center border-2 transition-colors duration-300`}
  ${props => (props.$active ? tw`border-gray-300 text-gray-500 group-hocus:border-primary-500 group-hocus:text-primary-500` : tw`border-gray-200 text-gray-300`)}
`;

const TextBlock = tw.div`col-span-8 sm:col-span-6`;

const DivisionName = styled.h3`
  ${tw`text-lg sm:text-2xl font-bold leading-snug`}
  ${props => (props.$active ? tw`text-gray-900` : tw`text-gray-400`)}
`;

const DivisionDescription = tw.p`mt-1 text-sm text-gray-500 leading-relaxed hidden sm:block`;

const StatusColumn = tw.div`col-span-2 sm:col-span-3 flex justify-end`;

const ActiveTag = styled.span`
  ${tw`hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-gray-700 transition-all duration-300 group-hocus:text-primary-500 group-hocus:gap-3`}
  svg {
    ${tw`w-4 h-4`}
  }
`;

const ActiveArrowMobile = tw.span`sm:hidden inline-flex text-gray-400`;

const SoonTag = tw.span`text-[10px] sm:text-xs uppercase tracking-widest font-bold text-gray-400 border border-gray-200 rounded-full px-3 py-2 whitespace-nowrap`;

const FootNote = tw.p`mt-6 pt-10 border-t border-gray-100 text-center text-sm text-gray-400`;

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
        <Logo src={LogoSopanImage} alt="Sopan Team" />
        <Eyebrow>Sopan Team</Eyebrow>
        <HeroHeading>Satu keluarga, tiga divisi kreatif.</HeroHeading>
        <HeroDescription>
          Pilih divisi untuk melihat karya, member, dan cara bergabung.
        </HeroDescription>
      </Hero>

      <Content>
        <DivisionList>
          {divisions.map((division, index) => {
            const isActive = division.status === "active";
            const Icon = division.icon;
            const order = String(index + 1).padStart(2, "0");

            const rowContent = (
              <>
                <Index $active={isActive}>{order}</Index>
                <IconCircle $active={isActive}>
                  <Icon tw="w-6 h-6" />
                </IconCircle>
                <TextBlock>
                  <DivisionName $active={isActive}>{division.name}</DivisionName>
                  <DivisionDescription>{division.description}</DivisionDescription>
                </TextBlock>
                <StatusColumn>
                  {isActive ? (
                    <>
                      <ActiveTag>
                        Lihat Divisi
                        <ArrowRightIcon />
                      </ActiveTag>
                      <ActiveArrowMobile>
                        <ArrowRightIcon tw="w-5 h-5" />
                      </ActiveArrowMobile>
                    </>
                  ) : (
                    <SoonTag>Segera Hadir</SoonTag>
                  )}
                </StatusColumn>
              </>
            );

            if (isActive) {
              return (
                <DivisionRow key={division.name} to={division.to} className="group">
                  {rowContent}
                </DivisionRow>
              );
            }

            return (
              <DivisionRowDisabled key={division.name} aria-disabled="true">
                {rowContent}
              </DivisionRowDisabled>
            );
          })}
        </DivisionList>

        <FootNote>
          Divisi baru akan terus ditambahkan seiring berkembangnya Sopan Team.
        </FootNote>
      </Content>
    </AnimationRevealPage>
  );
};
