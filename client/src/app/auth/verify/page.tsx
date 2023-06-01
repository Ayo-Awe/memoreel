"use client";
import apiClient from "@/services/apiClient";
import { Alert, Card, Center, Spinner, Text, useToast } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Error from "next/error";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function EmailConfirmation() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const toast = useToast();
  const { data, isSuccess, isError, error, isLoading } = useQuery({
    queryFn: () => apiClient.post(`/auth/register/verify`, { token }),
  });

  useEffect(() => {
    if (isError) {
      const { response } = error as any;

      if (response?.data.code === "EMAIL_TOKEN_EXPIRED") {
        toast({
          title: "Token expired",
          description: `Your email token is expired, a new one has been sent to your inbox.`,
          status: "error",
          duration: 9000,
          position: "top-left",
          isClosable: true,
        });
      }
    }
  }, [isError, error]);

  if (!token) return <Error statusCode={404} />;
  return (
    <>
      {isLoading && <Spinner />}
      {isSuccess && (
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
      )}
      {/* @ts-ignore */}
      {error && error.response?.data.code !== "EMAIL_TOKEN_EXPIRED" && (
        <Error statusCode={404} />
      )}
    </>
  );
}
