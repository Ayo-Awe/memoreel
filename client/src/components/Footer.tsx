import { satoshi } from "@/fonts";
import { Box, Flex, Image, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box flexShrink={0}>
      <hr className="footer" />
      <Flex
        py={"8"}
        flexDirection={"column"}
        alignItems={"center"}
        bg={"#fafafa"}
      >
        <Image src="/logo.svg" alt="logo" />
        <Text mt={"4"} fontWeight={500} className={satoshi.className}>
          Designed by{" "}
          <Text
            as={"a"}
            href="https://twitter.com/irabor_jngozi"
            color={"#0096C6"}
          >
            @irabor_jngozi
          </Text>{" "}
          & Developed by{" "}
          <Text as={"a"} href="https://twitter.com/aweayo_" color={"#0096C6"}>
            @aweayo_
          </Text>
        </Text>
        <Text fontWeight={400} fontSize={"md"} className={satoshi.className}>
          &copy; Memoreel 2023, All rights reserved.
        </Text>
      </Flex>
    </Box>
  );
}
