import useAuthStore from "@/stateManagement/auth/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertIcon, AlertDescription } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Input,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { z } from "zod";
import apiClient from "@/services/apiClient";
import { useState } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z
    .string({
      invalid_type_error: "Please provide a valid email",
      required_error: "Email is required",
    })
    .email("Please provide a valid email"),
  password: z.string().nonempty(),
});
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface AlertMessage {
  message: string;
  status: "info" | "error";
}

type LoginFormData = z.infer<typeof schema>;

export default function LoginModal({ isOpen, onClose }: Props) {
  const { login } = useAuthStore();
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const router = useRouter();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  function handleClose() {
    onClose();
    reset();
  }

  async function handleGoogle() {
    try {
      const response = await apiClient.get("/auth/oauth/google");
      console.log();
      router.push(response.data.data.authorizationUrl);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async function onSubmit(data: LoginFormData) {
    try {
      const response = await apiClient.post("/auth/login", data);
      const token = response.headers["x-api-token"];
      const user = response.data.data.user;

      setAlert(null);
      login({ ...user, token });
      handleClose();
      router.push("/dashboard");
    } catch (error: any) {
      const code = error?.response.data?.code;
      switch (code) {
        case "INVALID_REQUEST_PARAMETERS":
        case "RESOURCE_NOT_FOUND":
          setAlert({ message: "Invalid email/password", status: "error" });
          break;
        case "USER_NOT_VERIFIED":
          setAlert({
            message: `To proceed, please verify your email. An email was sent to ${data.email}.`,
            status: "info",
          });
          break;
        default:
          setAlert({ message: "An unexpected error occured", status: "error" });
          break;
      }
    }
  }

  return (
    <>
      {alert && (
        <Alert status={alert.status} zIndex={"popover"}>
          <AlertIcon />
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={["xs", "md"]}
        closeOnOverlayClick={!isSubmitting}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="2xl" fontWeight="semibold">
              Log in
            </Text>
            <Text fontSize="medium" fontWeight="normal">
              Don&apos;t have an account? Sign Up
            </Text>
          </ModalHeader>
          <ModalCloseButton isDisabled={isSubmitting} />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={Boolean(errors.email || errors.password)}>
                <FormLabel>Email Address</FormLabel>
                <Input
                  {...register("email")}
                  type="email"
                  id="email"
                  placeholder="Enter email address"
                  isInvalid={Boolean(errors.email)}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
                <FormLabel mt="5">Password</FormLabel>
                <Input
                  {...register("password")}
                  type="password"
                  id="password"
                  placeholder="Enter password"
                  isInvalid={Boolean(errors.password)}
                />
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
              <Button
                mt={"5"}
                colorScheme="blue"
                w={"full"}
                variant="solid"
                type="submit"
                isLoading={isSubmitting}
              >
                Log in
              </Button>
              <Button
                mt={"3"}
                colorScheme="blue"
                w={"full"}
                variant="outline"
                isDisabled={isSubmitting}
                onClick={handleGoogle}
              >
                Log in with Google
              </Button>
            </form>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
}
