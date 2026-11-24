import { useIsManager } from "@/shared/hooks/use-is-manager";
import { Link } from "@tanstack/react-router";
import { Home, CalendarDays, Users, User } from "lucide-react";

const navLinks = [
  { label: "Hem", to: "/", Icon: Home },
  { label: "Översikt", to: "/calendar", Icon: CalendarDays },
  { label: "Vikarier", to: "/substitute-list", Icon: Users, managerOnly: true },
  { label: "Profil", to: "/profile", Icon: User },
];

export default function BottomNav() {
  const isManager = useIsManager();
  const navLinksFiltered = navLinks.filter((l) => !l.managerOnly || isManager);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-sidebar-accent md:hidden">
      <ul className="flex h-16 items-center justify-around">
        {navLinksFiltered.map(({ label, to, Icon }) => (
          <li key={to} className="flex-1 min-w-0">
            <Link
              to={to}
              className="flex flex-col items-center justify-center gap-1
                min-w-0 w-full
                text-muted-foreground
                transition-colors
                data-[status=active]:text-foreground
                data-[status=active]:font-semibold
              "
            >
              <Icon size={21} />
              <span className="text-xs">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
