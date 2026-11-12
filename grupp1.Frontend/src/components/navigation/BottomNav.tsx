import { Link } from "@tanstack/react-router";
import { Home, CalendarDays, Users, Settings } from "lucide-react";

const navLinks = [
  { label: "Hem", to: "/", Icon: Home },
  { label: "Översikt", to: "/calendar", Icon: CalendarDays },
  { label: "länk 3", to: "/link3", Icon: Users },
  { label: "länk 4", to: "/link4", Icon: Settings },
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-sidebar-accent md:hidden">
      <ul className="flex h-16 items-center justify-around">
        {navLinks.map(({ label, to, Icon }) => (
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
