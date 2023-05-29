"use client";
import useAuthStore from "@/stateManagement/auth/store";
import { Box, Button, Center, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { FaPaperPlane } from "react-icons/fa";

export default function ReelConfirmation() {
  const { user } = useAuthStore();

  return (
    <>
      <Center flexDir={"column"} maxW={"28rem"} marginX={"auto"}>
        <FaPaperPlane fontSize={"5rem"} color="#0096c6" />
        <Text fontSize={"24px"} mt={"8"}>
          Your video has been sent to the future. Sign up to manage all your
          sent videos.
        </Text>
        <VStack w={"full"} mt={"8"} gap={2}>
          {user ? (
            <Button
              w={"full"}
              bgColor={"#0096C6"}
              color={"white"}
              _hover={{ bg: "#11a7d7" }}
              as={Link}
              href={"/dashboard"}
            >
              Go to Dashboard
            </Button>
          ) : null}
          <Button
            w={"full"}
            bgColor={"#CCEAF4"}
            color={"#0096c6"}
            _hover={{ bg: "#d2f0fa" }}
            as={Link}
            href={"/"}
          >
            Back to Homepage
          </Button>
        </VStack>
      </Center>
    </>
  );
}
