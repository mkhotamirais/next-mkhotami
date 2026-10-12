import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllPosts } from "@/actions/post";
import CardPost from "@/components/projects/portfolio/components/CardPost";

export default async function Posts() {
  const posts = await getAllPosts(4);

  return (
    <section className="py-12" id="posts">
      <div className="">
        <h2 className="h2">Latest Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {posts
            .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())
            .map((post, i) => (
              <CardPost key={i} post={post} />
            ))}
        </div>
        <Link href="/posts" className="mt-4 inline-block">
          <Button variant={"secondary"}>All Posts</Button>
        </Link>
      </div>
    </section>
  );
}
