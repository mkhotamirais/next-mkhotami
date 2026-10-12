import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Hero from "@/components/projects/portfolio/sections/Hero";
import ProjectsSkills from "../portfolio/projects/ProjectsSkills";
import Experiences from "@/components/projects/portfolio/sections/Experiences";
import Posts from "../portfolio/posts/page";

export default function PortfolioHome() {
  return (
    <>
      <Hero />
      <ProjectsSkills />
      <Experiences />
      <Posts />
      <section className="pb-8">
        <div className="container flex items-center flex-col justify-center">
          <h1 className="p1-h2">Let’s Connect</h1>
          <Link href="/contact">
            <Button size={"lg"}>Contact Me</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
