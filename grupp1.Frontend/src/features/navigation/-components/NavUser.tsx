import { LogOutIcon, BellIcon, Menu, UserCircle /*User*/ } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useLogout } from "@/features/(auth)/-api/LogoutService";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";

import { useCurrentUser } from "@/shared/services/MeService";

type NavUserProps = {
  isMobile?: boolean;
};

export function NavUser({ isMobile = false }: NavUserProps) {
  const { data: user } = useCurrentUser();

  const fullNameSplit = [user?.firstName, user?.lastName].map((name) =>
    name
      ?.split(" ")
      .map((name) => name[0])
      .join(""),
  );

  const logout = useLogout();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout.mutateAsync();
      await navigate({ to: "/login" });
    } catch {
      // this should never happen I HOPE HOPE HOPE
      // I guess the user is stuck in our eternal Vicaria purgatory
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            {isMobile ? (
              <button className="flex h-10 w-10 items-center justify-center rounded-full p-0 hover:bg-accent">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage />
                  <AvatarFallback className="rounded-full">
                    {fullNameSplit}
                  </AvatarFallback>
                </Avatar>
              </button>
            ) : (
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage />
                  <AvatarFallback className="rounded-lg">
                    {fullNameSplit}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
                <Menu className="ml-auto size-4" />
              </SidebarMenuButton>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side="right"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="" />
                    <AvatarFallback className="rounded-lg">
                      {fullNameSplit}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  render={<Link to="/profile" />}
                >
                  <UserCircle />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {/* TODO: Add a real link */}
                  <Link to="/" className="flex flex-row gap-2">
                    <BellIcon />
                    Notifikationer
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                disabled={logout.isPending}
                onClick={handleLogout}
              >
                <LogOutIcon />
                Logga ut
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
