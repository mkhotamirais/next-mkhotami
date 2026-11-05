import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SigninGithub, SigninGoogle } from "../signin/SigninOauth";
import SignupForm from "./SignupForm";

export default function Signup() {
  return (
    <>
      <h1 className="h1 text-center mb-6">Sign Up</h1>
      <div className="space-y-4">
        <SigninGoogle label="Sign Up With Google" />
        <SigninGithub label="Sign Up With Github" />
      </div>
      <Separator className="my-4" />
      <SignupForm />
      <p className="mt-8 text-center">
        Already have an account?{" "}
        <Link href="/shop/signin" className="text-link">
          Sign In
        </Link>
      </p>
    </>
  );
}
