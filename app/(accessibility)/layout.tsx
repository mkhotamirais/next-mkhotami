import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import Header from "@/components/projects/main/layout/Header";
import Footer from "@/components/Footer";

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

export default async function AccessibilityLayout({ children }: Props) {
  return (
    <html
      lang={"en"}
      className={`${inter.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="body" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <Toaster position="top-center" richColors swipeDirections={["left", "right", "top"]} />
            <Header />
            {children}
            <Footer />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
