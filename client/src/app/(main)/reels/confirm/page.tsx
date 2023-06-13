"use client";
import useStore from "@/hooks/useStore";
import apiClient from "@/services/apiClient";
import useAuthStore from "@/stateManagement/auth/store";
import {
  Box,
  Button,
  Center,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Error from "next/error";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function ReelConfirmation() {
  const authStore = useStore(useAuthStore, (state) => state);
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const toast = useToast();
  const { isSuccess, isError, error, isLoading } = useQuery({
    queryFn: () => apiClient.post(`/reels/${token}/confirm`),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      const { response } = error as any;
      if (response && response.data?.code === "REEL_CONFIRMATION_OVERDUE") {
        toast({
          title: "Cannot confirm reel",
          description: `This reel cannot be confirmed as it has exceeded the delivery date`,
          status: "error",
          duration: 9000,
          position: "top-left",
          isClosable: true,
        });
      }
    }
  }, [error, isError]);

  if (!token) return <Error statusCode={404} />;

  return (
    <>
      {isLoading && <Spinner />}
      {/* @ts-ignore */}
      {error && error.response?.data.code !== "REEL_CONFIRMATION_OVERDUE" && (
        <Error statusCode={404} />
      )}
      {isSuccess && (
        <Center flexDir={"column"} maxW={"28rem"} marginX={"auto"}>
          <FaPaperPlane fontSize={"5rem"} color="#0096c6" />
          <Text fontSize={"24px"} mt={"8"}>
            Your video has been sent to the future. Sign up to manage all your
            sent videos.
          </Text>
          <VStack w={"full"} mt={"8"} gap={2}>
            {authStore && authStore.user ? (
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
      )}
    </>
  );
}
