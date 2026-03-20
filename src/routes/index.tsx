import { createHashRouter, RouterProvider } from "react-router-dom";
import { Home } from "../pages/Home";
import { ChangePass } from "../pages/ChangePass";
import { DefaultPass } from "../pages/DefaultPass";

const routes = createHashRouter([
  {
    path: "/",
    element: <DefaultPass />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/change-pass",
    element: <ChangePass />,
  },
]);

export function Routes() {
  return <RouterProvider router={routes} />;
}
