import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import React from "react";
import c from "@/lib/content/components.json";
import AsideProvider from "@/components/providers/AsideProvider";

const menu = c.menu;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mkhotami Portfolio - Web Developer | React, Laravel, WordPress",
  description:
    "Mkhotami is a Web Developer who builds modern websites using React, Laravel, and WordPress. Focused on performance, responsiveness, and user experience.",
};

type Props = {
  children: React.ReactNode;
};

export default async function ComponentsLayout({ children }: Props) {
  return (
    <html
      lang={"en"}
      className={`${inter.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="body" suppressHydrationWarning>
        <AsideProvider menu={menu}>{children}</AsideProvider>
      </body>
    </html>
  );
}
