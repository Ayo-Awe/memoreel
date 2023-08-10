"use client";
import apiClient from "@/services/apiClient";
import useAuthStore from "@/stateManagement/auth/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { login } = useAuthStore();

  async function loginUser(code: string) {
    try {
      const response = await apiClient.post("/auth/oauth/google/callback", {
        code,
      });
      const token = response.headers["x-api-token"];
      const user = response.data.data.user;
      login({ ...user, token });
    } catch (error: any) {
      console.log(error.message);
      router.push("/");
    }
  }

  useEffect(() => {
    if (code) {
      loginUser(code);
      router.push("/dashboard/reels");
    }
  }, [code, router]);

  if (!code) return <p>Something went wrong</p>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
}
