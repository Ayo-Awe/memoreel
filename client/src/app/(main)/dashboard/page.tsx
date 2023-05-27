"use client";
import HomeCard from "@/components/HomeCard";
import ReelForm from "@/components/ReelForm";
import useAuthStore from "@/stateManagement/auth/store";
import { Box, Flex, Text } from "@chakra-ui/react";
import { redirect } from "next/navigation";

const Page = () => {
  const { user } = useAuthStore();

  if (!user) {
    redirect("/");
  }

  return (
    <>
      <ReelForm />
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
            Preview the video and when you’re sure it’s want you want, you go
            ahead to send it to receive it in the future.
          </HomeCard>
          <HomeCard number={1} title="Confirm your email">
            Preview the video and when you’re sure it’s want you want, you go
            ahead to send it to receive it in the future.
          </HomeCard>
          <HomeCard number={1} title="Send Video">
            Preview the video and when you’re sure it’s want you want, you go
            ahead to send it to receive it in the future.
          </HomeCard>
        </Flex>
      </Box>
    </>
  );
};

export default Page;
