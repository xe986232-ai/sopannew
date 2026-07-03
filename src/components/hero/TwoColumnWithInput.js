import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
//eslint-disable-next-line
import { css } from "styled-components/macro";

import Header from "../headers/light.js";

import { ReactComponent as SvgDecoratorBlob1 } from "../../images/svg-decorator-blob-1.svg";
import DesignIllustration from "../../images/design-illustration-2.svg";
import CustomersLogoStripImage from "../../images/customers-logo-strip.png";

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col lg:flex-row lg:items-center max-w-screen-xl mx-auto py-20 md:py-24`;
const LeftColumn = tw.div`relative lg:w-5/12 text-center max-w-lg mx-auto lg:max-w-none lg:text-left`;
const RightColumn = tw.div`relative mt-12 lg:mt-0 flex-1 flex flex-col justify-center lg:self-end`;

const Heading = tw.h1`font-bold text-3xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-900 leading-tight`;
const Paragraph = tw.p`my-5 lg:my-8 text-base xl:text-lg`;

const Actions = styled.div`
  ${tw`relative max-w-md text-center mx-auto lg:mx-0`}
  input {
    ${tw`sm:pr-48 pl-8 py-4 sm:py-5 rounded-full border-2 w-full font-medium focus:outline-none transition duration-300  focus:border-primary-500 hover:border-gray-500`}
  }
  button {
    ${tw`w-full sm:absolute right-0 top-0 bottom-0 bg-primary-500 text-gray-100 font-bold mr-2 my-4 sm:my-2 rounded-full py-4 flex items-center justify-center sm:w-40 sm:leading-none focus:outline-none hover:bg-primary-900 transition duration-300`}
  }
`;

// Tombol ganda (Join / Sign In) — dipakai kalau showEmailForm={false}
const ButtonActions = tw.div`relative max-w-md mx-auto lg:mx-0 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start`;
const PrimaryActionLink = tw.a`w-full sm:w-auto text-center px-8 py-4 rounded-full bg-primary-500 text-gray-100 font-bold hocus:bg-primary-900 transition duration-300 focus:outline-none`;
const SecondaryActionLink = tw.a`w-full sm:w-auto text-center px-8 py-4 rounded-full border-2 border-primary-500 text-primary-500 font-bold hocus:bg-primary-500 hocus:text-gray-100 transition duration-300 focus:outline-none`;

const IllustrationContainer = tw.div`flex justify-center lg:justify-end items-center`;

// Random Decorator Blobs (shapes that you see in background)
const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none opacity-5 absolute left-0 bottom-0 h-64 w-64 transform -translate-x-2/3 -z-10`}
`;

const CustomersLogoStrip = styled.div`
  ${tw`mt-12 lg:mt-20`}
  p {
    ${tw`uppercase text-sm lg:text-xs tracking-wider font-bold text-gray-500`}
  }
  img {
    ${tw`mt-4 w-full lg:pr-16 xl:pr-32 opacity-50`}
  }
`;

export default ({
  roundedHeaderButton,
  links,
  heading = (
    <>
      Beautiful React Templates <span tw="text-primary-500">for you.</span>
    </>
  ),
  description = "Our templates are easy to setup, understand and customize. Fully modular components with a variety of pages and components.",
  // Set false untuk menyembunyikan form email + tombol "Get Started",
  // dan menampilkan dua tombol aksi (primaryAction / secondaryAction) sebagai gantinya.
  showEmailForm = true,
  primaryActionText,
  primaryActionUrl,
  secondaryActionText,
  secondaryActionUrl,
  // Set false untuk menyembunyikan strip "Our TRUSTED Customers"
  showCustomers = true,
}) => {
  return (
    <>
      <Header roundedHeaderButton={roundedHeaderButton} links={links} />
      <Container>
        <TwoColumn>
          <LeftColumn>
            <Heading>{heading}</Heading>
            <Paragraph>{description}</Paragraph>

            {showEmailForm ? (
              <Actions>
                <input type="text" placeholder="Your E-mail Address" />
                <button>Get Started</button>
              </Actions>
            ) : (
              <ButtonActions>
                {primaryActionText && (
                  <PrimaryActionLink href={primaryActionUrl || "/#"}>{primaryActionText}</PrimaryActionLink>
                )}
                {secondaryActionText && (
                  <SecondaryActionLink href={secondaryActionUrl || "/#"}>{secondaryActionText}</SecondaryActionLink>
                )}
              </ButtonActions>
            )}

            {showCustomers && (
              <CustomersLogoStrip>
                <p>Our TRUSTED Customers</p>
                <img src={CustomersLogoStripImage} alt="Our Customers" />
              </CustomersLogoStrip>
            )}
          </LeftColumn>
          <RightColumn>
            <IllustrationContainer>
              <img tw="min-w-0 w-full max-w-lg xl:max-w-3xl" src={DesignIllustration} alt="Design Illustration" />
            </IllustrationContainer>
          </RightColumn>
        </TwoColumn>
        <DecoratorBlob1 />
      </Container>
    </>
  );
};