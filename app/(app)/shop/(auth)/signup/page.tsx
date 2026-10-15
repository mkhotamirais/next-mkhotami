import React from "react";
import RegisterForm from "./RegisterForm";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { LoginGoogle } from "../signin/LoginGoogle";

export default function Register() {
  return (
    <>
      <h1 className="h1 text-center mb-4">Sign Up</h1>
      <LoginGoogle label="Sign Up With Google" />
      <Separator className="my-4" />
      <RegisterForm />
      <p className="mt-8 text-center">
        Already have an account?{" "}
        <Link href="/shop/signin" className="text-link">
          Sign In
        </Link>
      </p>
    </>
  );
}
