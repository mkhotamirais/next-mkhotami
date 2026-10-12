import Image from "next/image";
import c from "@/lib/content/portfolio.json";

export default function About() {
  const about = c.about;
  const title = about.title;

  const sub_1 = about.sub_1;
  const sub_2 = about.sub_2;
  const sub_3 = about.sub_3;
  const sub_4 = about.sub_4;
  const sub_5 = about.sub_5;
  const sub_6 = about.sub_6;

  return (
    <section className="py-8">
      <div className="">
        <h1 className="h1">{title}</h1>
        <article className="prose dark:prose-invert w-full">
          <Image
            src="/images/profile-mkhotami-tengah-square.jpg"
            alt="profile mkhotami"
            width={100}
            height={100}
            className="w-42 h-48 mr-4 mb-4 rounded-lg float-left object-cover object-center"
          />
          <div>
            <h2>{sub_1.title}</h2>
            <p>{sub_1.p}</p>
          </div>

          <div>
            <h2>{sub_2.title}</h2>
            {sub_2.p.split("|").map((paragraph, index) => (
              <p key={index}>{paragraph.trim()}</p>
            ))}
          </div>

          <div>
            <h2>{sub_3.title}</h2>
            <p>{sub_3.p}</p>
            <ul>
              {sub_3.list.split("<br/>").map((item, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          </div>

          <div>
            <h2>{sub_4.title}</h2>
            <ul>
              {sub_4.list.split(" | ").map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2>{sub_5.title}</h2>
            <p>{sub_5.p}</p>
          </div>

          <div>
            <h2>{sub_6.title}</h2>
            <p>{sub_6.p}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
