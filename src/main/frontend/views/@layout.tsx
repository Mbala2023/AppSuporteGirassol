import type React from "react";
import "@/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Outlet, Navigate } from "react-router";

export default function RootLayout() {

  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}
