import type { ReactNode } from "react";
import Appbar from "./Appbar";
import {
  SidebarInset,
  SidebarProvider,
} from "../../../shared/components/ui/sidebar";
import Footer from "../../../shared/components/footer";
import { Toaster } from "../../../shared/components/ui/toast";
import BottomNav from "./BottomNav";
import { useMatches } from "@tanstack/react-router";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const matches = useMatches();
  const hideSidebar = matches.some((m) => m.staticData?.hideFooter);
  const hideFooter = matches.some((m) => m.staticData.hideSidebar);

  return (
    <>
      <SidebarProvider>
        {!hideSidebar && (
          <nav>
            <Appbar />
          </nav>
        )}
        <SidebarInset className="pb-20 md:pb-0">
          <main className="w-full min-w-0">{children}</main>
          <Toaster />
          {!hideFooter && <Footer />}
        </SidebarInset>
        {!hideSidebar && <BottomNav />}
      </SidebarProvider>
    </>
  );
}
