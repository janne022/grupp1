import type { ReactNode } from "react";
import Appbar from "../navigation/Appbar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import Footer from "../ui/Footer";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <SidebarProvider>
        <nav>
          <Appbar />
        </nav>
        <SidebarInset>
          <main className="w-full min-w-0">{children}</main>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
