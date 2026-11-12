import { Link } from "@tanstack/react-router";
import {
  PersonStanding,
  Home,
  CalendarClockIcon,
  UserGroup,
  Settings,
} from "lucide-react";
import AppbarUserInfo from "./AppbarUserInfo";
import { NavUser } from "./NavUser";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "../ui/sidebar";

const navLinks = [
  { label: "Hem", to: "/", Icon: Home },
  { label: "Översikt", to: "/calendar", Icon: CalendarClockIcon },
  { label: "länk 3", to: "/link3", Icon: UserGroup },
  { label: "länk 4", to: "/link4", Icon: Settings },
];

export default function Appbar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex flex-row items-center gap-2">
        <PersonStanding size={32} />
        <h2 className="text-2xl">Vicaria</h2>
      </SidebarHeader>
      <SidebarGroup>
        <SidebarGroupLabel> </SidebarGroupLabel>
        <SidebarGroupContent>
          {/* <AppbarUserInfo /> */}
          <NavUser />
          <SidebarMenu>
            {navLinks.map((link) => {
              const Icon = link.Icon;

              return (
                <SidebarMenuItem key={link.to}>
                  <SidebarMenuButton>
                    <Link
                      to={link.to}
                      className="flex flex-row gap-2 items-center"
                    >
                      {Icon && <Icon size={18} />}
                      {link.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </Sidebar>
  );
}
