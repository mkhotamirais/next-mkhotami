"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { useParams } from "next/navigation";
import { Check, Globe } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "cn";

const LANGUAGES: Record<string, { label: string; short: string }> = {
  id: { label: "Indonesia", short: "ID" },
  en: { label: "English", short: "EN" },
  ar: { label: "العربية", short: "AR" },
};

export default function SwitchLangBtn() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const handleChange = (nextLocale: string) => {
    if (nextLocale === locale) return;

    startTransition(() => {
      router.replace(
        // @ts-expect-error -- pathname dan params selalu cocok
        { pathname, params },
        { locale: nextLocale },
      );
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
        disabled={isPending}
        aria-label="Pilih bahasa"
      >
        <Globe className="h-4 w-4" />
        {LANGUAGES[locale]?.short ?? locale.toUpperCase()}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {routing.locales.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => handleChange(l)}
            className="flex items-center justify-between gap-4"
            lang={l}
          >
            <span>{LANGUAGES[l]?.label ?? l}</span>
            {l === locale && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
