"use client";
import useStore from "@/hooks/useStore";
import apiClient from "@/services/apiClient";
import useAuthStore from "@/stateManagement/auth/store";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaPaperPlane } from "react-icons/fa";
import { z } from "zod";

const profileSchema = z.object({
  firstName: z
    .string({
      invalid_type_error: "Please provide a valid firstname",
      required_error: "Firstname is required",
    })
    .nonempty("Firstname cannot be empty"),
  lastName: z
    .string({
      invalid_type_error: "Please provide a valid lastname",
      required_error: "Lastname is required",
    })
    .nonempty("Lastname cannot be empty"),
});

const passwordSchema = z
  .object({
    password: z
      .string({
        invalid_type_error: "Please provide password",
        required_error: "Password is required",
      })
      .nonempty("Password cannot be empty"),
    newPassword: z
      .string({
        invalid_type_error: "Please provide new password",
        required_error: "New password is required",
      })
      .nonempty("New password cannot be empty"),
    confirmPassword: z.string({
      invalid_type_error: "Confirm password is required",
      required_error: "Confirm password is required",
    }),
  })
  .refine(
    ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  );

type PasswordFormData = z.infer<typeof passwordSchema>;
type ProfileFormData = z.infer<typeof profileSchema>;

const Page = () => {
  const authStore = useStore(useAuthStore, (state) => state);
  const toast = useToast();
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: authStore?.user?.firstName || undefined,
      lastName: authStore?.user?.lastName || undefined,
    },
  });
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });
  const profileMutation = useMutation({
    mutationFn: (data: ProfileFormData) => {
      return apiClient.patch("/me", data, {
        headers: {
          Authorization: "Bearer " + authStore?.user?.token,
        },
      });
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Profile updated successfully",
        status: "success",
        duration: 9000,
        position: "top-left",
        isClosable: true,
      });
      authStore?.updateProfile(variables);
    },
    onError: (error: any, variables) => {
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

  const passwordMutation = useMutation({
    mutationFn: (data: PasswordFormData) => {
      const payload = {
        oldPassword: data.password,
        newPassword: data.newPassword,
      };
      return apiClient.post("/auth/change-password", payload, {
        headers: {
          Authorization: "Bearer " + authStore?.user?.token,
        },
      });
    },
    onSuccess: (response, variables, context) => {
      toast({
        title: "Password updated successfully",
        status: "success",
        duration: 9000,
        position: "top-left",
        isClosable: true,
      });
      passwordForm.reset();
    },
    onError: (error: AxiosError, variables) => {
      console.log(error.status);

      if (error.response!.status in [403, 400]) {
        toast({
          title: "Invalid password",
          status: "error",
          duration: 9000,
          position: "top-left",
          isClosable: true,
        });
      } else {
        toast({
          title: "An unexpected error occured",
          status: "error",
          duration: 9000,
          position: "top-left",
          isClosable: true,
        });
      }
    },
  });

  useEffect(() => {
    if (authStore) {
      profileForm.setValue("firstName", authStore.user?.firstName || "");
      profileForm.setValue("lastName", authStore.user?.lastName || "");
    }
  }, [authStore, profileForm]);

  return (
    <>
      <Box textAlign={"right"}>
        <Button
          textAlign={"right"}
          bgColor={"#0096C6"}
          color={"white"}
          _hover={{ bg: "#11a7d7" }}
          as={Link}
          href={"/dashboard/reels/send"}
        >
          Send a video <Icon as={FaPaperPlane} ml={"3"} />
        </Button>
      </Box>
      <Flex gap={"28"} justifyContent={"center"} mt={"4"}>
        <Box
          as={"form"}
          border={"1px"}
          borderColor={"#d8d8d8"}
          rounded={"lg"}
          padding={"8"}
          maxW={"28rem"}
          flexGrow={1}
          onSubmit={profileForm.handleSubmit((data) =>
            profileMutation.mutate(data)
          )}
        >
          <Text fontSize={"lg"} fontWeight={"semibold"}>
            Basic Information
          </Text>
          <FormControl
            mt={"4"}
            isInvalid={!profileForm.formState.isValid}
            isDisabled={profileMutation.isLoading}
          >
            <FormLabel color={"#909090"}>Email Address</FormLabel>
            <Input
              type="email"
              isDisabled={true}
              value={authStore?.user?.email}
              isInvalid={false}
            />
            <FormLabel color={"#909090"} mt={"4"}>
              First Name
            </FormLabel>
            <Input
              type="text"
              placeholder="Enter first name"
              {...profileForm.register("firstName")}
              isInvalid={Boolean(profileForm.formState.errors.firstName)}
            />
            <FormLabel color={"#909090"} mt={"4"}>
              Last Name
            </FormLabel>
            <Input
              type="text"
              placeholder="Enter last name"
              {...profileForm.register("lastName")}
              isInvalid={Boolean(profileForm.formState.errors.lastName)}
            />
            <Box textAlign={"right"} mt={"4"}>
              <Button
                backgroundColor="#0096C6"
                _hover={{ bg: "#11a7d7" }}
                color={"white"}
                type="submit"
                isLoading={profileMutation.isLoading}
              >
                Save
              </Button>
            </Box>
          </FormControl>
        </Box>
        <Box
          as={"form"}
          border={"1px"}
          borderColor={"#d8d8d8"}
          rounded={"lg"}
          padding={"8"}
          maxW={"28rem"}
          flexGrow={1}
          onSubmit={passwordForm.handleSubmit((data) =>
            passwordMutation.mutate(data)
          )}
        >
          <Text fontSize={"lg"} fontWeight={"semibold"}>
            Change Password
          </Text>
          <FormControl
            mt={"4"}
            isDisabled={passwordMutation.isLoading}
            isInvalid={!passwordForm.formState.isValid}
          >
            <FormLabel color={"#909090"}>Old Password</FormLabel>
            <Input
              type="password"
              placeholder="Password"
              {...passwordForm.register("password")}
              isInvalid={Boolean(passwordForm.formState.errors.password)}
            />
            <FormLabel color={"#909090"} mt={"4"}>
              New Password
            </FormLabel>
            <Input
              type="password"
              placeholder="New Password"
              {...passwordForm.register("newPassword")}
              isInvalid={Boolean(passwordForm.formState.errors.newPassword)}
            />
            <FormLabel color={"#909090"} mt={"4"}>
              Confirm Password
            </FormLabel>
            <Input
              type="password"
              placeholder="Confirm Password"
              {...passwordForm.register("confirmPassword")}
              isInvalid={Boolean(passwordForm.formState.errors.confirmPassword)}
            />
            <Box textAlign={"right"} mt={"4"}>
              <Button
                backgroundColor="#0096C6"
                _hover={{ bg: "#11a7d7" }}
                color={"white"}
                type="submit"
                isLoading={passwordMutation.isLoading}
              >
                Save
              </Button>
            </Box>
          </FormControl>
        </Box>
      </Flex>
    </>
  );
};

export default Page;
