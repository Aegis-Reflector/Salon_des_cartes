import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import Connexion from "./pages/page_connexion.tsx";
import Inscription from "./pages/page_inscription.tsx";

const router = createBrowserRouter([
  { path: "/Connexion", element: <Connexion /> },
  { path: "/Inscription", element: <Inscription /> },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
