import useAuthStore from "@/stateManagement/auth/store";
import { ChevronDownIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

interface Props {
  onSignupClick: () => void;
  onLoginClick: () => void;
}

export default function NavBar({ onSignupClick, onLoginClick }: Props) {
  const { user } = useAuthStore();
  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email;

  return (
    <>
      <Flex justifyContent={"space-between"}>
        <Image src="/logo.svg" alt="logo" />

        {user ? (
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              bgColor={"white"}
              border={"1px"}
              borderColor={"#474747"}
              color={"#474747"}
            >
              {displayName}
            </MenuButton>
            <MenuList>
              <MenuItem icon={<ViewIcon />}>My videos</MenuItem>
              <MenuItem>Manage account</MenuItem>
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </Menu>
        ) : (
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
        )}
      </Flex>
    </>
  );
}
