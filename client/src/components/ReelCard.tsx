import {
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  Icon,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import { FaClock, FaTrash } from "react-icons/fa";

import { HiFilm } from "react-icons/hi";

interface Props {
  id: number;
  title: string;
  createdAt: string;
  deliveryDate: string;
  deliveryToken: string;
  status: string;
  onDelete: (data: { id: number; status: string }) => void;
}
const ReelCard = ({
  title,
  createdAt,
  deliveryDate,
  status,
  onDelete,
  deliveryToken,
  id,
}: Props) => {
  return (
    <Grid
      border={"1px"}
      borderColor={"#d8d8d8"}
      rounded={"lg "}
      padding={"4"}
      templateColumns={"repeat(6, 1fr)"}
      alignItems={"center"}
      mb={"8"}
    >
      <Icon as={HiFilm} fontSize={"8xl"} color={"#d8d8d8"} />
      <Box textAlign={"center"} as={GridItem} colSpan={1}>
        <Text fontSize={"sm"}>Title</Text>
        <Text>{title}</Text>
      </Box>
      <Box textAlign={"center"}>
        <Text fontSize={"sm"}>Date created</Text>
        <Text>{moment(createdAt).format("Do MMMM, YYYY")}</Text>
      </Box>
      <Box textAlign={"center"} as={GridItem} colSpan={1}>
        <Text fontSize={"sm"}>Delivery Date</Text>
        <Text>{moment(deliveryDate).format("Do MMMM, YYYY")}</Text>
      </Box>

      <Center w={"full"} as={GridItem} colSpan={2}>
        <Tooltip
          label="You can't watch this video until it's delivered"
          hasArrow
          padding={"3"}
          maxW={"12rem"}
          bgColor={"#0096c6"}
          color={"white"}
          isDisabled={status === "delivered"}
        >
          <Button
            bgColor={"#CCEAF4"}
            color={"#0096c6"}
            _hover={{ bg: "#d2f0fa" }}
            rightIcon={<FaClock />}
            isDisabled={status !== "delivered"}
            as={Link}
            href={`/reels/watch?w=${deliveryToken}`}
            maxW={"9rem"}
            w={"full"}
          >
            Watch Now
          </Button>
        </Tooltip>
        <Button
          variant={"outline"}
          colorScheme="red"
          border={"2px"}
          w={"full"}
          maxW={"9rem"}
          flexGrow={1}
          rightIcon={<FaTrash />}
          ml={"4"}
          onClick={() => onDelete({ id, status })}
        >
          Delete
        </Button>
      </Center>
    </Grid>
  );
};

export default ReelCard;
