import { Box, Card, Text } from "@chakra-ui/react";

interface Props {
  number: number;
  title: string;
  children: string;
}
const HomeCard = ({ number, title, children }: Props) => {
  return (
    <Card
      maxW={"480px"}
      w={"full"}
      height={"328px"}
      rounded={"xl"}
      overflow={"hidden"}
      mb={"6"}
      mx={"auto"}
    >
      <Box
        height={"40%"}
        bgColor={"#cceaf4"}
        position={"relative"}
        padding={"8"}
      >
        <Box
          width={"44px"}
          height={"44px"}
          position={"absolute"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          bottom={"-22px"}
          left={"calc(50% - 22px)"}
          bgColor={"white"}
          rounded={"full"}
          border={"1px"}
          fontWeight={"bold"}
          padding={0}
          fontSize={"1rem"}
        >
          {number}
        </Box>
      </Box>
      <Box textAlign={"center"} paddingX={"8"} paddingBottom={"8"}>
        <Text
          as="h2"
          fontSize={"24px"}
          mt={"2.2rem"}
          fontWeight={"500"}
          color={"#222222"}
        >
          {title}
        </Text>
        <Text as="p" mt={"0.5rem"} fontSize={"18px"} textAlign={"center"}>
          {children}
        </Text>
      </Box>
    </Card>
  );
};

export default HomeCard;
