import { Button, Flex, Image } from "@chakra-ui/react";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

interface Props {
  onSignupModalClose: () => void;
  onLoginModalClose: () => void;
  openSignupModal: () => void;
  openLoginModal: () => void;
  isSignupModalOpen: boolean;
  isLoginModalOpen: boolean;
}

export default function NavBar(props: Props) {
  return (
    <>
      <SignupModal
        isOpen={props.isSignupModalOpen}
        onClose={props.onSignupModalClose}
      />
      <LoginModal
        isOpen={props.isLoginModalOpen}
        onClose={props.onLoginModalClose}
      />
      <Flex justifyContent={"space-between"}>
        <Image src="/logo.svg" alt="logo" />
        <div>
          <Button
            px={"8"}
            backgroundColor="#0096C6"
            _hover={{ bg: "#11a7d7" }}
            onClick={props.openSignupModal}
            color={"white"}
          >
            Sign Up
          </Button>
          <Button
            backgroundColor={"#CCEAF4"}
            ml={"5"}
            px={"8"}
            _hover={{ bg: "#d2f0fa" }}
            onClick={props.openLoginModal}
            color={"#0096C6"}
          >
            Log in
          </Button>
        </div>
      </Flex>
    </>
  );
}
