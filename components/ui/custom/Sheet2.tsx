import React from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface ISheet2 {
  title: string | React.ReactNode;
  children?: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left" | undefined;
}

export default function Sheet2({ title, children, side }: ISheet2) {
  return (
    <Sheet>
      <SheetTrigger className={buttonVariants({ variant: "outline", size: "icon" })}>
        <Menu />
      </SheetTrigger>
      <SheetContent side={side} className="w-64">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription className="hidden"></SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
