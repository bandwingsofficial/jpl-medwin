"use client";

import { createContext, useContext, useState } from "react";

interface AuthModalContextType {
  loginOpen: boolean;
  setLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <AuthModalContext.Provider
      value={{
        loginOpen,
        setLoginOpen,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);

  if (!context) {
    throw new Error("useAuthModal must be used inside AuthModalProvider");
  }

  return context;
}