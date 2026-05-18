import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TCGdex from "@tcgdex/sdk";

import special from "../images/Special.png";
import promo1 from "../images/promo1.png";
import promo2 from "../images/promo2.png";
import promo3 from "../images/promo3.png";
import promo4 from "../images/promo4.png";
import arrowLeft from "../images/flecheG.png";
import arrowRight from "../images/flecheD.png";


import CarteUI from "../components/CarteUI";

const tcgdex = new TCGdex("fr");

type PromoCardProps = {
  img: string;
  title: string;
  to: string;
};

type PromoSet = {
  id: string;
  title: string;
  img: string;
};

type Carte = {
  id: string;
  name: string;
  image?: string;
  rarity?: string;
  setId?: string;
  setName?: string;
  number?: string;
  marketPrice?: number | null;
};

function melangerTableau(tableau: Carte[]) {
  const copie = [...tableau];

  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }

  return copie;
}

function PromoCard({ img, title, to }: PromoCardProps) {
  return (
    <Link to={to} className="text-decoration-none text-dark">
      <div className="position-relative overflow-hidden rounded border border-dark border-4">
        <img
          src={img}
          className="w-100"
          alt={title}
          style={{
            height: "250px",
            objectFit: "cover",
            objectPosition: "center 40%",
          }}
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

        <div
          className="position-absolute bottom-0 start-0 end-0 text-center pb-3 pt-5"
          style={{
            zIndex: 3,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0))",
          }}
        >
          <button
            type="button"
            className="btn btn-light btn-lg px-4 py-2 fw-semibold btn-outline-dark"
          >
            Parcourir
          </button>
        </div>
      </div>
    </Link>
  );
}

const lienSerie = (setId: string) =>
  `/Catalogue?set=${encodeURIComponent(setId)}`;

const lienCarte = (carteId: string) =>
  `/produit/${encodeURIComponent(carteId)}`;

export default function Accueil() {
  const [cartes, setCartes] = useState<Carte[]>([]);
  const [page, setPage] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const promoSets: PromoSet[] = [
    { id: "sv05", title: "Forces Temporelles", img: promo1 },
    { id: "sv06", title: "Mascarade Crépusculaire", img: promo2 },
    { id: "sv04", title: "Faille Paradoxe", img: promo3 },
    { id: "sv04.5", title: "Destinées de Paldea", img: promo4 },
  ];

  async function voirCartes() {
    try {
      const data = await tcgdex.card.list();

      const cartesFormatees: Carte[] = data
        .filter((carte: any) => carte.image && carte.name)
        .map((carte: any) => ({
          id: carte.id,
          name: carte.name,
          image: carte.image + "/low.png",
          rarity: carte.rarity,
          marketPrice: null,
        }));

      const huitCartesRandom = melangerTableau(cartesFormatees).slice(0, 8);

      setCartes(huitCartesRandom);
      setPage(1);

      const cartesCompletes: Carte[] = await Promise.all(
        huitCartesRandom.map(async (carte) => {
          try {
            const res = await fetch(
              `https://api.tcgdex.net/v2/fr/cards/${carte.id}`,
            );

            if (!res.ok) return carte;

            const detail = await res.json();
            const cardmarket = detail.pricing?.cardmarket;

            const marketPrice =
              cardmarket?.avg ??
              cardmarket?.trend ??
              cardmarket?.low ??
              cardmarket?.["avg-holo"] ??
              cardmarket?.["trend-holo"] ??
              cardmarket?.["low-holo"] ??
              null;

            return {
              id: detail.id,
              name: detail.name,
              image: detail.image ? detail.image + "/low.png" : carte.image,
              rarity: detail.rarity ?? carte.rarity,
              setId: detail.set?.id,
              setName: detail.set?.name,
              number: detail.localId,
              marketPrice,
            };
          } catch (error) {
            console.error("Erreur detail carte:", carte.id, error);
            return carte;
          }
        }),
      );

      setCartes(cartesCompletes);
    } catch (error) {
      console.error("Erreur TCGdex :", error);
    }
  }

  useEffect(() => {
    voirCartes();
  }, []);

  const produitsParPage = 4;
  const totalPages = Math.max(1, Math.ceil(cartes.length / produitsParPage));

  const produitsAffiches = cartes.slice(
    (page - 1) * produitsParPage,
    page * produitsParPage,
  );

  return (
    <div className="container-fluid p-5">


      <div className="mb-4">
        <Link to="/Catalogue" className="text-decoration-none">
          <div className="position-relative overflow-hidden rounded">
            <img
              src={special}
              className="w-100"
              alt="Ascended Heroes"
              style={{ height: "310px", objectFit: "cover" }}
            />

            <div
              className="position-absolute bottom-0 start-0 end-0 text-center pb-3 pt-5"
              style={{
                zIndex: 3,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0))",
              }}
            >
              <button
                type="button"
                className="btn btn-light btn-lg px-4 py-2 fw-semibold btn-outline-dark"
              >
                Parcourir
              </button>
            </div>
          </div>
        </Link>
      </div>

      <div className="row g-4 mb-5">
        {promoSets.map((promo) => (
          <div className="col-md-6" key={promo.id}>
            <PromoCard
              img={promo.img}
              title={promo.title}
              to={lienSerie(promo.id)}
            />
          </div>
        ))}
      </div>

      <h2 className="text-uppercase mb-4 fw-normal">En vedette</h2>

      <div className="row g-4 mx-0">
        {produitsAffiches.map((carte) => (
          <div key={carte.id} className="col-lg-3 col-md-6 col">
            <CarteUI carte={carte} lien={lienCarte(carte.id)} />
          </div>
        ))}
      </div>

      <div className="row mt-4">
        <div className="col text-center">
          <button
            className="btn btn-outline-dark me-2"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            type="button"
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
            type="button"
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
