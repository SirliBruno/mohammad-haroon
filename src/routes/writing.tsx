import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/writing")({
  component: () => <Outlet />,
});
