import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Grid,
  GridItem,
  Icon,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import { FaArrowRight, FaClock, FaTrash } from "react-icons/fa";

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
    <Box
      border={"1px"}
      borderColor={"#d8d8d8"}
      rounded={"lg "}
      padding={"4"}
      mb={"8"}
    >
      <Box
        display={"flex"}
        flexWrap={"wrap"}
        justifyContent={"space-between"}
        w={"full"}
        alignItems={"center"}
      >
        <Text
          fontSize={"lg"}
          fontWeight={"semibold"}
          color={"#0090c6"}
          display={"inline-block"}
          mb={"4"}
        >
          {title}
        </Text>
        <ButtonGroup gap={"2"} display={"inline-block"} mb={"4"}>
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
              // rightIcon={<FaClock />}
              isDisabled={status !== "delivered"}
              textAlign={"center"}
              as={Link}
              py={"2"}
              href={`/reels/watch?w=${deliveryToken}`}
              maxW={"9rem"}
              display={"inline"}
              fontSize={"sm"}
            >
              Watch
            </Button>
          </Tooltip>
          <Button
            variant={"outline"}
            colorScheme="red"
            display={"inline"}
            border={"1px"}
            maxW={"9rem"}
            onClick={() => onDelete({ id, status })}
            fontSize={"sm"}
            h={"8"}
          >
            Delete
          </Button>
        </ButtonGroup>
      </Box>

      <Box fontSize={"sm"}>
        <Box textAlign={"center"} display={"inline-block"} mr={"6"}>
          <Text fontWeight={"semibold"} color={"gray.500"}>
            Date created
          </Text>
          <Text fontWeight={"bold"} color={"#474747"}>
            {moment(createdAt).format("MMM D, YYYY")}
          </Text>
        </Box>
        <Box display={"inline-flex"} mr={"4"}>
          <FaArrowRight display={"inline"} color="#0096c6" />
        </Box>
        <Box textAlign={"center"} display={"inline-block"}>
          <Text fontWeight={"semibold"} color={"gray.500"}>
            Delivery Date
          </Text>
          <Text fontWeight={"bold"} color={"#474747"}>
            {moment(deliveryDate).format("MMM D, YYYY")}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default ReelCard;
