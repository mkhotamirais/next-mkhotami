"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import React, { useState } from "react";
import { acc } from "./acc";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function Acc2() {
  const [openType, setOpenType] = useState<"single" | "multiple">("multiple");

  return (
    <section>
      <div className="mb-2">
        <h2 className="h2">Accordion with Shadcn</h2>
        <ButtonGroup>
          <Button onClick={() => setOpenType("single")} variant="outline">
            {openType === "single" && <Check />}
            Single
          </Button>
          <Button onClick={() => setOpenType("multiple")} variant={"outline"}>
            {openType === "multiple" && <Check />}
            Multiple
          </Button>
        </ButtonGroup>
      </div>
      <Accordion multiple={openType === "multiple"} defaultValue={["Optimasi Tata Letak Grid"]}>
        {acc.map((item, i) => {
          return (
            <AccordionItem key={i} value={item.title} disabled={i === 2}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>{item.description}</AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
}
