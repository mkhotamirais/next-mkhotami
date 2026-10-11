import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Menu, X } from "lucide-react";
import React from "react";
import { useNavMobileTopPush } from "./useNavMobileTopPush";
import { cn } from "cn";

export default function NavMobileTopPushBtn() {
  const { open, setOpen } = useNavMobileTopPush();
  return (
    <Tooltip>
      {/* <TooltipTrigger asChild>
        <Button type="button" aria-label="mobile menu" size={"icon"} variant={"outline"} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </Button>
      </TooltipTrigger> */}
      <TooltipTrigger
        type="button"
        aria-label="mobile menu"
        className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </TooltipTrigger>
      <TooltipContent>
        <p>Nav Mobile Top Push</p>
      </TooltipContent>
    </Tooltip>
  );
}
