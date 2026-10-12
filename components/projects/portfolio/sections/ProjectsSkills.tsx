import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import {
  SiAppwrite,
  SiBootstrap,
  SiClerk,
  SiElementor,
  SiExpress,
  SiFirebase,
  SiInertia,
  SiLaravel,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiShadcnui,
  SiSupabase,
  SiTailwindcss,
  SiVuedotjs,
  SiWordpress,
} from "react-icons/si";

export const projects = [
  {
    title: "Warungota",
    url: "https://warungota.com",
    image: "/images/logos/logo-warungota.png",
    skills: "Next.js - Mongodb - Express - React - Node.js",
    skillsIcons: (
      <>
        <SiNextdotjs /> <SiShadcnui /> <SiMongodb /> <SiExpress /> <SiReact /> <SiNodedotjs />
      </>
    ),
  },
  {
    title: "Nurul Iman Sindangkerta",
    url: "https://nuruliman-sindangkerta.sch.id",
    image: "/images/logos/logo-yayasan-nurul-iman-sindangkerta.png",
    skills: "laravel - vue - inertia",
    skillsIcons: (
      <>
        <SiLaravel /> <SiVuedotjs /> <SiInertia />
      </>
    ),
  },
  {
    title: "Panoramaalam",
    url: "https://panoramaalam.id",
    image: "/images/logos/logo-panoramaalam.png",
    skills: "laravel - blade",
    skillsIcons: (
      <>
        <SiLaravel />
      </>
    ),
  },
  {
    title: "Next - Client",
    url: "https://next-client-mkhotami.vercel.app",
    image: "/images/logos/logo-mkhotami.png",
    skills: "Next.js - Shadcn - Publicapi - Motion - Scrollmagic - GSAP",
    skillsIcons: (
      <>
        <SiNextdotjs /> <SiShadcnui />
      </>
    ),
  },
  {
    title: "Rentallombok",
    url: "https://rentallombok.id",
    image: "/images/logos/logo-rentallombok.png",
    skills: "laravel - vue - inertia",
    skillsIcons: (
      <>
        <SiLaravel /> <SiVuedotjs /> <SiInertia />
      </>
    ),
  },
  {
    title: "Next - BaaS",
    url: "https://next-baas.vercel.app",
    image: "/logo-mkhotami.png",
    skills: "Next.js - Firebase - Supabase - Appwrite",
    skillsIcons: (
      <>
        <SiNextdotjs /> <SiFirebase /> <SiSupabase /> <SiAppwrite />
      </>
    ),
  },
  {
    title: "Yukmulau",
    url: "https://yukmulau.id",
    image: "/images/logos/logo-yukmulau.png",
    skills: "WordPress - Elementor",
    skillsIcons: (
      <>
        <SiWordpress /> <SiElementor />
      </>
    ),
  },
  {
    title: "Saikindo",
    url: "https://saikindo.co.id",
    image: "/images/logos/logo-saikindo.png",
    skills: "Next.js - Tailwind CSS - Shadcn UI",
    skillsIcons: (
      <>
        <SiNextdotjs /> <SiTailwindcss /> <SiShadcnui />
      </>
    ),
  },
];

export default function ProjectsSkills() {
  return (
    <section id="skill-projects" className="py-12">
      <div className="">
        <h2 className="h2">Projects & Skills</h2>
        <div className="flex flex-wrap items-center gap-2">
          <SiNextdotjs />
          <SiLaravel />
          <SiWordpress />
          <span>|</span>
          <SiReact />
          <SiVuedotjs />
          <SiElementor />
          <span>|</span>
          <SiTailwindcss />
          <SiShadcnui />
          <SiBootstrap />
          <span>|</span>
          <SiExpress />
          <SiNodedotjs />
          <SiFirebase />
          <SiSupabase />
          <SiAppwrite />
          <SiClerk />
          <SiPrisma />
          <SiInertia />
          <span>|</span>
          <SiPostgresql />
          <SiMongodb />
          <SiMysql />
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {projects.slice(0, 4).map((project, index) => (
            <a
              key={index}
              href={project.url}
              className="group relative border rounded-md p-2 bg-muted-foreground/5 hover:bg-muted-foreground/10 transition-all cursor-pointer"
            >
              <div className="absolute right-1.5 top-1.5">
                <FaExternalLinkAlt className="text-[0.65rem] group-hover:text-xs transition-all text-muted-foreground" />
              </div>
              <div>
                <div className="mb-2 text-[0.9rem] font-medium group-hover:underline flex items-center gap-2">
                  <Image
                    src={project.image}
                    alt="Logo"
                    width={10}
                    height={10}
                    className="size-5 rounded-md object-cover object-center dark:grayscale dark:invert"
                  />
                  <span>{project.title}</span>
                </div>
                <div className="flex items-center gap-2 mb-0.5">{project.skillsIcons}</div>
                <div className="text-xs text-muted-foreground">{project.skills}</div>
              </div>
            </a>
          ))}
        </div>
        <Link href="/projects" className="mt-4 inline-block">
          <Button variant={"secondary"}>All Projects</Button>
        </Link>
      </div>
    </section>
  );
}
