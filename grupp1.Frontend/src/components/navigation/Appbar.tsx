import { Link } from "@tanstack/react-router";

const navLinks = [
  { label: "Hem", to: "/" },
  { label: "Översikt", to: "/managerdashboard" },
  { label: "länk 3", to: "/link3" },
  { label: "länk 4", to: "/link4" },
];

export default function Appbar() {
  return (
    <>
      <nav className="bg-gray-500 text-white rounded-t-md fixed bottom-0 left-0 w-full md:top-0  md:w-[12rem] md:rounded-none">
        <ul className="flex flex-row justify-around gap-5 p-3 md:h-full  md:flex-col  md:justify-start md:gap-8  md:text-xl">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="p-2 block rounded transition duration-200 md:w-full md:rounded-lg md:hover:bg-gray-800"
                activeProps={{ className: "bg-gray-700" }}
                inactiveProps={{ className: "bg-gray-500" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
