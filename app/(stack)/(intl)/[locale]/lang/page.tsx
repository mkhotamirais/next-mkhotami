import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function LangHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const m = await getTranslations({ locale, namespace: "menu" });
  const p = await getTranslations({ locale, namespace: "halo" });

  return (
    <section>
      <div className="">
        <div>{m("HomePage.title")}</div>
        <div>{p("title")}</div>
        <h2>poin utama</h2>
        <ul>
          <li>
            getTranslations vs useTranslations, untuk mengambil data dari message, getTranslations untuk server
            component sedangkan useTanslations untuk cleint component
          </li>
          <li>
            setRequestlocale & params, untuk mendapatkan data locale, setRequestlocale hanya untuk server component
            untuk mempercepat navigasi, dan params dan locale sebagai props harus pakai promise sekalipun pada client
            component
          </li>
        </ul>
      </div>
    </section>
  );
}
