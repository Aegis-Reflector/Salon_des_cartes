import CarteProduit from "../components/CarteProduit";
import { useEffect, useState } from "react";

type Carte = {
  id_produit: number;
  nom: string;
  numero_carte: string;
  rarete: string;
  carte_texte: string;
  prix: number;
  extension: string;
  image: string;
};

export default function CatalogueProduitPage() {
  const [cartes, setCartes] = useState<Carte[]>([]);

  useEffect(() => {
    voirCartes();
  }, []);

  async function voirCartes() {
    try {
      const response = await fetch("http://localhost:4000/produits");
      const data = await response.json();
      console.log(data);
      setCartes(data);
    } catch (error) {
      console.error("Erreur GET:", error);
    }
  }

  return (
    <div className="CatalogueProduitPage">
      <div className="d-flex justify-content-center flex-grow-1">
        <input
          className="form-control w-25"
          type="search"
          placeholder="Recherche..."
        />
      </div>

      <nav className="navbar navbar-expand bg-dark navbar-dark">
        <div className="container-fluid">
          <span className="navbar-brand"></span>
          <div className="mx-auto d-flex gap-5 text-white">
            <span>Accueil</span>
            <span>Catalogue</span>
            <span>Populaire</span>
            <span>Special</span>
          </div>
        </div>
      </nav>
      <div className="d-flex justify-content-start gap-3 flex-wrap p-3 bg-danger">
        <button className="btn btn-light border px-5 py-1 fs-6">
          Tous les filtres
        </button>

        <div className="dropdown">
          <button
            className="btn btn-light border dropdown-toggle px-5 py-1 fs-6"
            type="button"
            data-bs-toggle="dropdown"
          >
            État
          </button>
          <ul className="dropdown-menu p-2">
            <li>
              <label className="dropdown-item">
                <input type="checkbox" className="me-2" />
                Comme neuf
              </label>
            </li>
            <li>
              <label className="dropdown-item">
                <input type="checkbox" className="me-2" />
                Légèrement joué
              </label>
            </li>
            <li>
              <label className="dropdown-item">
                <input type="checkbox" className="me-2" defaultChecked />
                Modérément joué
              </label>
            </li>
            <li>
              <label className="dropdown-item">
                <input type="checkbox" className="me-2" />
                Non ouvert
              </label>
            </li>
          </ul>
        </div>
        <div className="dropdown">
          <button
            className="btn btn-light border dropdown-toggle px-5 py-1 fs-6"
            type="button"
            data-bs-toggle="dropdown"
          >
            Impression
          </button>
        </div>
        <div className="dropdown">
          <button
            className="btn btn-light border dropdown-toggle px-5 py-1 fs-6"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Série
          </button>
        </div>
      </div>
      <div className="container mt-4">
        <div className="row g-5">
          {cartes.map((carte) => (
            <div
              key={carte.id_produit}
              className="col-lg-3 col-md-4 col-sm-6 p-3"
            >
              <CarteProduit
                nom={carte.nom}
                prix={carte.prix}
                inventaire={25}
                image={carte.image}
              ></CarteProduit>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
