import { Link } from "@tanstack/react-router";
import {
  PersonStanding,
  Home,
  UserGroup,
  Settings,
  Mail,
} from "lucide-react";
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
  SidebarFooter,
} from "../../../shared/components/ui/sidebar";

const navLinks = [
  { label: "Hem", to: "/", Icon: Home },
  { label: "Inkorg", to: "/inbox", Icon: Mail },
  { label: "länk 3", to: "/link3", Icon: UserGroup },
  { label: "länk 4", to: "/link4", Icon: Settings },
];

export default function Appbar() {
  return (
    <Sidebar variant="inset" className="border-r">
      <SidebarHeader className="flex flex-row items-center gap-2">
        <PersonStanding size={32} />
        <h2 className="text-2xl">Vicaria</h2>
      </SidebarHeader>
      <SidebarGroup>
        <SidebarGroupLabel></SidebarGroupLabel>
        <SidebarGroupContent>
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
      <SidebarFooter className="mt-auto">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
