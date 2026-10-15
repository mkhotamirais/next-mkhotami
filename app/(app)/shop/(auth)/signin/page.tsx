import React from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";

export default function Signin() {
  return (
    <>
      <h1 className="h1 text-center mb-4">Sign In</h1>
      <LoginForm />
      <p className="mt-8 text-center">
        Don&apos;t have an account?{" "}
        <Link href="/shop/signup" className={"text-link"}>
          Sign Up
        </Link>
      </p>
    </>
  );
}
