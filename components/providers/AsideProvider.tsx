import { Menu } from "@/lib/types/main";
import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { TooltipProvider } from "../ui/tooltip";
import { Toaster } from "sonner";
import AsideMenuMobile from "../AsideMenuMobile";
import AsideMenuDesktop from "../AsideMenuDesktop";
import Breadcrumb from "../ui/custom/Breadcrumb";
import RouteTitle from "../RouteTitle";
import Footer from "../Footer";

type Props = {
  children: React.ReactNode;
  menu: Menu[];
};

export default function AsideProvider({ children, menu }: Props) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <Toaster position="top-center" richColors swipeDirections={["left", "right", "top"]} />
        <AsideMenuMobile menu={menu} />
        <div className="container flex flex-row gap-4 items-start my-4 md:my-0">
          <AsideMenuDesktop menu={menu} path="/public-api" />
          <div className="flex-1 p-0 md:p-4">
            <div className="space-y-4">
              <RouteTitle />
              <Breadcrumb />
              {children}
            </div>
          </div>
        </div>
        <Footer />
      </TooltipProvider>
    </ThemeProvider>
  );
}
