"use client";
import HomeCard from "@/components/HomeCard";
import ReelForm from "@/components/ReelForm";
import { satoshi } from "@/fonts";
import apiClient from "@/services/apiClient";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Home() {
  const toast = useToast();
  const [isOpen, setOpen] = useState(false);
  const bucketKeyRef = useRef<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const { data: presignData } = await apiClient.get(
        "/uploads/presigned-url"
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
      return apiClient.post("/reels", {
        bucketKey: bucketKeyRef.current,
        email: data.email,
        title: data.title,
        description: data.description,
        deliveryDate: data.deliveryDate.toISOString(),
      });
    },
    onSuccess: () => {
      bucketKeyRef.current = null;
      toast({
        title: "Reel created successfully",
        status: "success",
        duration: 9000,
        position: "top-left",
        isClosable: true,
      });
      setOpen(true);
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
      <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Email</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Please check your email to confirm your reel so we can send it to
            the future! Ensure to check your spam if you don&apos;t find the
            mail in your inbox
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => setOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <SimpleGrid as={"section"} columns={[1, 1, 2]} gap={"10"}>
        <Box className={satoshi.className}>
          <Text
            fontSize={["1.9rem", "2.5rem"]}
            mt={["8", "12"]}
            fontWeight={700}
            lineHeight={["2.2rem", "3rem"]}
          >
            Ever thought of sending a message to your future self?
          </Text>
          <Text fontSize={["1.1rem", "1.25rem"]} mt={"8"}>
            Welcome to Memoreel, the platform that allows you to easily create
            and send video messages to your future self. Do you want to set
            goals for the future, reflect on the past, or just say hello to your
            future self? KJL makes it easy to capture your memories and stay
            connected with the person you will become.
          </Text>
          <ButtonGroup mt={"8"} fontSize={"1rem"} width={"full"}>
            <Button
              bg={"#0096C6"}
              _hover={{ bg: "#11a7d7", textDecoration: "none" }}
              color={"white"}
              width={"full"}
              maxW={"188px"}
              as={"a"}
              height={"3rem"}
              href="/#reel-form"
            >
              Make a Reel Now
            </Button>
          </ButtonGroup>
        </Box>
        <Box textAlign={"right"}>
          <Image
            src="/hero_image.png"
            alt="hero image"
            maxWidth={"md"}
            float={"right"}
            display={["none", "none", "inline-block"]}
          />
        </Box>
      </SimpleGrid>
      <Box as="section" mt={"12"}>
        <Text fontSize={"4xl"} textAlign={"center"} fontWeight={500}>
          How it works
        </Text>
        <Flex
          display={["inline", "inline", "flex"]}
          justifyContent={"center"}
          gap={"10"}
          mt={"12"}
          // mx={"auto"}
        >
          <HomeCard number={1} title="Upload a video">
            Upload a video of the memory you&apos;d like to share with your
            future self.
          </HomeCard>
          <HomeCard number={2} title="Confirm your email">
            Confirm your email so we can verify that it&apos;s yours.
          </HomeCard>
          <HomeCard number={3} title="Send Video">
            Once your email has been verified, we will proceed to ship your reel
            to the future.
          </HomeCard>
        </Flex>
      </Box>
      <Box as="section" mt={"24"} id="reel-form">
        <Text fontSize={"4xl"} textAlign={"center"} fontWeight={500} mb={"12"}>
          Try Now For Free!
        </Text>
        <ReelForm
          onSubmit={(data) => mutation.mutate(data)}
          onFileSelect={(file) => uploadMutation.mutate(file)}
          isLoading={mutation.isLoading}
          isUploading={uploadMutation.isLoading}
          success={mutation.isSuccess}
        />
      </Box>
    </>
  );
}
