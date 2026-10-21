import { Button } from "@/components/ui/button";
import React from "react";
import { FaEnvelope, FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa6";
import c from "@/lib/content/portfolio.json";

export default function Contact() {
  const contact = c.contact;
  const title = contact.title;
  const p = contact.p;

  const list = [
    { label: contact.mail.label, url: contact.mail.url, icon: <FaEnvelope /> },
    { label: contact.wa.label, url: contact.wa.url, icon: <FaWhatsapp /> },
    { label: contact.github.label, url: contact.github.url, icon: <FaGithub /> },
    { label: contact.linkedin.label, url: contact.linkedin.url, icon: <FaLinkedin /> },
  ];
  return (
    <section className="py-8" id="contact">
      <div className="">
        <h1 className="h1">{title}</h1>
        <p className="text-muted-foreground mb-8">{p}</p>
        <div className="flex flex-col gap-2">
          {list.map((item, index) => (
            <a href={item.url} key={index} className="w-fit">
              <Button size={"lg"} variant={"link"} className="pl-0!">
                {item.icon}
                {item.label}
              </Button>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
