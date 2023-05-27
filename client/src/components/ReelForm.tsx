import {
  AspectRatio,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { HiOutlineCloudArrowUp } from "react-icons/hi2";

const ReelForm = ({ email }: { email?: string }) => {
  return (
    <form>
      <FormControl>
        <Flex gap={"3rem"}>
          <AspectRatio ratio={1.576} flexGrow={6}>
            <FormLabel
              border={"dashed"}
              borderColor={"#0096C6"}
              borderWidth={"2px"}
              rounded={"2xl"}
              maxH={"450px"}
            >
              <HiOutlineCloudArrowUp fontSize={"3.5rem"} color="#0096C6" />
              <Input
                type="file"
                border={"dashed"}
                textAlign={"center"}
                display={"none"}
              />
            </FormLabel>
          </AspectRatio>
          <Box maxW={"2xl"} marginX={"auto"} color={"#909090"} flexGrow={1}>
            <FormLabel htmlFor="form-title">Video Title</FormLabel>
            <Input
              type="text"
              id="form-title"
              placeholder="Enter title of the video"
            />
            <FormLabel mt={"2rem"} htmlFor="form-description">
              Video Description (optional)
            </FormLabel>
            <Textarea
              name="description"
              placeholder="This video is to..."
              id="form-description"
            />
            <FormLabel mt={"2rem"} htmlFor="form-email">
              Enter your email address (optional)
            </FormLabel>
            <Input
              id="form-email"
              type="email"
              isDisabled={Boolean(email)}
              value={email}
              placeholder="Email address"
            />
            <FormLabel mt={"2rem"} htmlFor="form-date">
              Select a date to receive the video
            </FormLabel>
            <Input
              id="form-date"
              type="date"
              isDisabled={Boolean(email)}
              value={email}
            />
            <Button
              mt={"2rem"}
              width={"full"}
              bgColor={"#0096C6"}
              color={"white"}
            >
              Send Now
            </Button>
          </Box>
        </Flex>
      </FormControl>
    </form>
  );
};

export default ReelForm;
