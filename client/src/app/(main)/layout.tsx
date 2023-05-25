"use client";

import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import NavBar from "@/components/NavBar";
import SignupModal from "@/components/SignupModal";
import { useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <>
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setSignupModalOpen(false)}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
      <section className="main">
        <NavBar
          onSignupClick={() => setSignupModalOpen(true)}
          onLoginClick={() => setLoginModalOpen(true)}
        />

        {children}
      </section>
      <Footer />
    </>
  );
}
