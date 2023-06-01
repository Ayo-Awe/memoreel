import useStore from "@/hooks/useStore";
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
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  onSignupClick: () => void;
  onLoginClick: () => void;
}

export default function NavBar({ onSignupClick, onLoginClick }: Props) {
  const authStore = useStore(useAuthStore, (state) => state);
  const router = useRouter();

  return (
    <>
      <Flex justifyContent={"space-between"}>
        <Image src="/logo.svg" alt="logo" />

        {authStore?.user ? (
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              bgColor={"white"}
              border={"1px"}
              borderColor={"#474747"}
              color={"#474747"}
            >
              {authStore.user.email}
            </MenuButton>
            <MenuList>
              <MenuItem icon={<ViewIcon />} href={"/dashboard/reels"} as={Link}>
                My videos
              </MenuItem>
              <MenuItem href={"/dashboard/settings"} as={Link}>
                Manage account
              </MenuItem>
              <MenuItem
                onClick={() => {
                  router.push("/");
                  authStore.logout();
                }}
              >
                Sign out
              </MenuItem>
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
