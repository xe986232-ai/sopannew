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
import { ReactComponent as LockIcon } from "feather-icons/dist/icons/lock.svg";
import { ReactComponent as SvgDotPattern } from "images/dot-pattern.svg";

// ─────────────────────────────────────────────────────────────────────────────
// HUB — SOPAN TEAM (/)
// Terinspirasi dari pola "image card" yang dipakai di komponen template
// (lihat components/cards/PortfolioTwoCardsWithImage.js & TabCardGrid.js
// yang dipakai di src/demos/*LandingPage.js): kartu bergambar dengan overlay
// gradasi gelap dan teks di atasnya, bukan kartu polos.
//
// Data disusun jadi satu array `divisions` di bawah supaya gampang diubah
// statusnya (misalnya kalau Sopan Creator sudah siap, tinggal ganti
// status: "active" dan isi field `to`-nya).
// ─────────────────────────────────────────────────────────────────────────────

const heroImage =
  "https://images.unsplash.com/photo-1522071901873-411886a10004?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80";

const divisions = [
  {
    name: "Sopan Remix",
    description: "Produksi musik, mixing, mastering, dan sound engineering.",
    icon: MusicIcon,
    status: "active",
    to: "/remix",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Sopan Creator",
    description: "Editing video gaya jedag-jedug menggunakan Alight Motion.",
    icon: FilmIcon,
    status: "coming-soon",
    image:
      "https://images.unsplash.com/photo-1536300007881-7e482242baa5?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Sopan Leadies",
    description: "Editing video jedag-jedug khusus member perempuan.",
    icon: UsersIcon,
    status: "coming-soon",
    image:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
  },
];

// ── Hero ─────────────────────────────────────────────────────────────────

const HeroSection = styled.div`
  ${tw`relative -mt-8 -mx-8 px-6 sm:px-8 pt-24 pb-24 sm:pt-32 sm:pb-32 overflow-hidden text-center bg-center bg-cover`}
  background-image: linear-gradient(180deg, rgba(18, 8, 48, 0.88) 0%, rgba(12, 5, 32, 0.96) 100%),
    url("${heroImage}");
`;

const HeroDotPattern = styled(SvgDotPattern)`
  ${tw`absolute pointer-events-none -z-10 opacity-15 text-primary-300 top-0 right-0 w-56 h-56 transform translate-x-1/2 -translate-y-1/2`}
`;

const Eyebrow = tw.span`inline-block text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold text-primary-300 mb-4`;

const HeroHeading = tw.h1`text-3xl sm:text-4xl lg:text-5xl font-black text-gray-100 leading-tight max-w-2xl mx-auto`;

const HeroDescription = tw.p`mt-5 text-sm sm:text-base lg:text-lg text-gray-300 max-w-md sm:max-w-xl mx-auto leading-relaxed`;

// ── Cards section ───────────────────────────────────────────────────────

const Section = tw.div`relative -mx-8 px-6 sm:px-8 pt-12 pb-16 sm:pt-16 sm:pb-24 bg-gray-100`;

const Inner = tw.div`max-w-screen-xl mx-auto`;

const Grid = tw.div`grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8`;

const CardShell = styled(Link)`
  ${tw`relative block rounded-2xl overflow-hidden h-80 sm:h-96 no-underline transition-transform duration-300 hocus:-translate-y-1`}
`;

const CardShellDisabled = styled.div`
  ${tw`relative block rounded-2xl overflow-hidden h-80 sm:h-96`}
`;

const CardImg = styled.img`
  ${tw`absolute inset-0 w-full h-full object-cover transition-transform duration-500`}
  ${props => (props.$active ? tw`group-hocus:scale-110` : "")}
  ${props => (!props.$active ? "filter: grayscale(1) brightness(0.55);" : "")}
`;

const CardOverlay = styled.div`
  ${tw`absolute inset-0`}
  background: linear-gradient(180deg, rgba(15, 6, 41, 0.05) 25%, rgba(12, 5, 32, 0.92) 100%);
`;

const CardBadge = styled.span`
  ${tw`absolute inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold px-3 py-2 rounded-full`}
  top: 1rem;
  right: 1rem;
  ${props =>
    props.$active
      ? tw`bg-primary-500 text-gray-100`
      : css`
          background: rgba(17, 24, 39, 0.65);
          ${tw`text-gray-300`}
        `}
  svg {
    ${tw`w-3 h-3`}
  }
`;

const CardContent = tw.div`absolute inset-x-0 bottom-0 p-5 sm:p-6 text-left`;

const CardIconCircle = styled.div`
  ${tw`w-10 h-10 rounded-full flex items-center justify-center mb-3`}
  ${props => (props.$active ? tw`bg-primary-500 text-gray-100` : tw`bg-gray-800 text-gray-400`)}
  svg {
    ${tw`w-4 h-4`}
  }
`;

const CardTitle = tw.h3`text-lg sm:text-xl font-bold text-gray-100`;

const CardDescription = styled.p`
  ${tw`mt-1 text-xs sm:text-sm leading-relaxed`}
  ${props => (props.$active ? tw`text-gray-300` : tw`text-gray-400`)}
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const CardCta = styled.div`
  ${tw`mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-100 transition-all duration-300`}
  svg {
    ${tw`w-4 h-4 transition-transform duration-300`}
  }
`;

const FootNote = tw.p`mt-10 sm:mt-12 text-center text-xs sm:text-sm text-gray-400`;

export default () => {
  return (
    <AnimationRevealPage>
      <HeroSection>
        <HeroDotPattern />
        <Eyebrow>Sopan Team</Eyebrow>
        <HeroHeading>Satu keluarga, tiga divisi kreatif.</HeroHeading>
        <HeroDescription>
          Pilih divisi untuk melihat karya, member, dan cara bergabung.
        </HeroDescription>
      </HeroSection>

      <Section>
        <Inner>
          <Grid>
            {divisions.map((division) => {
              const isActive = division.status === "active";
              const Icon = division.icon;

              const cardInner = (
                <>
                  <CardImg src={division.image} alt={division.name} $active={isActive} />
                  <CardOverlay />
                  <CardBadge $active={isActive}>
                    {isActive ? null : <LockIcon />}
                    {isActive ? "Aktif" : "Segera Hadir"}
                  </CardBadge>
                  <CardContent>
                    <CardIconCircle $active={isActive}>
                      <Icon />
                    </CardIconCircle>
                    <CardTitle>{division.name}</CardTitle>
                    <CardDescription $active={isActive}>{division.description}</CardDescription>
                    {isActive && (
                      <CardCta className="cta">
                        Lihat Divisi
                        <ArrowRightIcon />
                      </CardCta>
                    )}
                  </CardContent>
                </>
              );

              if (isActive) {
                return (
                  <CardShell key={division.name} to={division.to} className="group">
                    {cardInner}
                  </CardShell>
                );
              }

              return (
                <CardShellDisabled key={division.name} aria-disabled="true">
                  {cardInner}
                </CardShellDisabled>
              );
            })}
          </Grid>

          <FootNote>
            Divisi baru akan terus ditambahkan seiring berkembangnya Sopan Team.
          </FootNote>
        </Inner>
      </Section>
    </AnimationRevealPage>
  );
};
