import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineCloudArrowUp } from "react-icons/hi2";
import { z } from "zod";

const twoDaysFromNow = moment().add(2, "d").startOf("d").toDate();

const schema = z.object({
  title: z
    .string({
      invalid_type_error: "Title is required",
      required_error: "Title is required",
    })
    .nonempty(),
  email: z
    .string({
      invalid_type_error: "Email is required",
      required_error: "Email is required",
    })
    .email("Please provide a valid email"),
  description: z.string().optional(),
  deliveryDate: z
    .date({
      invalid_type_error: "Delivery date is required",
      required_error: "Delivery date is required",
    })
    .min(twoDaysFromNow, "Delivery date must be at least 2 days from today"),
  video: z
    .custom<FileList>((v: any) => v[0] instanceof File, {
      message: "Video is required",
    })
    .transform((v: FileList) => v[0]),
});

type ReelFormData = z.infer<typeof schema>;

interface Props {
  email?: string;
  onSubmit: (data: ReelFormData) => void;
  isLoading: boolean;
  success: boolean;
}

const ReelForm = ({ email, onSubmit, isLoading, success }: Props) => {
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<ReelFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: email,
    },
  });

  useEffect(() => {
    if (success) reset();
  }, [success]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        isInvalid={!isValid}
        isDisabled={isLoading}
        fontSize={"1rem"}
      >
        <Grid
          gap={"3rem"}
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(1, 1fr)",
            "repeat(10, 1fr)",
          ]}
        >
          <Box
            as={GridItem}
            colSpan={[1, 1, 6]}
            w={"full"}
            aspectRatio={16 / 9}
            border={"dashed"}
            borderColor={"#0096C6"}
            borderWidth={"2px"}
            rounded={"2xl"}
          >
            <FormLabel
              w={"full"}
              h={"full"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <HiOutlineCloudArrowUp fontSize={"3.5rem"} color="#0096C6" />
              <Input
                type="file"
                accept="video/*"
                border={"dashed"}
                textAlign={"center"}
                display={"none"}
                {...register("video")}
                isInvalid={Boolean(errors.video)}
              />
              {watch("video") && watch("video").length > 0 ? (
                // @ts-ignore
                watch("video")[0].name
              ) : (
                <FormErrorMessage>
                  {errors.video && errors.video.message}
                </FormErrorMessage>
              )}
            </FormLabel>
          </Box>

          <Box
            as={GridItem}
            maxW={"2xl"}
            marginX={"auto"}
            color={"#909090"}
            colSpan={[1, 1, 4]}
            w={"full"}
          >
            <FormLabel htmlFor="form-title">Video Title</FormLabel>
            <Input
              type="text"
              id="form-title"
              placeholder="Enter title of the video"
              {...register("title")}
              isInvalid={Boolean(errors.title)}
            />
            <FormErrorMessage>
              {errors.title && errors.title.message}
            </FormErrorMessage>
            <FormLabel mt={"1rem"} htmlFor="form-description">
              Video Description (optional)
            </FormLabel>
            <Textarea
              placeholder="This video is to..."
              id="form-description"
              {...register("description")}
              isInvalid={Boolean(errors.description)}
            />
            <FormErrorMessage>
              {errors.description && errors.description.message}
            </FormErrorMessage>
            <FormLabel mt={"1rem"} htmlFor="form-email">
              Enter your email address (optional)
            </FormLabel>
            <Input
              id="form-email"
              type="email"
              isDisabled={Boolean(email)}
              placeholder="Email address"
              {...register("email")}
              isInvalid={Boolean(errors.email)}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
            <FormLabel mt={"1rem"} htmlFor="form-date">
              Select a date to receive the video
            </FormLabel>
            <Input
              id="form-date"
              min={moment().add(2, "d").format("YYYY-MM-DD")}
              type="date"
              {...register("deliveryDate", { valueAsDate: true })}
              isInvalid={Boolean(errors.deliveryDate)}
            />
            <FormErrorMessage>
              {errors.deliveryDate && errors.deliveryDate.message}
            </FormErrorMessage>
            <Button
              mt={"2rem"}
              width={"full"}
              bgColor={"#0096C6"}
              color={"white"}
              type="submit"
              isLoading={isLoading}
            >
              Send Now
            </Button>
          </Box>
        </Grid>
      </FormControl>
    </form>
  );
};

export default ReelForm;
