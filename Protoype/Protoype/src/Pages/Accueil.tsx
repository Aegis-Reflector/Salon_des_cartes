import special from "../images/Special.png";
import promo1 from "../images/promo1.png";
import promo2 from "../images/promo2.png";
import promo3 from "../images/promo3.png";
import promo4 from "../images/promo4.png";
import arrowLeft from "..//images/flecheG.png";
import arrowRight from "../images/flecheD.png";
import { useState, useEffect } from "react";
import CarteAccueil from "../components/CarteAccueil";

type PromoCardProps = {
  img: string;
  title: string;
};

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

function PromoCard({ img, title }: PromoCardProps) {
  return (
    <div className="position-relative overflow-hidden rounded border border-dark border-4">
      <img
        src={img}
        className="w-100"
        style={{ height: "250px", objectFit: "cover" }}
      />

      <div className="position-absolute top-0 start-0 m-3">
        <h1
          className="text-white fw-bold mb-4"
          style={{
            lineHeight: "1.1",
            textShadow: "3px 3px 10px rgba(0,0,0,0.9)",
          }}
        >
          {title}
        </h1>
      </div>

      <div className="position-absolute top-50 start-50   translate-middle-x mt-5">
        <button className="btn btn-light btn-lg px-4 py-2 fw-semibold btn-outline-dark">
          Parcourir
        </button>
      </div>
    </div>
  );
}

export default function Accueil() {
  // État qui contient toutes les cartes récupérées du backend
  const [cartes, setCartes] = useState<Carte[]>([]);

  // useEffect appelé au chargement de la page pour aller chercher les cartes
  useEffect(() => {
    voirCartes();
  }, []);

  const produitsParPage = 4;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(cartes.length / produitsParPage);

  // Produits affichés pour la page actuelle
  const produitsAffiches = cartes.slice(
    (page - 1) * produitsParPage,
    page * produitsParPage,
  );
  // Fonction pour récupérer les cartes depuis le backend
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
    <div className="container-fluid p-5">
      {/* Grande section spéciale */}
      <div className="position mb-4">
        <img
          src={special}
          className="w-100 rounded"
          style={{ height: "310px", objectFit: "cover" }}
        />

        <div className="position-absolute top-50 start-0 translate-middle-y ms-5">
          <h1 className="text-white display-4 fw-bold text-center">Spéciale</h1>
        </div>
      </div>

      {/* 4 blocs promo */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <PromoCard img={promo1} title="Prix bas" />
        </div>

        <div className="col-md-6">
          <PromoCard img={promo2} title="Incontournables" />
        </div>

        <div className="col-md-6">
          <PromoCard img={promo3} title="Édition limitée" />
        </div>

        <div className="col-md-6">
          <PromoCard img={promo4} title="Les plus rares" />
        </div>
      </div>

      {/* Section Vedette */}
      <h2 className="text-uppercase mb-4 fw-normal">En vedette</h2>

      <div className="row g-4 mx-0">
        {produitsAffiches.map((cartes) => (
          <div
            className="col-lg-3 col-md-4 col-sm-6 p-3"
            key={cartes.id_produit}
          >
            <CarteAccueil
              nom={cartes.nom}
              prix={cartes.prix}
              inventaire={25}
              image={cartes.image}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
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
    </div>
  );
}
