import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["id", "en", "ar"],
  defaultLocale: "id",
  pathnames: {
    // "/": "/",
    "/lang": {
      en: "/lang",
      id: "/lang",
      ar: "/لغة",
    },
    "/lang/about": {
      en: "/lang/about",
      id: "/lang/tentang",
      ar: "/لغة/حول",
    },
    "/lang/contact": {
      en: "/lang/contact",
      id: "/lang/kontak",
      ar: "/لغة/اتصل-بنا",
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
