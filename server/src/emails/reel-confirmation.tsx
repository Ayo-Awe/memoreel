import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ReelConfirmationEmailProps {
  link: string;
}

export default function ReelConfirmationEmail({
  link,
}: ReelConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your Memoreel reel</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Reel Confirmation</Heading>
          <Text style={text}>
            Your reel has been created! Please confirm it by clicking the button
            below so we can schedule its delivery.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={link}>
              Confirm Reel
            </Button>
          </Section>
          <Text style={footer}>
            If the button doesn't work:{" "}
            <Link href={link} style={anchor}>
              {link}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
  borderRadius: "8px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold" as const,
  textAlign: "center" as const,
  margin: "0 0 20px",
};

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#000",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  padding: "12px 24px",
  display: "inline-block",
};

const anchor = {
  color: "#2754C5",
  wordBreak: "break-all" as const,
};

const footer = {
  fontSize: "13px",
  color: "#666",
  marginTop: "24px",
};
