import SignOutBtn from "@/components/projects/shop/layouts/SignOutBtn";
import React from "react";
import UserLogin from "./UserLogin";

export default function AdminHome() {
  return (
    <div>
      AdminHome
      <UserLogin />
      <SignOutBtn />
    </div>
  );
}
