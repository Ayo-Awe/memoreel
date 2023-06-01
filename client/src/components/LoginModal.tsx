import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  onSubmit: (data: LoginFormData) => void;
  isLoading: boolean;
}

type LoginFormData = z.infer<typeof schema>;

export default function LoginModal({
  isOpen,
  onClose,
  isLoading,
  onSubmit,
}: Props) {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
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

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={["xs", "md"]}
        closeOnOverlayClick={!isLoading}
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
          <ModalCloseButton isDisabled={isLoading} />
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
                isLoading={isLoading}
              >
                Log in
              </Button>
              <Button
                mt={"3"}
                colorScheme="blue"
                w={"full"}
                variant="outline"
                isDisabled={isLoading}
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
