import React from "react";
import { useParams, Link } from "react-router-dom";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import { remixMembers } from "./MembersRemix.js";

// ─────────────────────────────────────────────────────────────────────────────
// VIEW PROFILE MEMBER: SOPAN REMIX (/remix/members/:id)
//
// Self-check: Apakah ada padanan di template?
// → TIDAK ADA. Tidak ada komponen "single member profile page" di src/components/
//   maupun src/pages/. Ini satu-satunya file baru karena memang tidak ada padanannya.
//
// Basis visual (sesuai ATURAN #2):
//   - Container, ContentWithPaddingXl dari Layouts.js
//   - SectionHeading, Subheading dari Headings.js
//   - PrimaryButton dari Buttons.js
//   - Struktur tata letak mengacu pada ThreeColContactDetails.js (foto + info samping)
//   - Warna, border-radius, spacing IDENTIK dengan tema template
// ─────────────────────────────────────────────────────────────────────────────

const Subheading = tw(SubheadingBase)`mb-4 text-center`;
const Heading = tw(SectionHeading)`mb-8`;

const ProfileCard = styled.div`
  ${tw`flex flex-col md:flex-row items-center md:items-start bg-white rounded-lg shadow-lg p-8 md:p-12 max-w-4xl mx-auto`}
`;

const PhotoContainer = styled.div`
  ${props => `background-image: url("${props.imageSrc}");`}
  ${tw`w-48 h-48 md:w-64 md:h-64 bg-cover bg-center rounded flex-shrink-0`}
`;

const InfoContainer = tw.div`mt-8 md:mt-0 md:ml-10 flex flex-col`;

const MemberName = tw.h2`text-3xl font-black text-gray-900`;
const MemberPosition = tw.span`uppercase font-bold tracking-widest text-xs text-primary-500 mt-2 block`;
const MemberBio = tw.p`mt-4 text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;

const DetailRow = styled.div`
  ${tw`flex items-center mt-3`}
`;
const DetailLabel = tw.span`font-bold text-gray-700 w-32 text-sm flex-shrink-0`;
const DetailValue = tw.span`text-gray-600 text-sm`;

const Divider = tw.div`my-6 border-b-2 border-gray-200`;

const WorksSection = tw.div`mt-4`;
const WorksTitle = tw.h5`font-bold text-gray-700 text-sm uppercase tracking-wider mb-3`;
const WorkTag = tw.span`inline-block bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full mr-2 mb-2`;

const ButtonsRow = tw.div`mt-8 flex flex-col sm:flex-row gap-4`;
const PrimaryButton = tw(PrimaryButtonBase)`text-sm`;
const SecondaryButton = styled.a`
  ${tw`px-8 py-3 rounded bg-gray-200 text-gray-800 font-bold text-sm hover:bg-gray-300 transition duration-300 text-center`}
`;

const NotFoundContainer = tw.div`text-center py-20`;

export default () => {
  const { id } = useParams();
  // PLACEHOLDER - data diambil dari array member roster; di produksi nyata ini dari database
  const member = remixMembers.find(m => m.id === id);

  if (!member) {
    return (
      <AnimationRevealPage>
        <Container>
          <ContentWithPaddingXl>
            <NotFoundContainer>
              <Heading>Member Tidak Ditemukan</Heading>
              <SecondaryButton href="/remix/members">
                ← Kembali ke Member Roster
              </SecondaryButton>
            </NotFoundContainer>
          </ContentWithPaddingXl>
        </Container>
      </AnimationRevealPage>
    );
  }

  return (
    <AnimationRevealPage>
      <Container>
        <ContentWithPaddingXl>

          <Subheading>Sopan Remix</Subheading>
          <Heading>Profil Member</Heading>

          <ProfileCard>

            {/* Foto — pakai foto placeholder yang sama seperti di roster */}
            <PhotoContainer imageSrc={member.imageSrc} />

            <InfoContainer>

              {/* Nama & Role */}
              <MemberName>{member.name}</MemberName>{/* PLACEHOLDER */}
              <MemberPosition>{member.position}</MemberPosition>{/* PLACEHOLDER */}

              {/* Bio singkat */}
              <MemberBio>{member.bio}</MemberBio>{/* PLACEHOLDER */}

              <Divider />

              {/* Detail info */}
              <DetailRow>
                <DetailLabel>Bergabung</DetailLabel>
                <DetailValue>{member.joinDate}</DetailValue>{/* PLACEHOLDER */}
              </DetailRow>
              <DetailRow>
                <DetailLabel>TikTok / IG</DetailLabel>
                <DetailValue>
                  <a
                    href={`https://www.tiktok.com/${member.socialMedia}`}
                    target="_blank"
                    rel="noreferrer"
                    tw="text-primary-500 hover:text-primary-700"
                  >
                    {member.socialMedia}
                  </a>
                </DetailValue>{/* PLACEHOLDER — field ini representasi data dari form Join */}
              </DetailRow>
              <DetailRow>
                <DetailLabel>Divisi</DetailLabel>
                <DetailValue>Sopan Remix</DetailValue>
              </DetailRow>

              {/* Karya placeholder */}
              {member.works && member.works.length > 0 && (
                <WorksSection>
                  <Divider />
                  <WorksTitle>Karya Pilihan</WorksTitle>
                  {member.works.map((work, i) => (
                    <WorkTag key={i}>{work}</WorkTag>/* PLACEHOLDER */
                  ))}
                </WorksSection>
              )}

              {/* Tombol aksi */}
              <ButtonsRow>
                <PrimaryButton as="a" href="/remix/join">
                  Join Sopan Remix
                </PrimaryButton>
                <SecondaryButton href="/remix/members">
                  ← Kembali ke Member Roster
                </SecondaryButton>
              </ButtonsRow>

            </InfoContainer>
          </ProfileCard>

        </ContentWithPaddingXl>
      </Container>
    </AnimationRevealPage>
  );
};
