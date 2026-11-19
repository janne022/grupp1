import { Link } from "@tanstack/react-router";
import { PersonStanding, Home, Settings, Mail, Users } from "lucide-react";
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
import { useIsManager } from "@/shared/hooks/use-is-manager";

const navLinks = [
  { label: "Hem", to: "/", Icon: Home },
  { label: "Inkorg", to: "/inbox", Icon: Mail },
  { label: "Vikarier", to: "/substituteList", Icon: Users, managerOnly: true },
  { label: "länk 4", to: "/link4", Icon: Settings },
];

export default function Appbar() {
  const isManager = useIsManager();
  const navLinksFiltered = navLinks.filter((l) => !l.managerOnly || isManager);

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
            {navLinksFiltered.map((link) => {
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
