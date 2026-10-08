import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["id", "en", "ar"],
  defaultLocale: "id",
  pathnames: {
    // "/": "/",
    "/lang": "/lang",
    "/lang/about": {
      en: "/lang/about",
      id: "/lang/tentang",
    },
    // "/project": {
    //   en: "/project",
    //   id: "/proyek",
    // },
    // "/about": {
    //   en: "/about",
    //   id: "/tentang",
    // },
    // "/skill": {
    //   en: "/skill",
    //   id: "/keahlian",
    // },
    // "/experience": {
    //   en: "/experience",
    //   id: "/pengalaman",
    // },
    // "/projects": {
    //   en: "/projects",
    //   id: "/proyek-proyek",
    // },
  },
});
