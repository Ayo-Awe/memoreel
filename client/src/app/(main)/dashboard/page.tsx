"use client";
import useAuthStore from "@/state-management/auth/store";
import { redirect } from "next/navigation";

const Page = () => {
  const { user } = useAuthStore();

  if (!user) {
    redirect("/");
  }

  return (
    <>
      <p>hello</p>
    </>
  );
};

export default Page;
