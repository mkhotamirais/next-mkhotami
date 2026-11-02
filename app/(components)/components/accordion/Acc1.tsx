"use client";

import React, { useState } from "react";
import { acc } from "./acc";
import { Check, ChevronDown } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";

export default function Acc1() {
  const [openType, setOpenType] = useState<"single" | "multiple">("multiple");

  const [open, setOpen] = useState<number | null>(null);

  const [openIndexes, setOpenIndexes] = useState<number[]>([]); // Array untuk menyimpan index yang sedang terbuka

  const handleOpen = (isOpen: boolean, i: number) => {
    if (openType === "single") {
      setOpen(isOpen ? null : i);
    } else {
      setOpenIndexes((prev) => (prev.includes(i) ? prev.filter((index) => index !== i) : [...prev, i]));
    }
  };

  return (
    <section>
      <div className="mb-2">
        <h2 className="h2">Accordion simple</h2>
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
      <div className="">
        {acc.map((item, i) => {
          const isOpen = openType === "single" ? open === i : openIndexes.includes(i);

          return (
            <div key={i} className="group border-b last:border-none">
              <button
                type="button"
                onClick={() => handleOpen(isOpen, i)}
                className="flex w-full items-center justify-between py-2 text-left transition-all cursor-pointer"
              >
                <span className={`font-medium transition-colors text-sm group-hover:underline`}>{item.title}</span>
                <ChevronDown
                  className={`size-4 transition-transform duration-300 ease-out ${isOpen ? "rotate-180 text-blue-600" : ""}`}
                />
              </button>

              {/* KONTAINER GRID (The Magic Part) */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 pt-0 text-sm leading-relaxed">{item.description}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
