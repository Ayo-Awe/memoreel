"use client";
import { Box, Grid, GridItem, SimpleGrid, Text } from "@chakra-ui/react";
import ReactPlayer from "react-player";

export default function ReelDeliveryPage() {
  return (
    <>
      <Text fontSize={"2xl"} mb={"2"} fontWeight={"semibold"}>
        A walk in the park{" "}
      </Text>
      <Grid templateColumns="repeat(5, 1fr)">
        <GridItem colSpan={3}>
          <ReactPlayer
            controls={true}
            url={
              "https://memoreel.nyc3.digitaloceanspaces.com/41a9b11b5db0d8da428c09d396321c78?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=DO004FR29NWQWB2KTF88%2F20230529%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230529T202756Z&X-Amz-Expires=900&X-Amz-Signature=d631029a6e47065574b3a7f602a456d2d01861103eba8a10f2e9af77bf47d5e9&X-Amz-SignedHeaders=host&x-id=GetObject"
            }
          />
        </GridItem>

        <GridItem colSpan={2}>
          <Text>Date: May 2018</Text>
          <Text>
            Description: Lorem ipsum dolor sit amet, consectetur adipisicing
            elit. Repudiandae laboriosam accusamus debitis iusto magni provident
            officia ipsam velit nisi perspiciatis, sint enim ipsum, architecto
            voluptatem est odio totam doloremque inventore a quis ea tempore
            tenetur animi. Vitae nulla commodi cumque deserunt neque sunt ipsa
            temporibus a culpa placeat sit, velit debitis recusandae cupiditate
            nihil id possimus nemo nostrum repellendus eum voluptates unde eius
            quia assumenda! Laudantium id reiciendis, aliquam illum debitis
            nulla tempora ducimus asperiores nostrum eos voluptas voluptate
            repudiandae in sit quis amet earum? Quia quibusdam nobis facere
            ratione unde deleniti fugiat ex, quaerat vitae voluptate et illum
            aspernatur?
          </Text>
        </GridItem>
      </Grid>
    </>
  );
}
