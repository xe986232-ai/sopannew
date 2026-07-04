import React from "react";
import { useParams, Link } from "react-router-dom";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import { useRemixMember } from "helpers/useRemixMembers.js";

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
  ${tw`w-48 h-48 md:w-64 md:h-64 rounded flex-shrink-0 overflow-hidden bg-primary-500 flex items-center justify-center`}
`;
const PhotoImage = tw.img`w-full h-full object-cover`;
const PhotoInitial = tw.span`text-gray-100 text-6xl font-black select-none`;

const InfoContainer = tw.div`mt-8 md:mt-0 md:ml-10 flex flex-col`;

const MemberName = tw.h2`text-3xl font-black text-gray-900`;
const MemberPosition = tw.span`uppercase font-bold tracking-widest text-xs text-primary-500 mt-2 block`;

const DetailRow = styled.div`
  ${tw`flex items-center mt-3`}
`;
const DetailLabel = tw.span`font-bold text-gray-700 w-32 text-sm flex-shrink-0`;
const DetailValue = tw.span`text-gray-600 text-sm`;

const Divider = tw.div`my-6 border-b-2 border-gray-200`;


const ButtonsRow = tw.div`mt-8 flex flex-col sm:flex-row gap-4`;
const PrimaryButton = tw(PrimaryButtonBase)`text-sm`;
const SecondaryButton = styled.a`
  ${tw`px-8 py-3 rounded bg-gray-200 text-gray-800 font-bold text-sm hover:bg-gray-300 transition duration-300 text-center`}
`;

const NotFoundContainer = tw.div`text-center py-20`;
const StatusContainer = tw.div`text-center py-20 text-gray-600`;

export default () => {
  const { id } = useParams();
  const { member, loading, error } = useRemixMember(id);
  const [photoFailed, setPhotoFailed] = React.useState(false);

  if (loading) {
    return (
      <AnimationRevealPage>
        <Container>
          <ContentWithPaddingXl>
            <StatusContainer>Memuat profil member...</StatusContainer>
          </ContentWithPaddingXl>
        </Container>
      </AnimationRevealPage>
    );
  }

  if (error || !member) {
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

  const initial = (member.name || "?").trim().charAt(0).toUpperCase();
  let joinDateDisplay = null;
  if (member.joinDate) {
    const parsed = new Date(member.joinDate);
    joinDateDisplay = isNaN(parsed.getTime())
      ? member.joinDate
      : parsed.toLocaleDateString("id-ID", { year: "numeric", month: "long" });
  }

  return (
    <AnimationRevealPage>
      <Container>
        <ContentWithPaddingXl>

          <Subheading>Sopan Remix</Subheading>
          <Heading>Profil Member</Heading>

          <ProfileCard>

            {/* Foto — dari database, fallback ke avatar inisial kalau kosong/error */}
            <PhotoContainer>
              {member.profilePic && !photoFailed ? (
                <PhotoImage
                  src={member.profilePic}
                  alt={member.name}
                  onError={() => setPhotoFailed(true)}
                />
              ) : (
                <PhotoInitial>{initial}</PhotoInitial>
              )}
            </PhotoContainer>

            <InfoContainer>

              {/* Nama & Role */}
              <MemberName>{member.name}</MemberName>
              <MemberPosition>{member.position}</MemberPosition>

              <Divider />

              {/* Detail info */}
              {joinDateDisplay && (
                <DetailRow>
                  <DetailLabel>Bergabung</DetailLabel>
                  <DetailValue>{joinDateDisplay}</DetailValue>
                </DetailRow>
              )}
              {typeof member.followers === "number" && (
                <DetailRow>
                  <DetailLabel>Followers</DetailLabel>
                  <DetailValue>{member.followers}</DetailValue>
                </DetailRow>
              )}
              {member.tiktok && (
                <DetailRow>
                  <DetailLabel>TikTok</DetailLabel>
                  <DetailValue>
                    <a
                      href={member.tiktok}
                      target="_blank"
                      rel="noreferrer"
                      tw="text-primary-500 hover:text-primary-700"
                    >
                      Lihat profil
                    </a>
                  </DetailValue>
                </DetailRow>
              )}
              {member.youtube && (
                <DetailRow>
                  <DetailLabel>YouTube</DetailLabel>
                  <DetailValue>
                    <a
                      href={member.youtube}
                      target="_blank"
                      rel="noreferrer"
                      tw="text-primary-500 hover:text-primary-700"
                    >
                      Lihat channel
                    </a>
                  </DetailValue>
                </DetailRow>
              )}
              <DetailRow>
                <DetailLabel>Divisi</DetailLabel>
                <DetailValue>Sopan Remix</DetailValue>
              </DetailRow>

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
