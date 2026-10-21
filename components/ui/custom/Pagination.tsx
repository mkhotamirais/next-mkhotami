"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../button";
import { Label } from "../label";
import { Input } from "../input";

interface IPagination {
  totalData: number;
  perPage?: number;
}

export default function Pagination({ totalData, perPage = 1 }: IPagination) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const totalPages = Math.max(1, Math.ceil(totalData / perPage));
  const rawPage = parseInt(searchParams.get("postpage") || "1", 10);
  const currentPage = Math.min(Math.max(Number.isNaN(rawPage) ? 1 : rawPage, 1), totalPages);

  // null = user tidak sedang mengetik, tampilkan currentPage dari URL
  const [draft, setDraft] = useState<string | null>(null);
  const inputValue = draft ?? String(currentPage);

  const goToPage = (newPage: number) => {
    const target = Math.min(Math.max(newPage, 1), totalPages);
    if (target === currentPage) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("postpage", target.toString());
    router.push(`?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = parseInt(draft ?? "", 10);
    if (!Number.isNaN(value)) goToPage(value);
    setDraft(null);
    inputRef.current?.blur();
  };

  return (
    <div className="flex items-center gap-2 py-4">
      <Button size="icon" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous">
        <ChevronLeft />
      </Button>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="productpage" className="sr-only">
          Current Page
        </Label>
        <Input
          ref={inputRef}
          type="number"
          id="productpage"
          name="productpage"
          value={inputValue}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={(e) => e.target.select()}
          onBlur={() => setDraft(null)}
          className="w-12 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0"
          min={1}
          max={totalPages}
        />
      </form>
      <span>/ {totalPages}</span>
      <Button
        size="icon"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
