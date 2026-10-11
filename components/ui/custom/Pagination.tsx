"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
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

  const totalPages = Math.ceil(totalData / perPage);
  const currentPage = parseInt(searchParams.get("postpage") || "1");
  const [inputValue, setInputValue] = useState<number | "">(currentPage);

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("postpage", newPage.toString());
    router.push(`?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue !== "") goToPage(inputValue);
  };

  const onPrev = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  const onNext = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  return (
    <div className="flex items-center gap-2 py-4">
      <Button size={"icon"} onClick={onPrev} disabled={currentPage === 1} aria-label="Previous">
        <ChevronLeft />
      </Button>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="productpage" className="sr-only">
          Current Page
        </Label>
        <Input
          type="number"
          id="productpage"
          name="productpage"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value === "" ? "" : Number(e.target.value))}
          onFocus={(e) => e.target.select()}
          onBlur={() => setInputValue(currentPage)}
          className="w-12 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0"
          min={1}
          max={totalPages}
        />
      </form>
      <span>/ {totalPages}</span>
      <Button size={"icon"} onClick={onNext} disabled={currentPage === totalPages} aria-label="Next">
        <ChevronRight />
      </Button>
    </div>
  );
}
