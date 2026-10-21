import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Layout from "@/components/layout/Layout";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLogin } from "@/api/services/LoginService";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: RootComponent,
});



function RootComponent() {
  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Outlet />
        </Layout>
        <TanStackRouterDevtools />
      </QueryClientProvider>
    </React.Fragment>
  );
}
