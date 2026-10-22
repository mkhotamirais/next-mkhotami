import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import AsideMenuDesktop from "@/components/AsideMenuDesktop";
import React from "react";
import c from "@/lib/content/components.json";
import Breadcrumb from "@/components/ui/custom/Breadcrumb";
import RouteTitle from "@/components/RouteTitle";
import Footer from "@/components/projects/main/layout/Footer";
import Logo from "@/components/Logo";
import NavMobileTopPushContentAllMenu from "@/components/NavMobileContentAllMenu";
import { NavMobileTopPushBtn, NavMobileTopPushContent } from "@/components/ui/navbar/NavMobileTopPush";

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
      <body className="min-h-full flex flex-col w-full bg-zinc-100 dark:bg-zinc-900" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <Toaster position="top-center" richColors swipeDirections={["left", "right", "top"]} />
            <header className="bg-background w-full sticky top-0 z-30 block md:hidden">
              <div className="container flex items-center justify-between min-h-16 w-full">
                <Logo />
                <NavMobileTopPushBtn />
              </div>
              <NavMobileTopPushContentAllMenu />
            </header>
            <div className="container flex flex-row gap-4 items-start min-h-screen my-2">
              <AsideMenuDesktop menu={menu} path="/components" />
              <div className="flex-1 p-0 md:p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <RouteTitle />
                    <NavMobileTopPushBtn className="hidden md:flex" />
                  </div>
                  <NavMobileTopPushContentAllMenu className="hidden md:flex" />
                  <Breadcrumb />
                  {children}
                </div>
              </div>
            </div>
            <Footer />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
