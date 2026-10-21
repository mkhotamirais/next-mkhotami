import { Metadata } from "next";
import PostList from "./PostList";
import FilterPostKeys from "./FilterPostKeys";
import FilterPostSearch from "./FilterPostSearch";
import FilterPostSide from "./FilterPostSide";
import { getAllPosts } from "@/actions/post";

export const metadata: Metadata = {
  title: "Articles & Blog | Mkhotami - Web Development Insights",
  description:
    "Read insightful articles and blog posts by Mkhotami on web development, covering topics like React, Laravel, WordPress, performance optimization, and best practices.",
};

export default function Posts() {
  const posts = getAllPosts();
  const categories = [...new Set(posts.map((post) => post.meta.category))];
  const tags = [...new Set(posts.flatMap((post) => post.meta.tags).filter(Boolean))];

  return (
    <section className="py-8">
      <div className="">
        <h1 className="h1">Posts</h1>
        <div className="space-y-2">
          <div className="flex gap-2">
            <FilterPostSide categories={categories} tags={tags} />
            <FilterPostSearch />
          </div>
          <FilterPostKeys />
          <PostList posts={posts} />
        </div>
      </div>
    </section>
  );
}
