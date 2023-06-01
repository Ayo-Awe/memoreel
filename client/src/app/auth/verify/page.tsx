"use client";
import useStore from "@/hooks/useStore";
import apiClient from "@/services/apiClient";
import useAuthStore from "@/stateManagement/auth/store";
import { Card, Center, Spinner, Text, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import Error from "next/error";
import { useRouter, useSearchParams } from "next/navigation";
import { FaPaperPlane } from "react-icons/fa";

export default function EmailConfirmation() {
  const searchParams = useSearchParams();
  const authStore = useStore(useAuthStore, (state) => state);
  const router = useRouter();
  const token = searchParams.get("token");
  const toast = useToast();
  const { isSuccess, isError, error, isLoading } = useMutation({
    mutationFn: () => apiClient.post(`/auth/register/verify`, { token }),
    onSuccess: (response) => {
      const token = response.headers["x-api-token"];
      const user = response.data.data.user;
      authStore?.login({ ...user, token });
      setTimeout(() => router.push("/dashboard"), 2000);
    },
    onError: (error: any) => {
      const { response } = error;

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
    },
  });

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
          shadow={"lg"}
          mt={"10"}
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
