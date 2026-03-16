import CarteProduit from "../components/CarteProduit";
import arrowLeft from "../images/flecheG.png";
import arrowRight from "../images/flecheD.png";
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

  const produitsParPage = 6;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(cartes.length / produitsParPage);


   const carteAffichees = cartes.slice (
    (page-1) * produitsParPage,
    page *produitsParPage
  )

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
  <>
    <div className="container-fluid d-flex justify-content-start gap-3 flex-wrap py-3 bg-danger">
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

    <div className="container-fluid mt-4 px-0">
      <div className="row g-5 mx-0">
        {carteAffichees.map((carte) => (
          <div
            key={carte.id_produit}
            className="col-lg-3 col-md-4 col-sm-6 p-3"
          >
            <CarteProduit
              nom={carte.nom}
              prix={carte.prix}
              inventaire={25}
              image={carte.image}
            />
          </div>
        ))}
      </div>
    </div>

    <div className="row mt-4">
      <div className="col text-center">
        <button
          className="btn btn-outline-dark me-2"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          <img
            src={arrowLeft}
            alt="page précédente"
            style={{ width: "18px" }}
          />
        </button>

        <span className="mx-2">
          Page {page} / {totalPages}
        </span>

        <button
          className="btn btn-outline-dark ms-2"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          <img
            src={arrowRight}
            alt="page suivante"
            style={{ width: "18px" }}
          />
        </button>
      </div>
    </div>
  </>
);
}