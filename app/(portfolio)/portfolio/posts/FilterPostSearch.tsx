"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePost } from "@/hooks/portfolio/usePost";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function FilterPostSearch() {
  const { search, setSearch } = usePost();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlParams = new URLSearchParams(searchParams.toString());

  const onSearch = useDebouncedCallback((e: string) => {
    if (e) {
      urlParams.set("postq", e);
      urlParams.set("postpage", "1");
    } else {
      urlParams.delete("postq");
    }
    router.push(`?${urlParams.toString()}`);
  }, 300);

  return (
    <div className="relative text-muted-foreground">
      <Label htmlFor="search-post" className="sr-only">
        Search
      </Label>
      <Search size={16} className="absolute left-0 mx-3 top-1/2 -translate-y-1/2" />
      <Input
        id="search-post"
        name="search-post"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => {
          onSearch(e.target.value);
          setSearch(e.target.value);
        }}
        className="pl-9"
      />
    </div>
  );
}
