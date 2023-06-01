"use client";
import HomeCard from "@/components/HomeCard";
import ReelForm from "@/components/ReelForm";
import useStore from "@/hooks/useStore";
import apiClient from "@/services/apiClient";
import useAuthStore from "@/stateManagement/auth/store";
import { Box, Flex, Spinner, Text, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const authStore = useStore(useAuthStore, (state) => state);
  const toast = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      console.log(data);
      const formData = new FormData();
      formData.append("video", data.video);
      formData.append("email", data.email);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("deliveryDate", data.deliveryDate.toISOString());
      return apiClient.post("/me/reels", formData, {
        headers: {
          Authorization: "Bearer " + authStore?.user?.token,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Reel sent successfully",
        description: `Your reel has been shipped to the future.`,
        status: "success",
        duration: 9000,
        position: "top-left",
        isClosable: true,
      });
    },
    onError: (error: any, variables) => {
      const code = error.response?.data.code;

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

  useEffect(() => {
    if (authStore && !authStore.user) {
      redirect("/");
    }
  }, [authStore]);

  return (
    <>
      {authStore ? (
        <>
          <ReelForm
            onSubmit={(data) => mutation.mutate(data)}
            email={authStore?.user?.email}
            isLoading={mutation.isLoading}
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
              <HomeCard number={1} title="Confirm your email">
                Preview the video and when you’re sure it’s want you want, you
                go ahead to send it to receive it in the future.
              </HomeCard>
              <HomeCard number={1} title="Send Video">
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
