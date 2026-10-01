import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function TailwindTest() {
  return <h1 className="text-3xl font-bold underline">Tailwind test</h1>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TailwindTest/>
    <RouterProvider router={router} />
  </StrictMode>,
);
