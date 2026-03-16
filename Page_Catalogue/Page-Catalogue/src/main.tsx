import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import CatalogueProduitPage from "./CatalogueProduitPage";
import PageAdmin from "./PageAdmin";

const router = createBrowserRouter([
  { path: "/produits", element: <CatalogueProduitPage></CatalogueProduitPage> },
  { path: "/PageAdmin", element: <PageAdmin></PageAdmin> },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
