import React from "react";
import NavDesktop from "./NavDesktop";
import NavMobile from "./NavMobile";
import Logo from "../Logo";

export default function Header() {
  return (
    <header className="h-16 sticky top-0 z-10 border-b">
      <div className="container flex items-center justify-between">
        {/* <div className="flex justify-between items-center h-full"> */}
        <Logo />
        <NavDesktop />
        <NavMobile />
        {/* </div> */}
      </div>
    </header>
  );
}
