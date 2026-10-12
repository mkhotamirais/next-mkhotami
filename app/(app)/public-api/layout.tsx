import AsideMenuDesktop from "@/components/AsideMenuDesktop";
import AsideMenuMobile from "@/components/AsideMenuMobile";
import React from "react";
import c from "@/lib/content/public-api.json";
import Breadcrumb from "@/components/ui/custom/Breadcrumb";
import RouteTitle from "@/components/RouteTitle";
import Footer from "@/components/projects/main/layout/Footer";

const menu = c.menu;

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AsideMenuMobile menu={menu} path="/public-api" />
      <div className="container flex flex-row gap-4 items-start min-h-screen my-2">
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
    </>
  );
}
