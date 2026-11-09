import type { ReactNode } from "react";
import Appbar from "./Appbar";
import {
  SidebarInset,
  SidebarProvider,
} from "../../../shared/components/ui/sidebar";
import Footer from "../../../shared/components/footer";
import { Toaster } from "../../../shared/components/ui/toast";
import BottomNav from "./BottomNav";

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
