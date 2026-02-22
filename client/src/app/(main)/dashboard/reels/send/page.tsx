"use client";
import HomeCard from "@/components/HomeCard";
import ReelForm from "@/components/ReelForm";
import useStore from "@/hooks/useStore";
import apiClient from "@/services/apiClient";
import useAuthStore from "@/stateManagement/auth/store";
import { Box, Flex, Spinner, Text, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";

const Page = () => {
  const authStore = useStore(useAuthStore, (state) => state);
  const toast = useToast();
  const bucketKeyRef = useRef<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const authHeader = { Authorization: "Bearer " + authStore?.user?.token };

      const { data: presignData } = await apiClient.get(
        "/uploads/presigned-url",
        { headers: authHeader }
      );

      await fetch(presignData.data.uploadUrl, {
        method: "PUT",
        body: file,
      });

      bucketKeyRef.current = presignData.data.bucketKey;
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Failed to upload video. Please try again.",
        status: "error",
        duration: 9000,
        position: "top-left",
        isClosable: true,
      });
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const authHeader = { Authorization: "Bearer " + authStore?.user?.token };

      return apiClient.post(
        "/me/reels",
        {
          bucketKey: bucketKeyRef.current,
          title: data.title,
          description: data.description,
          deliveryDate: data.deliveryDate.toISOString(),
        },
        { headers: authHeader }
      );
    },
    onSuccess: () => {
      bucketKeyRef.current = null;
      toast({
        title: "Reel sent successfully",
        description: `Your reel has been shipped to the future.`,
        status: "success",
        duration: 9000,
        position: "top-left",
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "An unknown error occurred",
        status: "error",
        duration: 9000,
        position: "top-left",
        isClosable: true,
      });
    },
  });

  return (
    <>
      {authStore ? (
        <>
          <ReelForm
            onSubmit={(data) => mutation.mutate(data)}
            onFileSelect={(file) => uploadMutation.mutate(file)}
            email={authStore?.user?.email}
            isLoading={mutation.isLoading}
            isUploading={uploadMutation.isLoading}
            success={mutation.isSuccess}
          />
          <Box as="section" mt={"24"}>
            <Text fontSize={"4xl"} textAlign={"center"}>
              How it works
            </Text>
            <Flex
              display={["inline", "flex"]}
              justifyContent={"center"}
              gap={"10"}
              mt={"12"}
            >
              <HomeCard number={1} title="Upload a video">
                Preview the video and when you’re sure it’s want you want, you
                go ahead to send it to receive it in the future.
              </HomeCard>
              <HomeCard number={2} title="Confirm your email">
                Preview the video and when you’re sure it’s want you want, you
                go ahead to send it to receive it in the future.
              </HomeCard>
              <HomeCard number={3} title="Send Video">
                Preview the video and when you’re sure it’s want you want, you
                go ahead to send it to receive it in the future.
              </HomeCard>
            </Flex>
          </Box>
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default Page;
