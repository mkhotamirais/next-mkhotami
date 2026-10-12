import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { IPostMeta } from "@/lib/types/main";

const postsDir = path.join(process.cwd(), "posts");

export function getAllPosts(limit?: number, skip?: number) {
  const filenames = fs.readdirSync(postsDir);

  const sliced = filenames
    .sort((a, b) => {
      // Optional: sort by newest first if filenames contain dates or use frontmatter date later
      return a.localeCompare(b); // or customize sorting logic
    })
    .slice(skip || 0, (skip || 0) + (limit || filenames.length));

  return sliced.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const filePath = path.join(postsDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      meta: data as IPostMeta,
      content,
    };
  });
}

export function getPostBySlug(slug: string) {
  const filePath = path.join(postsDir, `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    meta: data as IPostMeta,
    content,
  };
}
