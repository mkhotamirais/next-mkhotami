import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import "./shop.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";
import { NextAuthProviders } from "@/components/providers/NextAuthProvider";
import { shopScript } from "@/lib/scripts/shop-script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mkhotami Portfolio - Web Developer | React, Laravel, WordPress",
  description:
    "Mkhotami is a Web Developer who builds modern websites using React, Laravel, and WordPress. Focused on performance, responsiveness, and user experience.",
};

type Props = {
  children: React.ReactNode;
};

export default async function ShopLayout({ children }: Props) {
  return (
    <html
      lang={"en"}
      data-auth="0"
      className={`${inter.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: shopScript }} />
      </head>
      <body className="body" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <NextAuthProviders>
              <Toaster position="top-center" richColors swipeDirections={["left", "right", "top"]} />
              <div className="flex-1">{children}</div>
              <Footer />
            </NextAuthProviders>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
