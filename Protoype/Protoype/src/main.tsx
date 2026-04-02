import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import CatalogueProduitPage from "./Pages/CatalogueProduitPage.tsx";
import PageAdmin from "./Pages/PageAdmin.tsx";
import Connexion from "./Pages/page_connexion.tsx";
import Inscription from "./Pages/page_inscription.tsx";
import Accueil from "./Pages/Accueil.tsx";
import Layout from "./components/Layout.tsx";
import Shipping from "./Pages/page_shipping.tsx";
import Profil from "./Pages/page_profil.tsx";
import Securite from "./Pages/page_securite.tsx"
import Settings from "./Pages/page_settings.tsx"

const router = createBrowserRouter([
  {
    // Layout commun affiché autour de toutes les pages
    element: <Layout />,
    children: [
      { path: "/", element: <Accueil /> },
      { path: "/Catalogue", element: <CatalogueProduitPage /> },
      { path: "/admin", element: <PageAdmin /> },
    ],
  },

  { path: "/connexion", element: <Connexion /> },
  { path: "/inscription", element: <Inscription /> },
  { path: "/shipping", element: <Shipping /> },

  
  { path: "/Profil", element: <Profil /> },
  { path: "/Settings", element: <Securite /> },
  { path: "/Securite", element: <Settings /> },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
