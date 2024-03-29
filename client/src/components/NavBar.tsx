import useStore from "@/hooks/useStore";
import useAuthStore from "@/stateManagement/auth/store";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaFilm, FaUser } from "react-icons/fa";
import { HiCog, HiFilm, HiLogout } from "react-icons/hi";

interface Props {
  onSignupClick: () => void;
  onLoginClick: () => void;
}

export default function NavBar({ onSignupClick, onLoginClick }: Props) {
  const authStore = useStore(useAuthStore, (state) => state);
  const router = useRouter();

  return (
    <>
      <Flex justifyContent={"space-between"} paddingX={"6"}>
        <Image
          src="/logo.svg"
          alt="logo"
          w={["24"]}
          onClick={() => {
            router.push("/");
          }}
        />

        {authStore?.user ? (
          <Menu>
            <MenuButton
              as={Button}
              leftIcon={<FaUser />}
              rightIcon={<ChevronDownIcon />}
              bgColor={"white"}
              border={"1px"}
              borderColor={"#474747"}
              color={"#474747"}
              rounded={"full"}
            >
              <Text display={["none", "inline"]}>{authStore.user.email}</Text>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<HiFilm />} href={"/dashboard/reels"} as={Link}>
                My reels
              </MenuItem>
              <MenuItem href={"/dashboard/settings"} as={Link} icon={<HiCog />}>
                Manage account
              </MenuItem>
              <MenuItem
                icon={<HiLogout />}
                href={"/"}
                as={Link}
                onClick={() => {
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
              px={["4", "8"]}
              backgroundColor="#0096C6"
              _hover={{ bg: "#11a7d7" }}
              onClick={onSignupClick}
              color={"white"}
              fontSize={["md"]}
              fontWeight={["normal"]}
            >
              Sign up
            </Button>
            <Button
              backgroundColor={"#CCEAF4"}
              ml={["2.5", "5"]}
              px={["4", "8"]}
              _hover={{ bg: "#d2f0fa" }}
              onClick={onLoginClick}
              color={"#0096C6"}
              fontSize={["md"]}
            >
              Log in
            </Button>
          </div>
        )}
      </Flex>
    </>
  );
}
