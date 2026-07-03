import React, { useState } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container as ContainerBase } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import ReactDOM from "react-dom";
import { css } from "styled-components/macro"; //eslint-disable-line
import illustration from "images/signup-illustration.svg";
import logo from "images/logo.svg";
import { ReactComponent as SignUpIcon } from "feather-icons/dist/icons/user-plus.svg";
import { ReactComponent as LoadingIcon } from "feather-icons/dist/icons/loader.svg";
import { ReactComponent as CheckIcon } from "feather-icons/dist/icons/check-circle.svg";
import { ReactComponent as AlertIcon } from "feather-icons/dist/icons/alert-circle.svg";

// ─────────────────────────────────────────────────────────────────────────────
// SIGNUP / JOIN PAGE: SOPAN REMIX
// Basis: src/pages/Signup.js (duplikat, hanya teks & link yang diubah)
// Field: Nama Member, Foto Profil, Video Karya, Link Sosmed, Password
// Tanpa social login provider. Ada animasi loading + custom alert saat submit.
// ─────────────────────────────────────────────────────────────────────────────

const Container = tw(ContainerBase)`min-h-screen bg-primary-900 text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;

const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-primary-500 text-gray-100 w-full py-4 rounded-lg hover:bg-primary-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  ${props => props.disabled && tw`opacity-50 cursor-not-allowed hover:bg-primary-500`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const Spinner = styled(LoadingIcon)`
  ${tw`w-6 h-6 -ml-2 animate-spin`}
`;
const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-purple-100 text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
  ${props => `background-image: url("${props.imageSrc}");`}
  ${tw`m-12 xl:m-16 w-full max-w-lg bg-contain bg-center bg-no-repeat`}
`;

// ── Custom Alert Components ──────────────────────────────────────────────────
const AlertOverlay = styled.div`
  ${tw`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}
`;
const AlertBox = styled.div`
  ${tw`bg-white rounded-lg shadow-lg p-8 max-w-sm w-full mx-4 text-center transform transition-all duration-300`}
`;
const AlertIconWrapper = styled.div`
  ${tw`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center`}
  ${props => (props.type === "success" ? tw`bg-green-100` : tw`bg-red-100`)}
  .icon {
    ${tw`w-8 h-8`}
    ${props => (props.type === "success" ? tw`text-green-500` : tw`text-red-500`)}
  }
`;
const AlertTitle = tw.h3`text-lg font-bold text-gray-900 mb-2`;
const AlertMessage = tw.p`text-sm text-gray-600 mb-6`;
const AlertButton = tw.button`bg-primary-500 text-white font-semibold py-2 px-8 rounded-lg hover:bg-primary-900 transition-all duration-300 focus:outline-none`;

export default ({
  logoLinkUrl = "/remix",
  illustrationImageSrc = illustration,
  headingText = "Join Sopan Remix",
  submitButtonText = "Daftar Sekarang",
  SubmitButtonIcon = SignUpIcon,
  tosUrl = "#",
  privacyPolicyUrl = "#",
  signInUrl = "/remix/login"
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, type: "success", title: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: ganti bagian ini dengan pemanggilan Supabase (insert data + upload file)
    setTimeout(() => {
      setIsSubmitting(false);
      setAlertInfo({
        show: true,
        type: "success",
        title: "Pendaftaran Berhasil!",
        message: "Data kamu sudah kami terima. Tim Sopan Remix akan menghubungi kamu segera."
      });
    }, 2000);
  };

  return (
    <AnimationRevealPage>
      <Container>
        <Content>
          <MainContainer>
            <LogoLink href={logoLinkUrl}>
              <LogoImage src={logo} />
            </LogoLink>
            <MainContent>
              <Heading>{headingText}</Heading>
              <FormContainer>
                <Form onSubmit={handleSubmit}>
                  <Input
                    type="text"
                    placeholder="Nama Member (wajib akhiran 'Sopan')"
                    required
                    disabled={isSubmitting}
                  />

                  <label tw="w-full block mt-5">
                    <span tw="text-sm text-gray-600">Foto Profil</span>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      disabled={isSubmitting}
                      tw="w-full px-4 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm mt-1"
                    />
                  </label>

                  <label tw="w-full block mt-5">
                    <span tw="text-sm text-gray-600">Video Preview Karya (mp4, min. 30 detik)</span>
                    <input
                      type="file"
                      accept="video/mp4"
                      required
                      disabled={isSubmitting}
                      tw="w-full px-4 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm mt-1"
                    />
                  </label>

                  <Input
                    type="text"
                    placeholder="Link Sosmed (opsional)"
                    disabled={isSubmitting}
                  />

                  <Input
                    type="password"
                    placeholder="Password"
                    required
                    disabled={isSubmitting}
                  />

                  <SubmitButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Spinner />
                        <span className="text">Mendaftarkan...</span>
                      </>
                    ) : (
                      <>
                        <SubmitButtonIcon className="icon" />
                        <span className="text">{submitButtonText}</span>
                      </>
                    )}
                  </SubmitButton>

                  <p tw="mt-6 text-xs text-gray-600 text-center">
                    Dengan mendaftar, kamu menyetujui{" "}
                    <a href={tosUrl} tw="border-b border-gray-500 border-dotted">
                      Peraturan Komunitas
                    </a>{" "}
                    dan{" "}
                    <a href={privacyPolicyUrl} tw="border-b border-gray-500 border-dotted">
                      Kebijakan Privasi
                    </a>
                  </p>

                  <p tw="mt-8 text-sm text-gray-600 text-center">
                    Sudah punya akun?{" "}
                    <a href={signInUrl} tw="border-b border-gray-500 border-dotted">
                      Sign In
                    </a>
                  </p>
                </Form>
              </FormContainer>
            </MainContent>
          </MainContainer>
          <IllustrationContainer>
            <IllustrationImage imageSrc={illustrationImageSrc} />
          </IllustrationContainer>
        </Content>
      </Container>

     {alertInfo.show && ReactDOM.createPortal(
  <AlertOverlay>
    <AlertBox>
      <AlertIconWrapper type={alertInfo.type}>
        {alertInfo.type === "success" ? (
          <CheckIcon className="icon" />
        ) : (
          <AlertIcon className="icon" />
        )}
      </AlertIconWrapper>
      <AlertTitle>{alertInfo.title}</AlertTitle>
      <AlertMessage>{alertInfo.message}</AlertMessage>
      <AlertButton onClick={() => setAlertInfo({ ...alertInfo, show: false })}>
        Oke, Mengerti
      </AlertButton>
    </AlertBox>
  </AlertOverlay>,
  document.body
)}
    </AnimationRevealPage>
  );
};