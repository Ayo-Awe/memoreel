"use client";
import HomeCard from "@/components/HomeCard";
import ReelForm from "@/components/ReelForm";
import useAuthStore from "@/stateManagement/auth/store";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { redirect } from "next/navigation";

const Page = () => {
  const { user } = useAuthStore();

  return (
    <>
      <Flex gap={"28"} justifyContent={"center"}>
        <Box
          as={"form"}
          border={"1px"}
          borderColor={"#d8d8d8"}
          rounded={"lg"}
          padding={"8"}
          maxW={"28rem"}
          flexGrow={1}
        >
          <Text fontSize={"lg"} fontWeight={"semibold"}>
            Basic Information
          </Text>
          <FormControl mt={"4"}>
            <FormLabel color={"#909090"}>Email Address</FormLabel>
            <Input type="email" isDisabled={true} value={"pupoawe@gmail.com"} />
            <FormLabel color={"#909090"} mt={"4"}>
              First Name
            </FormLabel>
            <Input type="text" placeholder="Enter first name" />
            <FormLabel color={"#909090"} mt={"4"}>
              Last Name
            </FormLabel>
            <Input type="text" placeholder="Enter last name" />
            <Box textAlign={"right"} mt={"4"}>
              <Button
                backgroundColor="#0096C6"
                _hover={{ bg: "#11a7d7" }}
                color={"white"}
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
        >
          <Text fontSize={"lg"} fontWeight={"semibold"}>
            Change Password
          </Text>
          <FormControl mt={"4"}>
            <FormLabel color={"#909090"}>Old Password</FormLabel>
            <Input type="password" placeholder="Password" />
            <FormLabel color={"#909090"} mt={"4"}>
              New Password
            </FormLabel>
            <Input type="password" placeholder="New Password" />
            <FormLabel color={"#909090"} mt={"4"}>
              Confirm Password
            </FormLabel>
            <Input type="password" placeholder="Confirm Password" />
            <Box textAlign={"right"} mt={"4"}>
              <Button
                backgroundColor="#0096C6"
                _hover={{ bg: "#11a7d7" }}
                color={"white"}
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
