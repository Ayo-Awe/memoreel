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
} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupModal({ isOpen, onClose }: Props) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={["xs", "md"]}>
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
            <FormControl>
              <FormLabel>Email Address</FormLabel>
              <Input type="email" placeholder="Enter email address" />
              <SimpleGrid columns={[1, 2]} gap={[0, 4]}>
                <div>
                  <FormLabel mt="5">Password</FormLabel>
                  <Input type="password" placeholder="Enter password" />
                </div>
                <div>
                  <FormLabel mt="5">Confirm Password</FormLabel>
                  <Input type="password" placeholder="Confirm password" />
                </div>
              </SimpleGrid>
              <Button mt={"5"} colorScheme="blue" w={"full"} variant="solid">
                Sign Up
              </Button>
              <Button mt={"3"} colorScheme="blue" w={"full"} variant="outline">
                Sign Up with Google
              </Button>
            </FormControl>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
}
