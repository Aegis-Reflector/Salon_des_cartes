import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";



import Accueil from "./Accueil";
import Layout from "./Layout";
import Catalogue from "./Test";   // À remplacer par le composant réel du catalogue 
/*import Populaire from "./Populaire";
import Special from "./Special";
*/
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, 
    children: [
      { index: true, element: <Accueil /> },
      { path: "Catalogue", element: <Catalogue />
      },
      
    ],
    
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);


