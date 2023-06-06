"use client";

import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import NavBar from "@/components/NavBar";
import SignupModal from "@/components/SignupModal";
import useStore from "@/hooks/useStore";
import apiClient from "@/services/apiClient";
import useAuthStore from "@/stateManagement/auth/store";
import { formatLoginErrors } from "@/utils";
import { Box, Center, Spinner, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const authStore = useStore(useAuthStore, (state) => state);
  // const { login, user } = useAuthStore();
  const router = useRouter();
  const toast = useToast();
  const signupMutation = useMutation({
    mutationFn: (data: any) => {
      return apiClient.post("/auth/register", data);
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Confirm your email",
        description: `An email has been sent to ${variables.email}.`,
        status: "info",
        duration: 9000,
        position: "top-left",
        isClosable: true,
      });
      setSignupModalOpen(false);
    },
    onError: (error: any, variables) => {
      const code = error.response?.data.code;
      let title = "Error";
      let description = "An unknown error occurred";

      if (code === "EXISTING_USER_EMAIL") {
        title = "Email Conflict";
        description = "An account with this email already exists";
      }

      toast({
        title,
        description,
        status: "error",
        duration: 9000,
        position: "top-left",
        isClosable: true,
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: any) => {
      return apiClient.post("/auth/login", data);
    },
    onSuccess: (response, variables, context) => {
      const token = response.headers["x-api-token"];
      const user = response.data.data.user;
      setLoginModalOpen(false);
      router.push("/dashboard/reels");
      authStore?.login({ ...user, token });
    },
    onError: (error: any, variables) => {
      console.log(variables);
      const code = error.response?.data.code;
      const formattedError = formatLoginErrors(code, variables.email);

      toast({
        ...formattedError,
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
          <SignupModal
            isOpen={isSignupModalOpen}
            onClose={() => setSignupModalOpen(false)}
            onSubmit={(data) => signupMutation.mutate(data)}
            isLoading={signupMutation.isLoading}
          />
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setLoginModalOpen(false)}
            onSubmit={(data) => loginMutation.mutate(data)}
            isLoading={loginMutation.isLoading}
          />
          <section className="main">
            <NavBar
              onSignupClick={() => setSignupModalOpen(true)}
              onLoginClick={() => setLoginModalOpen(true)}
            />
            <Box paddingY={"10"}>{children}</Box>
          </section>
          <Footer />
        </>
      ) : (
        <Center h={"full"}>
          <Spinner size={"xl"} mt={"250px"} />
        </Center>
      )}
    </>
  );
}
