"use client";
import ReelCard from "@/components/ReelCard";
import useAuthStore from "@/stateManagement/auth/store";
import {
  Box,
  Button,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { FaPaperPlane, FaRegCheckCircle } from "react-icons/fa";

export default function ReelConfirmation() {
  const { user } = useAuthStore();

  return (
    <>
      <Box textAlign={"right"}>
        <Button
          textAlign={"right"}
          bgColor={"#0096C6"}
          color={"white"}
          _hover={{ bg: "#11a7d7" }}
        >
          Send a video <Icon as={FaPaperPlane} ml={"3"} />
        </Button>
      </Box>

      <Tabs isFitted variant="enclosed" mt={"4"}>
        <TabList mb="1em">
          <Tab color={"#474747"} _selected={{ color: "#0096c6" }}>
            <FaPaperPlane style={{ marginRight: "8px" }} />
            Sent out 2
          </Tab>
          <Tab _selected={{ color: "#0096c6" }} color={"#474747"}>
            <FaRegCheckCircle style={{ marginRight: "8px" }} />
            Delivered 0
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ReelCard />
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
