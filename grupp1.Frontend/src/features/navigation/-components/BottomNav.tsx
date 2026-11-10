import { Link } from "@tanstack/react-router";
import { CircleUser } from "lucide-react";

const navLinks = [
  { label: "Hem", to: "/" },
  { label: "Översikt", to: "/calendar" },
  { label: "länk 3", to: "/link3" },
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-sidebar-accent md:hidden">
      <ul className="flex h-16 items-center justify-around">
        {navLinks.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="flex min-w-16 justify-center px-3 py-2 text-xs text-muted-foreground border-b-2 border-transparent 
              data-[status=active]:border-muted-foreground 
              data-[status=active]:font-bold 
              data-[status=active]:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}

        <li>
          <CircleUser size={24} />
        </li>
      </ul>
    </nav>
  );
}
