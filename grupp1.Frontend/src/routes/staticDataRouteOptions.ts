import "@tanstack/react-router";

declare module "@tanstack/react-router" {
    interface StaticDataRouteOption{
        hideSidebar?: boolean;
        hideFooter?: boolean;
    }
}