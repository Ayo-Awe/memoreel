"use client";
import useStore from "@/hooks/useStore";
import apiClient from "@/services/apiClient";
import useAuthStore from "@/stateManagement/auth/store";
import { Alert, Card, Center, Spinner, Text, useToast } from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Error from "next/error";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function EmailConfirmation() {
  const searchParams = useSearchParams();
  const authStore = useStore(useAuthStore, (state) => state);
  const router = useRouter();
  const token = searchParams.get("token");
  const toast = useToast();
  const { data, isSuccess, isError, error, isLoading } = useQuery({
    queryFn: () => apiClient.post(`/auth/register/verify`, { token }),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
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

    if (isSuccess) {
      const token = data.headers["x-api-token"];
      const user = data.data.data.user;
      authStore?.login({ ...user, token });
      setTimeout(() => router.push("/dashboard/reels"), 2000);
    }
  }, [isError, error, isSuccess]);

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
