import React, { useEffect, useState } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings.js";
import { SectionDescription } from "components/misc/Typography.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { ReactComponent as ArrowLeftIconBase } from "images/arrow-left-2-icon.svg";
import { ReactComponent as ArrowRightIconBase } from "images/arrow-right-2-icon.svg";

// ─────────────────────────────────────────────────────────────────────────────
// Animated Testimonials — versi twin.macro/styled-components, terinspirasi dari
// komponen "Animated Testimonials" (Aceternity UI), diadaptasi total supaya
// nyambung dengan sistem styling template ini (bukan Tailwind className biasa,
// bukan Next.js). Ikon panah pakai asset SVG yang sudah ada di src/images/,
// bukan library ikon baru.
// ─────────────────────────────────────────────────────────────────────────────

const HeadingContainer = tw.div`text-center`;
const Subheading = tw(SubheadingBase)``;
const Heading = tw(SectionHeading)`mt-4`;
const Description = tw(SectionDescription)`mt-4 mx-auto text-center max-w-2xl`;

const Row = tw.div`mt-16 relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center max-w-4xl mx-auto`;

const ImageStackContainer = tw.div`relative h-72 sm:h-80 md:h-96 w-full max-w-sm mx-auto md:max-w-none`;

const StackedImage = styled(motion.img)`
  ${tw`absolute inset-0 h-full w-full rounded-3xl object-cover object-center shadow-lg`}
`;

const TextColumn = tw.div`flex flex-col justify-between h-full py-2`;

const QuoteBlock = tw(motion.div)``;
const CustomerName = tw.h5`text-xl sm:text-2xl font-bold text-gray-900`;
const CustomerDesignation = tw.p`mt-1 text-sm text-secondary-100`;
const Quote = tw.p`mt-6 text-sm sm:text-base leading-relaxed text-gray-600`;

const Controls = tw.div`flex gap-4 mt-10 md:mt-0 justify-center md:justify-start`;
const ControlButton = styled.button`
  ${tw`h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center transition duration-300 hover:bg-primary-500 text-primary-500 hover:text-gray-100 focus:outline-none focus:shadow-outline`}
  svg {
    ${tw`w-4 h-4 fill-current`}
  }
`;

const randomRotate = () => Math.floor(Math.random() * 21) - 10;

export default ({
  subheading = "Member Spotlight",
  heading = "Cerita dari Tim Kami",
  description = "",
  autoplay = false,
  testimonials = [
    {
      // PLACEHOLDER
      name: "Sarah Chen",
      designation: "Product Manager at TechFlow",
      quote:
        "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.85&w=512&h=512&q=80"
    },
    {
      // PLACEHOLDER
      name: "Michael Rodriguez",
      designation: "CTO at InnovateSphere",
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      src: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=512&h=512&q=80"
    }
  ]
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => setActive((prev) => (prev + 1) % testimonials.length);
  const handlePrev = () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const isActive = (index) => index === active;

  useEffect(() => {
    if (!autoplay) return undefined;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, testimonials.length]);

  return (
    <Container>
      <ContentWithPaddingXl>
        <HeadingContainer>
          <Subheading>{subheading}</Subheading>
          <Heading>{heading}</Heading>
          {description && <Description>{description}</Description>}
        </HeadingContainer>

        <Row>
          <ImageStackContainer>
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <StackedImage
                  key={testimonial.src}
                  src={testimonial.src}
                  alt={testimonial.name}
                  draggable={false}
                  initial={{ opacity: 0, scale: 0.9, rotate: randomRotate() }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    rotate: isActive(index) ? 0 : randomRotate(),
                    zIndex: isActive(index) ? 999 : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -30, 0] : 0
                  }}
                  exit={{ opacity: 0, scale: 0.9, rotate: randomRotate() }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              ))}
            </AnimatePresence>
          </ImageStackContainer>

          <TextColumn>
            <AnimatePresence mode="wait">
              <QuoteBlock
                key={active}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <CustomerName>{testimonials[active].name}</CustomerName>
                <CustomerDesignation>{testimonials[active].designation}</CustomerDesignation>
                <Quote>{testimonials[active].quote}</Quote>
              </QuoteBlock>
            </AnimatePresence>

            <Controls>
              <ControlButton onClick={handlePrev} aria-label="Sebelumnya">
                <ArrowLeftIconBase />
              </ControlButton>
              <ControlButton onClick={handleNext} aria-label="Berikutnya">
                <ArrowRightIconBase />
              </ControlButton>
            </Controls>
          </TextColumn>
        </Row>
      </ContentWithPaddingXl>
    </Container>
  );
};
