import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Icon,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { FaClock, FaTrash } from "react-icons/fa";

import { HiFilm } from "react-icons/hi";
const ReelCard = () => {
  return (
    <Flex
      justifyContent={"space-between"}
      alignItems={"center"}
      border={"1px"}
      borderColor={"#d8d8d8"}
      rounded={"lg "}
      padding={"4"}
    >
      <Icon as={HiFilm} fontSize={"8xl"} color={"#d8d8d8"} />
      <Box textAlign={"center"}>
        <Text fontSize={"sm"}>Date created</Text>
        <Text>2nd March, 2023</Text>
      </Box>
      <Box textAlign={"center"}>
        <Text fontSize={"sm"}>Delivery Date</Text>
        <Text>2nd March, 2023</Text>
      </Box>
      <Box textAlign={"center"}>
        <Text fontSize={"sm"}>Recepients 1</Text>
        <Text>pupoawe@gmail.com</Text>
      </Box>

      <ButtonGroup>
        <Tooltip
          label="You can't watch this video until it's delivered"
          hasArrow
          padding={"3"}
          maxW={"12rem"}
          bgColor={"#0096c6"}
          color={"white"}
        >
          <Button
            bgColor={"#CCEAF4"}
            color={"#0096c6"}
            _hover={{ bg: "#d2f0fa" }}
            rightIcon={<FaClock />}
            isDisabled={true}
          >
            Watch Now
          </Button>
        </Tooltip>
        <Button
          variant={"outline"}
          colorScheme="red"
          border={"2px"}
          rightIcon={<FaTrash />}
        >
          Delete
        </Button>
      </ButtonGroup>
    </Flex>
  );
};

export default ReelCard;
