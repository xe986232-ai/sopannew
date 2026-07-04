import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container as ContainerBase } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import {css} from "styled-components/macro"; //eslint-disable-line
import illustration from "images/login-illustration.svg";
import logo from "images/logo.svg";
import { ReactComponent as LoginIcon } from "feather-icons/dist/icons/log-in.svg";
import { ReactComponent as LoadingIcon } from "feather-icons/dist/icons/loader.svg";
import { ReactComponent as CheckIcon } from "feather-icons/dist/icons/check-circle.svg";
import { ReactComponent as AlertIcon } from "feather-icons/dist/icons/alert-circle.svg";
import { loginWithUsername } from "helpers/useAuth.js";

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN PAGE: SOPAN REMIX
// Basis: src/pages/Login.js (duplikat, hanya teks & link yang diubah)
// Styling, layout, ilustrasi TIDAK diubah sama sekali
//
// Sekarang sudah nyambung ke Firebase Realtime Database (path "users"),
// dicocokkan lewat field "username" + "passwordPlain". Login sukses ->
// session disimpan (helpers/session.js) -> redirect ke /absensi supaya
// bisa langsung absen.
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
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-purple-100 text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
  ${props => `background-image: url("${props.imageSrc}");`}
  ${tw`m-12 xl:m-16 w-full max-w-sm bg-contain bg-center bg-no-repeat`}
`;

const Spinner = styled(LoadingIcon)`
  ${tw`w-6 h-6 -ml-2 animate-spin`}
`;

// ── Custom Alert Components ──────────────────────────────────────────────────
const AlertOverlay = styled.div`
  ${tw`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4`}
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
  headingText = "Sign In to Sopan Remix",
  submitButtonText = "Sign In",
  SubmitButtonIcon = LoginIcon,
  forgotPasswordUrl = "#",
  signupUrl = "/remix/join",
}) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, type: "success", title: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await loginWithUsername(username, password);

    setIsSubmitting(false);

    if (!result.ok) {
      const messages = {
        empty: "Isi dulu Username dan Password kamu.",
        "not-found": "Username tidak ditemukan. Periksa lagi penulisannya.",
        "wrong-password": "Password salah. Coba lagi.",
        network: "Gagal terhubung ke server. Periksa koneksi internet kamu.",
      };
      setAlertInfo({
        show: true,
        type: "error",
        title: "Login Gagal",
        message: messages[result.reason] || "Terjadi kesalahan saat login.",
      });
      return;
    }

    setAlertInfo({
      show: true,
      type: "success",
      title: "Login Berhasil!",
      message: `Selamat datang kembali, ${result.user.username}.`,
    });
  };

  const closeAlert = () => {
    const wasSuccess = alertInfo.type === "success";
    setAlertInfo((prev) => ({ ...prev, show: false }));
    if (wasSuccess) {
      navigate("/absensi");
    }
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
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                  <SubmitButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Spinner />
                        <span className="text">Memeriksa...</span>
                      </>
                    ) : (
                      <>
                        <SubmitButtonIcon className="icon" />
                        <span className="text">{submitButtonText}</span>
                      </>
                    )}
                  </SubmitButton>
                </Form>
                <p tw="mt-6 text-xs text-gray-600 text-center">
                  <a href={forgotPasswordUrl} tw="border-b border-gray-500 border-dotted">
                    Lupa Password?
                  </a>
                </p>
                <p tw="mt-8 text-sm text-gray-600 text-center">
                  Belum punya akun?{" "}
                  <a href={signupUrl} tw="border-b border-gray-500 border-dotted">
                    Daftar
                  </a>
                </p>
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
            <AlertButton onClick={closeAlert}>Oke, Mengerti</AlertButton>
          </AlertBox>
        </AlertOverlay>,
        document.body
      )}
    </AnimationRevealPage>
  );
};
