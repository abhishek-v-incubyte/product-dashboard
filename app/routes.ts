import { type RouteConfig, index } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default [
  index("routes/dashboard.tsx"),
  ...(await flatRoutes({
    ignoredRouteFiles: ["routes/dashboard.tsx"],
  })),
] satisfies RouteConfig;
