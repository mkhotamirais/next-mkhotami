import Image from "next/image";
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
import { Metadata } from "next";
import { projects } from "./ProjectsSkills";

export const metadata: Metadata = {
  title: "Projects | Mkhotami - Web Development Portfolio",
  description:
    "Explore a collection of Mkhotami's web development projects, built with technologies like React, Next.js, Laravel, and WordPress. Real-world solutions focused on performance and usability.",
};

export default function Projects() {
  return (
    <section className="py-8">
      <div className="">
        <h1 className="h1">Projects & Skills</h1>
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
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((project, index) => (
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
      </div>
    </section>
  );
}
