import React from "react";
import AuthProvider from "../providers/AuthProvider";

export default function MockupsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
