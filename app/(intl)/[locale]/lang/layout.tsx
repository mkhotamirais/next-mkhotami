import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import "../../../globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
// import { BASE_URL } from "@/lib/constants";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const arabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mkhotami Portfolio - Web Developer | React, Laravel, WordPress",
  description:
    "Mkhotami is a Web Developer who builds modern websites using React, Laravel, and WordPress. Focused on performance, responsiveness, and user experience.",
};

// export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
//   const { locale } = await params;
//   const t = await getTranslations({ locale, namespace: "halo" });

//   return {
//     metadataBase: new URL(BASE_URL),
//     title: {
//       template: `%s | Vryce`,
//       default: t("title"),
//     },
//     description: t("description"),
//     // alternates: {
//     //   // canonical: `/${locale}`,
//     //   languages: {
//     //     en: "/en",
//     //     id: "/id",
//     //     "x-default": "/id",
//     //   },
//     // },
//     // 3. Tambahkan OpenGraph agar link terlihat bagus di Google & Medsos
//     // openGraph: {
//     //   title: t("title"),
//     //   description: t("description"),
//     //   url: `/${locale}`,
//     //   siteName: "Vryce",
//     //   locale: locale === "id" ? "id_ID" : "en_US",
//     //   type: "website",
//     //   // images: [{ url: '/og-image.png' }] // Tambahkan jika ada gambar preview
//     // },

//     // 4. Verifikasi Search Console (Opsional, tapi membantu)
//     // verification: {
//     //   google: 'kode-verifikasi-dari-gsc',
//     // },
//   };
// }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const dir = locale === "ar" ? "rtl" : "ltr";
  const fontClass = locale === "ar" ? `${arabic.variable} font-arabic` : `${inter.variable} font-sans`;

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${fontClass} h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col w-full" suppressHydrationWarning>
        <NextIntlClientProvider>
          {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> */}
          <ThemeProvider attribute="class" defaultTheme="system">
            <Toaster position="top-center" richColors swipeDirections={["left", "right", "top"]} />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
