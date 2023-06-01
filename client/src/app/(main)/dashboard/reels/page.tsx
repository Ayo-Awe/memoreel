"use client";
import ReelCard from "@/components/ReelCard";
import apiClient from "@/services/apiClient";
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
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPaperPlane, FaRegCheckCircle } from "react-icons/fa";
import { useStore } from "zustand";

interface Reel {
  id: number;
  userEmail: string;
  title: string;
  description: string;
  createdAt: string;
  deliveryDate: string;
  deliveryToken: string;
  status: string;
}

export default function ReelConfirmation() {
  const { user } = useStore(useAuthStore);
  const [deliveredReels, setDeliveredReels] = useState<Reel[]>([]);
  const [sentReels, setSentReels] = useState<Reel[]>([]);
  const toast = useToast();
  const { data: response, isSuccess } = useQuery({
    queryKey: ["me", "reels"],
    queryFn: () =>
      apiClient.get("/me/reels", {
        headers: {
          Authorization: "Bearer " + user?.token,
        },
      }),
  });
  const mutation = useMutation({
    mutationFn: (data: { id: number; status: string }) =>
      apiClient.delete(`/me/reels/${data.id}`, {
        headers: {
          Authorization: "Bearer " + user?.token,
        },
      }),
    onSuccess: (data, variables) => {
      toast({
        title: "Successfully deleted",
        description: `Your reel has been deleted successfully.`,
        status: "success",
        duration: 9000,
        position: "top-left",
        isClosable: true,
      });
    },
    onMutate: (data: { id: number; status: string }) => {
      // optimistic update
      let deleted: Reel | undefined;

      if (data.status === "delivered") {
        deleted = deliveredReels.find((reel) => reel.id === data.id);
        setDeliveredReels((prev) => prev.filter((reel) => reel.id !== data.id));
      } else {
        deleted = sentReels.find((reel) => reel.id === data.id);
        setSentReels((prev) => prev.filter((reel) => reel.id !== data.id));
      }
      return deleted;
    },
    onError: (error, data, reel) => {
      toast({
        title: "Reel not deleted",
        description: `Something went wrong, please try again.`,
        status: "error",
        duration: 9000,
        position: "top-left",
        isClosable: true,
      });
      if (data.status === "delivered") {
        setDeliveredReels((prev) => [...prev, reel!]);
      } else {
        setSentReels((prev) => [...prev, reel!]);
      }
    },
  });

  useEffect(() => {
    // filter data into two
    if (isSuccess) {
      const { data } = response.data;
      setDeliveredReels(
        data.reels.filter((reel: Reel) => reel.status === "delivered")
      );
      setSentReels(
        data.reels.filter((reel: Reel) => reel.status !== "delivered")
      );
    }
  }, [isSuccess, response]);

  return (
    <>
      <Box textAlign={"right"}>
        <Button
          textAlign={"right"}
          bgColor={"#0096C6"}
          color={"white"}
          _hover={{ bg: "#11a7d7" }}
          as={Link}
          href={"/dashboard"}
        >
          Send a video <Icon as={FaPaperPlane} ml={"3"} />
        </Button>
      </Box>

      <Tabs isFitted variant="enclosed" mt={"4"}>
        <TabList mb="1em">
          <Tab color={"#474747"} _selected={{ color: "#0096c6" }}>
            <FaPaperPlane style={{ marginRight: "8px" }} />
            Sent out {sentReels.length}
          </Tab>
          <Tab _selected={{ color: "#0096c6" }} color={"#474747"}>
            <FaRegCheckCircle style={{ marginRight: "8px" }} />
            Delivered {deliveredReels.length}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {sentReels.map((reel: any) => (
              <ReelCard key={reel.id} {...reel} onDelete={mutation.mutate} />
            ))}
          </TabPanel>
          <TabPanel>
            {deliveredReels.map((reel: any) => (
              <ReelCard key={reel.id} {...reel} onDelete={mutation.mutate} />
            ))}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
