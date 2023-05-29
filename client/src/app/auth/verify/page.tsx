"use client";
import { Card, Center, Text } from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa";

export default function ReelConfirmation() {
  return (
    <>
      <Center
        as={Card}
        flexDir={"column"}
        maxW={"28rem"}
        marginX={"auto"}
        padding={"20"}
        marginTop={"16"}
      >
        <FaPaperPlane fontSize={"5rem"} color="#0096c6" />
        <Text fontSize={"24px"} mt={"8"} textAlign={"center"}>
          Your email has been successfully verified
        </Text>
      </Center>
    </>
  );
}
