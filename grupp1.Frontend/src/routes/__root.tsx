import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import AddEditTimeModal from "@/components/addEditTimeModal";
import "../styles/globals.css";
import type { KindergartenGroup } from "@/api/types/types";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const kindergarten: KindergartenGroup[] = [
    {
      groupName: "hej",
      kindergartens: [{ label: "köttbullen", value: "ur mom" }],
    },
    {
      groupName: "hej då",
      kindergartens: [{ label: "pastan", value: "ur dad" }],
    },
  ];
  return (
    <React.Fragment>
      <Outlet />
      <TanStackRouterDevtools />
      <AddEditTimeModal
        addTime={() => {}}
        deleteItem={() => {}}
        kindergartens={kindergarten}
      />
    </React.Fragment>
  );
}
