import Link from "next/link";
import React from "react";
import UserLogin from "../dashboard/UserLogin";
import { auth } from "@/auth";

export default async function ShopPageeee() {
  const user = await auth();
  // console.log(user);
  return (
    <div>
      <div className="">ShopPageeee</div>
      <UserLogin />
      <Link href="/shop/dashboard">dashboard</Link>
    </div>
  );
}
