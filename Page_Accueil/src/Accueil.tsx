

import special from "./assets/images/Special.png"

import promo1 from "./assets/images/promo1.png"
import promo2 from "./assets/images/promo2.png"
import promo3 from "./assets/images/promo3.png"
import promo4 from "./assets/images/promo4.png"
import arrowLeft from "./assets/images/flecheG.png"
import arrowRight from "./assets/images/flecheD.png"
import { useState, useMemo } from "react";
import CarteAccueil from "./CarteAccueil"


type PromoCardProps = {
  img: string
  title: string
}

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
  )
}



export default function Accueil() {
 
 // Données de produits simulées
  const produits = [
    {
      id: 1,
      nom: "Mega Gengar ex",
      prix: 49.99,
      inventaire: 12,
      image: promo1,
    },
    {
      id: 2,
      nom: "Mewtwo GX",
      prix: 39.99,
      inventaire: 8,
      image: promo2,
    },
    {
      id: 3,
      nom: "Charizard VMAX",
      prix: 79.99,
      inventaire: 5,
      image: promo3,
    },
    {
      id: 4,
      nom: "Rayquaza EX",
      prix: 64.99,
      inventaire: 7,
      image: promo4,
    },
    {
      id: 5,
      nom: "Pikachu Illustration",
      prix: 24.99,
      inventaire: 20,
      image: promo1,
    },
    {
      id: 6,
      nom: "Lucario GX",
      prix: 34.99,
      inventaire: 10,
      image: promo2,
    },
    {
      id: 7,
      nom: "Gardevoir EX",
      prix: 44.99,
      inventaire: 9,
      image: promo3,
    },
    {
      id: 8,
      nom: "Dragonite V",
      prix: 54.99,
      inventaire: 6,
      image: promo4,
    },
    {
      id: 9,
      nom: "Umbreon GX",
      prix: 59.99,
      inventaire: 4,
      image: promo1,
    },
    {
      id: 10,
      nom: "Blastoise EX",
      prix: 42.99,
      inventaire: 11,
      image: promo2,
    },
    {
      id: 11,
      nom: "Snorlax VMAX",
      prix: 36.99,
      inventaire: 13,
      image: promo3,
    },
    {
      id: 12,
      nom: "Garchomp EX",
      prix: 47.99,
      inventaire: 3,
      image: promo4,
    },
  ];

  const produitsParPage = 6;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(produits.length / produitsParPage);

  const produitsAffiches = useMemo(
    () =>
      produits.slice(
        (page - 1) * produitsParPage,
        page * produitsParPage
      ),
    [page]
  );


  return (
    <div className="container-fluid ">

      {/* Grande section spéciale */}
       <div className="position-relative mb-4">

        <img
          src={special}
          className="w-100 rounded"
          style={{ height: "310px", objectFit: "cover" }}
        />

        <div className="position-absolute top-50 start-0 translate-middle-y ms-5">

          <h1
  className="text-white display-4 fw-bold text-center"
  style={{ textShadow: "5px 5px 16px black" }}
>
  Spéciale
</h1>

          <button className="btn btn-primary outline-dark btn-lg mt-3">
            
            Parcourir
          </button>

        </div>

      </div>


      {/* 4 blocs promo */}
<div className="row g-4 mb-5">

        <div className="col-md-6">
          <PromoCard img={promo1} title="Prix bas"/>
        </div>

        <div className="col-md-6">
          <PromoCard img={promo2} title="Incontournables"/>
        </div>

        <div className="col-md-6">
          <PromoCard img={promo3} title="Édition limitée"/>
        </div>

        <div className="col-md-6">
          <PromoCard img={promo4} title="Les plus rares"/>
        </div>

      </div>

           {/* Section Vedette */}
<h2 className="text-uppercase mb-4 fw-normal">En vedette</h2>

       <div className="row g-4">
        {produitsAffiches.map((produit) => (
          <div className="col-6 col-md-4 col-lg-2" key={produit.id}>
            <CarteAccueil
              nom={produit.nom}
              prix={produit.prix}
              inventaire={produit.inventaire}
              image={produit.image}
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