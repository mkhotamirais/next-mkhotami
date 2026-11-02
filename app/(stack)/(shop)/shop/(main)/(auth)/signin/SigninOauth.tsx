"use client";

import { signIn } from "next-auth/react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { SiGoogle, SiGithub } from "react-icons/si";

export function SigninGoogle({ label = "Login With Google" }: { label?: string }) {
  const [pending, startTransition] = useTransition();

  const handleSignInGoogle = async () => {
    startTransition(async () => {
      await signIn("google");
    });
  };

  return (
    <Button type="button" variant={"outline"} disabled={pending} onClick={handleSignInGoogle} className="w-full">
      {pending && <Spinner />}
      <SiGoogle className="mr-2" /> {label}
    </Button>
  );
}

export function SigninGithub({ label = "Login With Github" }: { label?: string }) {
  const [pending, startTransition] = useTransition();

  const handleSignInGithub = async () => {
    startTransition(async () => {
      await signIn("github");
    });
  };
  return (
    <Button type="button" variant={"outline"} disabled={pending} onClick={handleSignInGithub} className="w-full">
      {pending && <Spinner />}
      <SiGithub className="mr-2" /> {label}
    </Button>
  );
}
