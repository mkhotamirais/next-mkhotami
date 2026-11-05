import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/shop/useAuth";
import { cn } from "cn";
import { LogOutIcon } from "lucide-react";
import c from "@/lib/content/shop.json";
import Link from "next/link";

const userMenu = c.user_menu;

export default function UserMenuDesktop() {
  const { logout, pendingLogout, user } = useAuth();

  if (pendingLogout) return null;

  return (
    <div className="auth-user">
      <DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger
            openOnHover
            delay={80}
            closeDelay={0}
            render={
              <button
                type="button"
                aria-label="Menu akun"
                className={cn(
                  "auth-avatar relative inline-flex size-9 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border bg-accent text-xs font-semibold leading-none",
                  "outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              />
            }
          />

          <DropdownMenuContent className={"w-[calc(100vw-0.5rem)] md:w-auto"}>
            <DropdownMenuGroup>
              <DropdownMenuLabel className={"flex flex-col"}>
                <span className="text-gray-900 text-sm font-medium">{user?.name}</span>
                <span className="">{user?.email}</span>
              </DropdownMenuLabel>
              {userMenu?.map((item) => (
                <DropdownMenuItem key={item.url} render={<Link href={item.url}>{item.label}</Link>}></DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" className={"leading-none"} onClick={logout}>
              <LogOutIcon /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenuContent className={"w-[calc(100vw-0.5rem)] md:w-auto"}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" className={"leading-none"} onClick={logout}>
            <LogOutIcon /> Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
