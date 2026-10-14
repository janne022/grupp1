import type { ReactNode } from "react"
import Appbar from "../navigation/Appbar"

type LayoutProps = {
    children: ReactNode
}

export default function Layout({children}: LayoutProps){
    return(
        <>
            <Appbar/>
            <main className="pb-16 md:ml-[12rem]">
                {children}
            </main>
        </>
    )
}