import { jpUrl } from "@/lib/constants/public-api";

export default async function JpHome() {
  const data = await fetch(`${jpUrl}/posts`).then((res) => res.json());

  return (
    <div>
      <div className="">
        <h1>Jsonplaceholder</h1>
        <div>
          {data.map((item: { title: string; body: string }, i: number) => (
            <div key={i}>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
