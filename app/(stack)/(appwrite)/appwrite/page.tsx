import { AuthPanel } from "@/components/projects/appwrite/layouts/AuthPanel";
import { account } from "@/lib/appwrite";
import { appwrite } from "@/lib/constants/appwrite";
import { createNextServerHelpers } from "@appwrite.io/react/server/next";
import Link from "next/link";
import React from "react";
import SignoutButton from "./SignoutButton";

export default async function Home() {
  const helpers = createNextServerHelpers(appwrite);
  const user = await helpers.getLoggedInUser();

  // const isLoggedIn = !!user;

  return (
    <div>
      <h1>Appwrite React library on Next.js</h1>
      {/* <p>SSR user: {isLoggedIn ?? <SignoutButton />}</p> */}
      {/* <AuthPanel /> */}
      <SignoutButton />
      <Link href="/appwrite/signin">Sign in</Link>
    </div>
  );
}
