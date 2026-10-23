import Logo from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";

export default function MainFooter({ container = "container" }: { container?: string }) {
  return (
    <footer className="pb-4 pt-8 border-t bg-background">
      <div className={`${container}`}>
        <div className="flex items-center justify-between mb-8">
          <Logo />
          <ThemeToggle />
        </div>
        <Separator className={"mb-4"} />
        <p className="text-xs text-center">
          Build with Next.js and deployed on Vercel and Posts written in Markdown by Mkhotami
        </p>
      </div>
    </footer>
  );
}
