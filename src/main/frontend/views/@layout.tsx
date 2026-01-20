import type React from "react";
import "@/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Outlet, Navigate } from "react-router";
import { AuthProvider } from "Frontend/auth";

export default function RootLayout() {

  return (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  );
}
