import { Link } from "@tanstack/react-router";
import { PersonStanding } from "lucide-react";
import AppbarUserInfo from "./AppbarUserInfo";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "../../../shared/components/ui/sidebar";

const navLinks = [
  { label: "kalender", to: "/" },
  { label: "Dina meddelanden", to: "/inbox" },
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
          <AppbarUserInfo />
          <SidebarMenu>
            {navLinks.map((link) => (
              <SidebarMenuItem key={link.to}>
                <SidebarMenuButton>
                  <Link to={link.to}>{link.label}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </Sidebar>
  );
}
