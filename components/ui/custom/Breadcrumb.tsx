"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { smartTrim } from "@/lib/utils";

type BreadcrumbProps = {
  initialPath?: string;
  initialLabel?: string;
  className?: string;
};

export default function Breadcrumb({ initialPath = "/", initialLabel = "Home", className }: BreadcrumbProps) {
  const pathname = usePathname();

  const pathArray = pathname.split("/").filter(Boolean);

  return (
    <BreadcrumbRoot className={`${className} mb-4`}>
      <BreadcrumbList>
        {/* Initial/Root */}
        <BreadcrumbItem>
          <BreadcrumbLink href={initialPath}>{initialLabel}</BreadcrumbLink>
        </BreadcrumbItem>

        {pathArray.map((segment, index) => {
          const href = "/" + pathArray.slice(0, index + 1).join("/");
          const isLast = index === pathArray.length - 1;

          const label = smartTrim(
            segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
            30, // potong kalau lebih dari 30 karakter
          );

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbRoot>
  );
}
