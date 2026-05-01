import special from "../images/Special.png";
import promo1 from "../images/promo1.png";
import promo2 from "../images/promo2.png";
import promo3 from "../images/promo3.png";
import promo4 from "../images/promo4.png";
import arrowLeft from "../images/flecheG.png";
import arrowRight from "../images/flecheD.png";

import { useState, useEffect } from "react";
import TCGdex from "@tcgdex/sdk";

const tcgdex = new TCGdex("fr");

type Carte = {
  id: string;
  name: string;
  image?: string;
  rarity?: string;
  setName?: string;
  number?: string;
  marketPrice?: number | null;
};

type PromoCardProps = {
  img: string;
  title: string;
};

const eurToUsd = (eur: number) => eur * 1.18;

function melangerTableau(tableau: Carte[]) {
  return [...tableau].sort(() => Math.random() - 0.5);
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
          className="text-white fw-bold"
          style={{
            textShadow: "3px 3px 10px rgba(0,0,0,0.9)",
          }}
        >
          {title}
        </h1>
      </div>

      <div className="position-absolute top-50 start-50 translate-middle">
        <button className="btn btn-light btn-lg fw-semibold btn-outline-dark">
          Parcourir
        </button>
      </div>
    </div>
  );
}

export default function CatalogueProduitPage() {
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [cartes, setCartes] = useState<Carte[]>([]);
  const [page, setPage] = useState(1);

  async function fetchCartes() {
    try {
      const data = await tcgdex.card.list();

      const cartesFiltrees: Carte[] = data
        .filter((c: any) => c.image && c.name)
        .map((c: any) => ({
          id: c.id,
          name: c.name,
          image: c.image + "/low.png",
        }));

      const randomCartes = melangerTableau(cartesFiltrees).slice(0, 8);

      const cartesCompletes = await Promise.all(
        randomCartes.map(async (carte) => {
          const detail: any = await tcgdex.card.get(carte.id);

          const cm = detail.pricing?.cardmarket;

          const marketPrice =
            cm?.avg ??
            cm?.trend ??
            cm?.low ??
            cm?.["avg-holo"] ??
            cm?.["trend-holo"] ??
            cm?.["low-holo"] ??
            null;

          return {
            id: detail.id,
            name: detail.name,
            image: detail.image ? detail.image + "/low.png" : undefined,
            rarity: detail.rarity,
            setName: detail.set?.name,
            number: detail.localId,
            marketPrice,
          };
        }),
      );

      setCartes(cartesCompletes);
      setPage(1);
    } catch (err) {
      console.error("Erreur TCGdex:", err);
    }
  }

  useEffect(() => {
    fetchCartes();
  }, []);

  const produitsParPage = 4;
  const totalPages = Math.ceil(cartes.length / produitsParPage);

  const produitsAffiches = cartes.slice(
    (page - 1) * produitsParPage,
    page * produitsParPage,
  );

  return (
    <div className="container-fluid p-5">
      <div className="mb-4 position-relative">
        <img
          src={special}
          className="w-100 rounded"
          style={{ height: "310px", objectFit: "cover" }}
        />
      </div>

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

      <h2 className="text-uppercase mb-4">En vedette</h2>

      <div className="row g-4">
        {produitsAffiches.map((carte) => (
          <div key={carte.id} className="col-md-3">
            <div className="card h-100 p-3 shadow-sm rounded">
              <div className="d-flex gap-3">
                {carte.image && (
                  <img
                    src={carte.image}
                    alt={carte.name}
                    style={{
                      width: "120px",
                      height: "170px",
                      objectFit: "contain",
                    }}
                  />
                )}

                <div>
                  <h5>{carte.name}</h5>

                  <p className="text-muted small">
                    {carte.setName || "Set inconnu"}
                    {carte.rarity && ` • ${carte.rarity}`}
                    {carte.number && ` #${carte.number}`}
                  </p>

                  <h4>
                    {carte.marketPrice
                      ? `$${eurToUsd(carte.marketPrice).toFixed(2)}`
                      : "N/A"}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-outline-dark me-2"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          <img src={arrowLeft} style={{ width: "18px" }} />
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          className="btn btn-outline-dark ms-2"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          <img src={arrowRight} style={{ width: "18px" }} />
        </button>
      </div>
    </div>
  );
}
