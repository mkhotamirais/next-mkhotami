"use client";
import CardPost from "@/components/projects/portfolio/components/CardPost";
import Pagination from "@/components/ui/custom/Pagination";
import { IPost } from "@/lib/types/main";
import { useSearchParams } from "next/navigation";

export default function PostList({ posts }: { posts: IPost[] }) {
  const searchParams = useSearchParams();
  const postsearch = (searchParams.get("postq") || "").toLowerCase();
  const postcategory = searchParams.get("postcategory");
  const posttags = searchParams.get("posttags");

  const perPage = 8;

  const page = parseInt(searchParams.get("postpage") || "1", 10);
  const start = (page - 1) * perPage;
  const end = start + perPage;

  const filteredPosts = posts.filter(
    (post) =>
      post.meta.title.toLowerCase().includes(postsearch) &&
      (!postcategory || post.meta.category === postcategory) &&
      (!posttags || post.meta.tags?.some((tag) => posttags.split(",").includes(tag))),
  );

  if (filteredPosts.length === 0) {
    return <p className="text-muted-foreground mt-4">No articles found.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
        {filteredPosts.slice(start, end).map((post, i) => (
          <CardPost key={i} post={post} />
        ))}
      </div>
      {filteredPosts.length > perPage && (
        <div className="mt-4">
          <Pagination totalData={filteredPosts.length} perPage={perPage} />
        </div>
      )}
    </>
  );
}
