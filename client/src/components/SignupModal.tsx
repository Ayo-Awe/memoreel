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
  SimpleGrid,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import apiClient from "@/services/apiClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const schema = z
  .object({
    email: z
      .string({
        invalid_type_error: "Please provide a valid email",
        required_error: "Email is required.",
      })
      .email("Please provide a valid email"),
    password: z
      .string({
        invalid_type_error: "Password is required",
        required_error: "Password is required.",
      })
      .min(8, "Password must be at least 8 characters"),
    confirm: z.string({
      invalid_type_error: "Confirm password is required",
      required_error: "Confirm password is required.",
    }),
  })
  .refine(({ password, confirm }) => password === confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

type SignUpFormData = z.infer<typeof schema>;

interface AlertMessage {
  status: "info" | "error";
  message: string;
}
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupModal({ isOpen, onClose }: Props) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<SignUpFormData>({ resolver: zodResolver(schema) });
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const router = useRouter();

  function handleClose() {
    reset();
    onClose();
  }

  useEffect(() => {
    setAlert(null);
  }, [isSubmitting]);

  async function handleGoogle() {
    try {
      const response = await apiClient.get("/auth/oauth/google");
      console.log();
      router.push(response.data.data.authorizationUrl);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async function onSubmit(data: SignUpFormData) {
    try {
      await apiClient.post("/auth/register", data);
      setAlert({
        message: `An email was sent to ${data.email}, kindly confirm your email.`,
        status: "info",
      });
      handleClose();
    } catch (error: any) {
      const code = error?.response.data?.code;
      if (code === "EXISTING_USER_EMAIL") {
        setAlert({
          message: "An account with this email already exists",
          status: "error",
        });
      } else {
        setAlert({
          message: "An unexpected error occured",
          status: "error",
        });
      }
    }
  }

  return (
    <>
      {alert && (
        <Alert status={alert.status} zIndex={"popover"}>
          <AlertIcon />
          <AlertDescription>{alert?.message}</AlertDescription>
        </Alert>
      )}

      <Modal isOpen={isOpen} onClose={handleClose} size={["xs", "md"]}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="2xl" fontWeight="semibold">
              Sign Up
            </Text>
            <Text fontSize="medium" fontWeight="normal">
              Already have an account? Log in
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={!isValid}>
                <FormLabel>Email Address</FormLabel>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Enter email address"
                  isInvalid={Boolean(errors.email)}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
                <SimpleGrid columns={[1, 2]} gap={[0, 4]}>
                  <div>
                    <FormLabel mt="5">Password</FormLabel>
                    <Input
                      {...register("password")}
                      type="password"
                      placeholder="Enter password"
                      isInvalid={Boolean(errors.password)}
                    />
                    <FormErrorMessage>
                      {errors.password && errors.password.message}
                    </FormErrorMessage>
                  </div>
                  <div>
                    <FormLabel mt="5">Confirm Password</FormLabel>
                    <Input
                      {...register("confirm")}
                      type="password"
                      placeholder="Confirm password"
                      isInvalid={Boolean(errors.confirm)}
                    />
                    <FormErrorMessage>
                      {errors.confirm && errors.confirm.message}
                    </FormErrorMessage>
                  </div>
                </SimpleGrid>
                <Button
                  mt={"5"}
                  colorScheme="blue"
                  w={"full"}
                  variant="solid"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Sign Up
                </Button>
                <Button
                  mt={"3"}
                  colorScheme="blue"
                  w={"full"}
                  variant="outline"
                  onClick={handleGoogle}
                  isDisabled={isSubmitting}
                >
                  Sign Up with Google
                </Button>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
}
