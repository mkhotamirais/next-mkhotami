import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import c from "@/lib/content/main.json";
import Footer from "@/components/projects/main/layout/Footer";
import Header from "@/components/projects/main/layout/Header";

const menu = c.menu;

export default function MainHome() {
  return (
    <>
      <Header />
      <section className="container-sm space-y-6 h-screen flex-1">
        <div className="flex justify-center text-center flex-col items-center py-4 space-y-4">
          <Image
            src="/images/profile-mkhotami-tengah-square.jpg"
            alt="mkhotami"
            width={100}
            height={100}
            className="rounded-full size-24 object-cover object-center mb-4"
          />
          <div>
            <h1 className="text-3xl font-semibold mb-2">Mkhotami</h1>
            <p className="text-lg font-medium text-primary">Web Developer | Software Engineer</p>
          </div>
          <Link href="/portfolio" className={buttonVariants({ variant: "default", size: "lg" })}>
            More about me
          </Link>
        </div>

        <Separator />
        <div>
          <div className="mb-6">
            <h2 className="h2 text-center">Checkout my portfolio</h2>
            <Separator className={"max-w-24 mx-auto bg-black min-h-0.5 rounded"} />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {menu.map((item, i) => (
              <Link href={item.url} key={i} className={buttonVariants({ variant: "secondary" })}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
