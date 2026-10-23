import { notFound } from "next/navigation";
import BasePage from "../../BasePage";
import { limits as l } from "@/lib/constants/public-api";
import { Post } from "@/lib/types/public-api";

type PostsResponse = {
  posts: Post[]; // ganti dengan tipe Post milikmu
  total: number;
  skip: number;
  limit: number;
};

async function getPosts(skip: number, limit: number): Promise<PostsResponse> {
  const res = await fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error(`Gagal mengambil posts: ${res.status}`);
  return res.json();
}

export async function generateStaticParams() {
  const { total } = await getPosts(0, 1);
  const totalPages = Math.ceil(total / l.product);
  return Array.from({ length: totalPages }, (_, i) => ({ page: String(i + 1) }));
}

export default async function DummyjsonPaginate({ params }: { params: Promise<{ page: string }> }) {
  const page = Number((await params).page);
  if (!Number.isInteger(page) || page < 1) notFound();

  const data = await getPosts((page - 1) * l.product, l.product);
  const totalPages = Math.ceil(data.total / l.product);
  if (page > totalPages) notFound();

  return <BasePage data={data.posts} page={page} totalPages={totalPages} />;
}
