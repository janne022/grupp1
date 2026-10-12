import { Link } from "@tanstack/react-router"

const navLinks = [
    {label: "Hem", to: "/"},
    {label: "Kalender", to: "/calendar"},
    {label: "länk 3", to: "/link3"},
    {label: "Logga ut", to: "/logout"}]

export default function Appbar(){
    return(
        <>
        <nav className="bg-gray-500 text-white rounded-t-md fixed bottom-0 left-0 w-full
                        md:top-0 
                        md:bottom-0 
                        md:right-auto 
                        md:left-0
                        md:w-[12em]
                        md:rounded-none">

                <ul className="flex flex-row justify-around gap-5 p-3
                           md:h-full 
                           md:flex-col 
                           md:justify-start
                           md:gap-8 
                           md:text-xl">

                    {navLinks.map((link) => (
                        <li key={link.to} className="transition duration-200 md:rounded-lg md:p-2 md:hover:bg-gray-800 md:w-full">
                            <Link to={link.label}>
                                {link.label}
                            </Link>
                        </li>
                    ))}

                </ul>
        </nav>
        </>
    )
}