import { marked } from "marked";
import { notFound } from "next/navigation";
import React from "react";
import { Metadata } from "next";
import { smartTrim } from "@/lib/utils";
import { getPostBySlug } from "@/actions/post";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post tidak ditemukan",
    };
  }

  return {
    title: smartTrim(post.meta.title, 60), // post.meta.title,
    description: smartTrim(post.meta.excerpt, 160), // post.meta.excerpt,
    // openGraph: {
    //   title: post.meta.title,
    //   description: post.meta.excerpt,
    //   url: `https://domainkamu.com/blog/${slug}`,
    //   type: "article",
    // },
  };
}

const renderer = new marked.Renderer();

renderer.heading = ({ text, depth }) => {
  const slug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // hapus karakter aneh
    .replace(/\s+/g, "-") // ubah spasi jadi tanda "-"
    .trim();

  return `<h${depth} id="${slug}">${text}</h${depth}>`;
};

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  const html = marked(post.content, { renderer });

  return (
    <section className="py-8">
      <div className="">
        <article className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }}></article>
      </div>
    </section>
  );
}
