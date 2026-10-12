import Image from "next/image";
import { FaDownload, FaEye, FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import c from "@/lib/content/portfolio.json";

export default function Hero() {
  const contact = c.contact;
  const home = c.home;

  return (
    <section id="hero" className="py-12">
      <div className="">
        <div className="flex flex-col sm:flex-row items-left sm:items-center justify-between gap-8">
          <div className="order-2 sm:order-1 space-y-3">
            <h1 className="h1">Hello, I am Mkhotami</h1>
            <p className="leading-relaxed text-muted-foreground">
              I’m a fullstack web developer with expertise in
              <span className="text-primary font-medium"> Next.js, Laravel, and WordPress. </span>I currently work as a
              freelance web developer, helping businesses build modern and scalable websites.{" "}
              <Link href="/about" className="underline text-primary">
                More about me
              </Link>
            </p>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger className={buttonVariants({ size: "default" })}>View CV</DropdownMenuTrigger>
                <DropdownMenuContent className={"w-fit"}>
                  <DropdownMenuItem>
                    <a href={home.cvDownloadPdf} className="flex items-center">
                      <FaDownload className="mr-1" />
                      Download PDF
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <a href={home.cvPreview} className="flex items-center">
                      <FaEye className="mr-1" />
                      View Online
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <a
                href={contact.github.url}
                aria-label="GitHub Profile"
                className={buttonVariants({ variant: "secondary", size: "icon" })}
              >
                <FaGithub className="text-lg" />
              </a>
              <a
                href={contact.linkedin.url}
                aria-label="Linkedin Profile"
                className={buttonVariants({ variant: "secondary", size: "icon" })}
              >
                <FaLinkedinIn className="text-lg" />
              </a>
            </div>
          </div>
          <Image
            src="/images/profile-mkhotami-samping-square.jpg"
            alt="Logo"
            width={200}
            height={200}
            className="order-1 sm:order-2 size-40 rounded-xl object-cover object-center dark:grayscale"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
