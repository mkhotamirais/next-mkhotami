"use client";

import { Badge } from "@/components/ui/badge";
import { usePost } from "@/hooks/portfolio/usePost";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";

export default function FilterPostKeys() {
  const { setSearch } = usePost();

  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useMemo(() => Object.fromEntries(searchParams), [searchParams]);
  const urlParams = new URLSearchParams(searchParams.toString());

  const onDeletePostq = () => {
    urlParams.delete("postq");
    setSearch("");
    router.push(`?${urlParams.toString()}`);
  };

  const onDeletePostCategory = () => {
    urlParams.delete("postcategory");
    router.push(`?${urlParams.toString()}`);
  };

  const onDeletePostTag = (tag: string | undefined) => {
    const currentTags = urlParams.get("posttags")?.split(",") ?? [];

    const updatedTags = currentTags.filter((id) => id !== tag);

    if (updatedTags.length > 0) {
      urlParams.set("posttags", updatedTags.join(","));
    } else {
      urlParams.delete("posttags");
    }

    router.push(`?${urlParams.toString()}`);
  };

  const postq = params?.postq;
  const postcategory = params?.postcategory;
  const posttags = params?.posttags;

  return (
    <div>
      {/* {Object.keys(params).length ? ( */}
      {postq || postcategory || posttags ? (
        <div className="flex items-center gap-1">
          <span className="text-sm">Result for :</span>
          {postq && (
            <button type="button" onClick={onDeletePostq}>
              <Badge>
                {postq}
                <span className="ml-1 text-red-500">x</span>
              </Badge>
            </button>
          )}
          {postcategory && (
            <button type="button" onClick={onDeletePostCategory}>
              <Badge>
                {postcategory}
                <span className="ml-1 text-red-500">x</span>
              </Badge>
            </button>
          )}
          {posttags &&
            posttags.split(",")?.map((tag) => (
              <button type="button" key={tag} onClick={() => onDeletePostTag(tag)} className="badge">
                <Badge>
                  {tag}
                  <span className="ml-1 text-red-500">x</span>
                </Badge>
              </button>
            ))}
        </div>
      ) : null}
    </div>
  );
}
