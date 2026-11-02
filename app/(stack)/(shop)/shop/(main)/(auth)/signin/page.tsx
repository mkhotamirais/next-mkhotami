import React from "react";
import SigninForm from "./SigninForm";
import Link from "next/link";
import { SigninGithub, SigninGoogle } from "./SigninOauth";
import { Separator } from "@/components/ui/separator";

export default function Signin() {
  return (
    <>
      <h1 className="h1 text-center mb-6">Sign In</h1>
      <div className="space-y-4">
        <SigninGoogle label="Sign in with Google" />
        <SigninGithub label="Sign in with Github" />
      </div>
      <Separator className="my-4" />
      <SigninForm />
      <p className="mt-8 text-center">
        Don&apos;t have an account?{" "}
        <Link href="/shop/signup" className={"text-link"}>
          Sign Up
        </Link>
      </p>
    </>
  );
}
