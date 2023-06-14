"use client";

import apiClient from "@/services/apiClient";
import { Grid, GridItem, Spinner, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Error from "next/error";
import { useSearchParams } from "next/navigation";
import ReactPlayer from "react-player";

export default function ReelDeliveryPage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("w");
  const { data, isSuccess, isError, error, isLoading } = useQuery({
    queryKey: ["reels", token],
    queryFn: () => apiClient.get(`/reels/${token}`),
  });

  if (!token) return <Error statusCode={404} />;

  return (
    <>
      {isLoading && <Spinner />}

      {isSuccess && (
        <>
          <Text fontSize={"2xl"} mb={"2"} fontWeight={"semibold"}>
            {data.data.data.reel.title}
          </Text>
          <Grid templateColumns="repeat(5, 1fr)">
            <GridItem colSpan={3}>
              <ReactPlayer controls={true} url={data.data.data.url} />
            </GridItem>

            <GridItem colSpan={2}>
              <Text>
                Date:{" "}
                {moment(data.data.data.reel.createdAt).format("Do MMMM, YYYY.")}
              </Text>
              <Text>Description: {data.data.data.reel.description}</Text>
            </GridItem>
          </Grid>
        </>
      )}
    </>
  );
}
