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

interface ReelDeliveryEmailProps {
  title: string;
  description: string | null;
  createdAt: string;
  link: string;
}

export default function ReelDeliveryEmail({
  title,
  description,
  createdAt,
  link,
}: ReelDeliveryEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Memoreel reel has arrived!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Your Reel Has Arrived</Heading>
          <Text style={text}>
            A reel created on <strong>{createdAt}</strong> is ready for you.
          </Text>
          <Section style={detailsSection}>
            <Text style={detailLabel}>Title</Text>
            <Text style={detailValue}>{title}</Text>
            {description && (
              <>
                <Text style={detailLabel}>Description</Text>
                <Text style={detailValue}>{description}</Text>
              </>
            )}
          </Section>
          <Section style={buttonContainer}>
            <Button style={button} href={link}>
              View Your Reel
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

const detailsSection = {
  backgroundColor: "#f9f9f9",
  borderRadius: "6px",
  padding: "16px 20px",
  margin: "16px 0",
};

const detailLabel = {
  fontSize: "12px",
  fontWeight: "600" as const,
  color: "#999",
  textTransform: "uppercase" as const,
  margin: "0 0 4px",
};

const detailValue = {
  fontSize: "16px",
  color: "#333",
  margin: "0 0 12px",
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
