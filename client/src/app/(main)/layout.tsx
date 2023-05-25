"use client";

import NavBar from "@/components/NavBar";
import { useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <section className="main">
      <NavBar
        isLoginModalOpen={isLoginModalOpen}
        isSignupModalOpen={isSignupModalOpen}
        openSignupModal={() => setSignupModalOpen(true)}
        openLoginModal={() => setLoginModalOpen(true)}
        onLoginModalClose={() => setLoginModalOpen(false)}
        onSignupModalClose={() => setSignupModalOpen(false)}
      />

      {children}
    </section>
  );
}
