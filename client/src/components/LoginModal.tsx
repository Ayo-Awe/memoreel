import useAuthStore from "@/state-management/auth/store";
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
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: Props) {
  const { login } = useAuthStore();
  const router = useRouter();
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={["xs", "md"]}>
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
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Email Address</FormLabel>
              <Input type="email" placeholder="Enter email address" />
              <FormLabel mt="5">Password</FormLabel>
              <Input type="password" placeholder="Enter password" />
              <Button
                mt={"5"}
                colorScheme="blue"
                w={"full"}
                variant="solid"
                onClick={() => {
                  login({
                    firstName: "Ayo",
                    lastName: "Awe",
                    email: "pupoawe@gmail.com",
                    id: 1,
                    token: "joiw",
                  });
                  router.push("/dashboard");
                }}
              >
                Log in
              </Button>
              <Button mt={"3"} colorScheme="blue" w={"full"} variant="outline">
                Log in with Google
              </Button>
            </FormControl>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
}
