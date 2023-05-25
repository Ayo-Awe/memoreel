import { Button, Flex, Image } from "@chakra-ui/react";

interface Props {
  onSignupClick: () => void;
  onLoginClick: () => void;
}

export default function NavBar({ onSignupClick, onLoginClick }: Props) {
  return (
    <>
      <Flex justifyContent={"space-between"}>
        <Image src="/logo.svg" alt="logo" />
        <div>
          <Button
            px={"8"}
            backgroundColor="#0096C6"
            _hover={{ bg: "#11a7d7" }}
            onClick={onSignupClick}
            color={"white"}
          >
            Sign Up
          </Button>
          <Button
            backgroundColor={"#CCEAF4"}
            ml={"5"}
            px={"8"}
            _hover={{ bg: "#d2f0fa" }}
            onClick={onLoginClick}
            color={"#0096C6"}
          >
            Log in
          </Button>
        </div>
      </Flex>
    </>
  );
}
