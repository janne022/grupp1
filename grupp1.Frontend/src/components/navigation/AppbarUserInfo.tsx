import { CircleUser } from "lucide-react";
import { useCurrentUser } from "@/api/services/MeService";
import { SidebarMenu, SidebarMenuItem } from "../ui/sidebar";

export default function AppbarUserInfo() {
  const { data: user } = useCurrentUser();

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 p-2">
          <CircleUser size={32} />
          <div className="flex flex-col min-w-0 flex-1 text-left">
            <span className="text-sm font-medium">
              {user.firstName} {user.lastName}
            </span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
