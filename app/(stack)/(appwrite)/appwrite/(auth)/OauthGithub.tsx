"use client";

import { Button } from "@/components/ui/button";
import { account } from "@/lib/appwrite";
import { baseUrl } from "@/lib/constants/main";
import { OAuthProvider } from "appwrite";
import { FaGithub } from "react-icons/fa6";

export default function OauthGithub() {
  const handleSignInGithub = () => {
    account.createOAuth2Session({
      provider: OAuthProvider.Github,
      success: `${baseUrl}/appwrite`, // redirect here on success
      failure: `${baseUrl}/appwrite/signin?error=oauth`, // redirect here on failure
      scopes: ["repo", "user"], // scopes (optional)
    });
  };

  return (
    <Button type="button" onClick={handleSignInGithub} className="w-full py-4">
      <FaGithub className="mr-2" /> Signin with Github
    </Button>
  );
}
