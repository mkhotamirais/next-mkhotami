"use client";

import Sheet2 from "@/components/ui/custom/Sheet2";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface IFilterPostSide {
  categories: (string | undefined)[];
  tags: (string | undefined)[];
}

export default function FilterPostSide({ categories, tags }: IFilterPostSide) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlParams = new URLSearchParams(searchParams.toString());
  const params = useMemo(() => Object.fromEntries(searchParams), [searchParams]);

  const onPostCategory = (cat: string | undefined) => {
    urlParams.set("postcategory", cat!);
    router.push(`?${urlParams.toString()}`);
  };

  const onRemovePostCategory = () => {
    urlParams.delete("postcategory");
    router.push(`?${urlParams.toString()}`);
  };

  const onPostTags = (tag: string | undefined) => {
    const currentTags = urlParams.get("posttags")?.split(",") ?? [];

    const isSelected = currentTags.includes(tag!);
    const updatedTags = isSelected ? currentTags.filter((id) => id !== tag) : [...currentTags, tag];

    if (updatedTags.length > 0) {
      urlParams.set("posttags", updatedTags.join(","));
    } else {
      urlParams.delete("posttags");
    }

    router.push(`?${urlParams.toString()}`);
  };

  const onResetPostTags = () => {
    urlParams.delete("posttags");
    router.push(`?${urlParams.toString()}`);
  };

  return (
    <Sheet2 title="Filter" side="left">
      <div className="px-3">
        <div className="mb-4">
          <h3 className="h3 mb-2">Category</h3>
          <div className="flex flex-wrap gap-1">
            <Button variant={"outline"} size={"sm"} onClick={onRemovePostCategory}>
              Reset
            </Button>
            {categories
              ?.sort((a: string | undefined, b: string | undefined) => (a || "").localeCompare(b || ""))
              ?.map((cat: string | undefined, i: number) => (
                <Button
                  variant={params?.postcategory === cat ? "default" : "outline"}
                  size={"sm"}
                  key={i}
                  className="btn btn-outline btn-xs"
                  onClick={() => onPostCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
          </div>
        </div>
        <div className="mb-4">
          <h3 className="h3 mb-2">Tags</h3>
          <div className="flex flex-wrap gap-1">
            <Button variant={"outline"} size={"sm"} onClick={onResetPostTags}>
              Reset
            </Button>
            {tags?.map((tag: string | undefined) => (
              <Button
                variant={params?.posttags?.includes(tag!) ? "default" : "outline"}
                size={"sm"}
                key={tag}
                className="btn btn-outline btn-xs"
                onClick={() => onPostTags(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Sheet2>
  );
}
