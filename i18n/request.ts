import * as rootParams from "next/root-params";
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  // const requested = await requestLocale;
  // const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  if (!locale) {
    const paramValue = await rootParams.locale();
    if (hasLocale(routing.locales, paramValue)) {
      locale = paramValue;
    } else {
      notFound();
    }
  }

  return {
    locale,

    // -- Dipakai jika file json tunggal, misal en.json, id.json
    // messages: (await import(`../messages/${locale}.json`)).default,

    // -- Dipakai jika file json di dalam folder, misal en/menu.json, id/menu.json
    messages: {
      menu: (await import(`../messages/${locale}/menu.json`)).default,
      halo: (await import(`../messages/${locale}/halo/pesan.json`)).default,
    },
  };
});
