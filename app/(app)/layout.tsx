import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

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

export default async function MainLayout({ children }: Props) {
  return (
    <html
      lang={"en"}
      // data-auth="0"
      className={`${inter.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.dataset.auth=/(^|; )auth_hint=1/.test(document.cookie)?"1":"0"}catch(e){}`,
          }}
        /> */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var r=document.documentElement,l=/(^|; )auth_hint=1/.test(document.cookie);r.dataset.auth=l?"1":"0";if(l){var u=JSON.parse(localStorage.getItem("auth_user")||"null");if(u){if(u.img){r.style.setProperty("--user-image","url("+JSON.stringify(u.img)+")");r.dataset.avatar="1"}else if(u.i){r.style.setProperty("--user-initials",JSON.stringify(u.i));r.dataset.avatar="1"}}}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col w-full bg-zinc-100 dark:bg-zinc-900" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <Toaster position="top-center" richColors swipeDirections={["left", "right", "top"]} />
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
