import Logo from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import c from "@/lib/content/portfolio.json";
import { cn } from "cn";
import Link from "next/link";

const nextSubMenu = c.menu.find((menu) => menu.label === "Next")?.sub_menu;

const aboutMeMenu = [
  { label: "Home", url: "/" },
  { label: "Portfolio", url: "/portfolio" },
  { label: "Components", url: "/components" },
  { label: "Simple Apps", url: "/simple-apps" },
  { label: "Public Api", url: "/public-api" },
  { label: "Baas", url: "/baas" },
];

export default function Footer({ container = "container" }: { container?: string }) {
  return (
    <footer className="pb-4 pt-8 border-t bg-background">
      <div className={`${container}`}>
        <div className="flex items-center justify-between mb-8">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-8 space-y-6">
          <nav>
            <h2 className="font-semibold mb-2">About Me</h2>
            <ul>
              {aboutMeMenu.map((item, i) => (
                <li key={i}>
                  <Link href={item.url} className={cn(buttonVariants({ variant: "link", size: "sm" }), "px-0")}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {nextSubMenu?.map((x, i) => (
            <nav key={i}>
              <h2 className="font-semibold mb-2">{x.label}</h2>
              <ul>
                {x.sub_menu.map((item, i) => (
                  <li key={i}>
                    <Link href={item.url} className={cn(buttonVariants({ variant: "link", size: "sm" }), "px-0")}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <Separator className={"mb-4"} />
        <p className="text-xs text-center">
          Build with Next.js and deployed on Vercel and Posts written in Markdown by Mkhotami
        </p>
      </div>
    </footer>
  );
}
