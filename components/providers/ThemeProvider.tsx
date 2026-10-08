"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Trik pembungkam error spesifik React 19 + next-themes di mode Dev
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args) => {
    // Jika error mendeteksi tag <script> dari next-themes, abaikan saja
    if (args[0]?.toString().includes("Encountered a script tag while rendering React component")) {
      return;
    }
    originalError(...args);
  };
}

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
