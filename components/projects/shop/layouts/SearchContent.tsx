"use client";

import { Button } from "@/components/ui/button";
import { Search, XIcon } from "lucide-react";
import { useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import c from "@/lib/content/portfolio.json";
import m from "@/lib/content/main.json";
import { useRouter } from "next/navigation";

const nextSubMenu = c.menu.find((menu) => menu.label === "Next")?.sub_menu;
const mainMenu = {
  label: "Suggestions",
  url: "/",
  sub_menu: m.menu,
};

const allMenu = [...(nextSubMenu || []), mainMenu];

export default function SearchContent() {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const router = useRouter();

  return (
    <>
      <Button variant="outline" size="icon" onClick={() => setOpen(true)} aria-label="Search">
        <Search />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} className="top-1/2 -translate-y-1/2">
        <Command>
          <div>
            <CommandInput placeholder="Type a command or search..." />
            {searchInput && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchInput("");
                }}
                className="absolute right-2 top-2 rounded-full"
              >
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Clear search input</span>
              </Button>
            )}
          </div>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {allMenu.map((item, i) => (
              <CommandGroup key={i} heading={item.label}>
                {item.sub_menu.map((subItem) => (
                  <CommandItem
                    key={subItem.url}
                    value={subItem.label}
                    onSelect={() => {
                      setOpen(false);
                      router.push(subItem.url);
                    }}
                  >
                    {subItem.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            <CommandSeparator />
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
