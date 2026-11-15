import * as React from "react";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Layout from "@/components/layout/Layout";
import "../styles/globals.css";
import { QueryClient } from "@tanstack/react-query";

type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
        <Layout>
          <Outlet />
        </Layout>
        <TanStackRouterDevtools />
    </React.Fragment>
  );
}
