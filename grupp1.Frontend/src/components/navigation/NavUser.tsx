import { LogOutIcon, BellIcon, Menu, UserCircle } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useCurrentUser } from "@/api/services/MeService";

import { Link } from "@tanstack/react-router";

export function NavUser() {
  const { data: user } = useCurrentUser();

  const fullNameSplit = [user?.firstName, user?.lastName].map((name) =>
    name
      ?.split(" ")
      .map((name) => name[0])
      .join(""),
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger>
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
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>
              <Menu className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
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
                  <div className="grid flex-1 text-left text-sm leading-tight">
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
                <DropdownMenuItem>
                  {/* TODO: Connect this to the profile page */}
                  <Link to="/" className="flex flex-row gap-2 items-center">
                    <UserCircle />
                    Profil
                  </Link>
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
              <DropdownMenuItem>
                {/* TODO: Connect this to logout functionality */}
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
