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
import { useEffect, useState } from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Home() {
  const toast = useToast();
  const [isOpen, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: any) => {
      console.log(data);
      const formData = new FormData();
      formData.append("video", data.video);
      formData.append("email", data.email);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("deliveryDate", data.deliveryDate.toISOString());
      return apiClient.post("/reels", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast({
        title: "Reel created successfully",
        status: "success",
        duration: 9000,
        position: "top-left",
        isClosable: true,
      });
      setOpen(true);
    },
    onError: (error: any) => {
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
            fontSize={"2.5rem"}
            mt={"12"}
            fontWeight={700}
            lineHeight={"3rem"}
          >
            Ever thought of sending a message to your future self?
          </Text>
          <Text fontSize={"1.25rem"} mt={"8"}>
            Welcome to Memoreel, the platform that allows you to easily create
            and send video messages to your future self. Do you want to set
            goals for the future, reflect on the past, or just say hello to your
            future self? KJL makes it easy to capture your memories and stay
            connected with the person you will become.
          </Text>
          <ButtonGroup mt={"8"} fontSize={"1rem"} width={"full"}>
            <Link href="/#reel-form">
              <Button
                bg={"#0096C6"}
                _hover={{ bg: "#11a7d7", textDecoration: "none" }}
                color={"white"}
                width={"full"}
                maxW={"188px"}
                height={"3rem"}
              >
                Make a Reel Now
              </Button>
            </Link>
          </ButtonGroup>
        </Box>
        <Box textAlign={"right"}>
          <Image
            src="/hero_image.png"
            alt="hero image"
            maxWidth={"md"}
            float={"right"}
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
          isLoading={mutation.isLoading}
        />
      </Box>
      <Box as="section" mt={"24"}>
        <Text fontSize={"4xl"} textAlign={"center"} fontWeight={500} mb={"8"}>
          About Memoreel
        </Text>

        <Text
          fontSize={"1.25rem"}
          mt={"8"}
          maxW={"3xl"}
          textAlign={"center"}
          margin={"auto"}
        >
          Have you ever wanted to capture a special moment and share it in a
          truly heartfelt way? That&apos;s exactly what inspired me to create
          Memoreel. Hi, I&apos;m Ayomidipupo Awe, the developer behind this
          incredible platform. I was deeply inspired by my own desire to go
          beyond traditional letters and provide a way for people to send
          meaningful videos instead. Like many of us, I&apos;ve always believed
          that memories hold a unique power to connect us with our past and
          shape our future. The FutureMe application sparked a fire within me to
          create the Memoreel project in detail by visiting our GitHub
          repository:{" "}
          <Text
            as={"a"}
            href={"https://github.com/Ayo-Awe/memoreel"}
            color={"#0096C6"}
          >
            Memoreel GitHub Repository
          </Text>
        </Text>
      </Box>
      <Box margin={"auto"} textAlign={"center"} fontSize={"3xl"} mt={"8"}>
        <a href="https://twitter.com/aweayo_">
          <Icon
            as={FaTwitter}
            mr={"4"}
            _hover={{ cursor: "pointer" }}
            color={"#0096C6"}
          />
        </a>
        <a href="https://github.com/Ayo-Awe/">
          <Icon
            as={FaGithub}
            mr={"4"}
            _hover={{ cursor: "pointer" }}
            color={"#0096C6"}
          />
        </a>
        <a href="https://www.linkedin.com/in/aweayo/">
          <Icon
            as={FaLinkedin}
            _hover={{ cursor: "pointer" }}
            color={"#0096C6"}
          />
        </a>
      </Box>
    </>
  );
}
