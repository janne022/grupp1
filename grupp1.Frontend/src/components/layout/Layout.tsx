import type { ReactNode } from "react";
import Appbar from "../navigation/Appbar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import Footer from "../ui/Footer";
import { Toaster } from "../ui/toast";
import BottomNav from "../navigation/BottomNav";

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
        <SidebarInset className="pb-20 md:pb-0">
          <main className="w-full min-w-0">{children}</main>
          <Toaster />
          <Footer />
        </SidebarInset>
        <BottomNav />
      </SidebarProvider>
    </>
  );
}
