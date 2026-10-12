import c from "@/lib/content/portfolio.json";

export default function Experiences() {
  const exps = c.home.experiences;

  return (
    <section className="py-12">
      <div className="">
        <h2 className="h2">Experiences</h2>
        <div className="space-y-4">
          {exps.map((exp, index) => (
            <div key={index} className="">
              <h3 className="font-semibold">{exp.job}</h3>
              <p className="text-sm">{exp.company}</p>
              <span className="text-xs text-muted-foreground">{exp.date}</span>
              <p
                className="mt-2 text-sm text-muted-foreground border-l-2 pl-2 border-blue-600"
                dangerouslySetInnerHTML={{ __html: exp.description }}
              ></p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
