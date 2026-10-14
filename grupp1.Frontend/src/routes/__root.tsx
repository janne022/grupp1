import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Layout from "@/components/layout/Layout";
import Footer from "@/components/ui/Footer";
import "../styles/globals.css";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <Layout>
        <Outlet />
        <Footer/>
      </Layout>
        <TanStackRouterDevtools />
    </React.Fragment>
  );
}
