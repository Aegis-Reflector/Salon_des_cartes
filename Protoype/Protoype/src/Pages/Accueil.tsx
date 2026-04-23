import special from "../images/Special.png";
import promo1 from "../images/promo1.png";
import promo2 from "../images/promo2.png";
import promo3 from "../images/promo3.png";
import promo4 from "../images/promo4.png";
import arrowLeft from "../images/flecheG.png";
import arrowRight from "../images/flecheD.png";
import { useState, useEffect } from "react";
import TCGdex from "@tcgdex/sdk";
import { useNavigate } from "react-router";
const tcgdex = new TCGdex("fr");

type PromoCardProps = {
  img: string;
  title: string;
};

type Carte = {
  id: string;
  name: string;
  image?: string;
  rarity?: string;
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

const eurToUsd = (eur: number) => eur * 1.18;

export default function CatalogueProduitPage() {
  const [cartes, setCartes] = useState<Carte[]>([]);
  const [page, setPage] = useState(1);

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
      const cartesMelangees = melangerTableau(cartesFormatees);
      const huitCartesRandom = cartesMelangees.slice(0, 8);

      const cartesCompletes: Carte[] = await Promise.all(
        huitCartesRandom.map(async (carte) => {
          const detail: any = await tcgdex.card.get(carte.id);

          console.log(detail);

          const cardmarket = detail.pricing?.cardmarket;

          const marketPrice =
            cardmarket?.avg ??
            cardmarket?.trend ??
            cardmarket?.low ??
            cardmarket?.["avg-holo"] ??
            cardmarket?.["trend-holo"] ??
            cardmarket?.["low-holo"] ??
            null;

          console.log(carte.name, detail?.pricing?.cardmarket, marketPrice);

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
    } catch (error) {
      console.error("Erreur TCGdex :", error);
    }
  }

  // useEffect appelé au chargement de la page pour aller chercher les cartes
  useEffect(() => {
    voirCartes();
  }, []);

  const produitsParPage = 4;
  const totalPages = Math.ceil(cartes.length / produitsParPage);

  // Produits affichés pour la page actuelle
  const produitsAffiches = cartes.slice(
    (page - 1) * produitsParPage,
    page * produitsParPage,
  );
  // Fonction pour récupérer les cartes depuis le backend


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
          <h1 className="text-white display-4 fw-bold text-center"></h1>
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
        {produitsAffiches.map((carte) => (
          <div key={carte.id} className="col-md-3">
            <div
              className="card h-100 p-3"
              style={{
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div className="d-flex align-items-start gap-3">
                {carte.image && (
                  <img
                    src={carte.image}
                    alt={carte.name}
                    className="card-img-top"
                    style={{
                      width: "130px",
                      height: "180px",
                      objectFit: "contain",
                      borderRadius: "8px",
                      flexShrink: 0,
                    }}
                  />
                )}
                <div className="d-flex flex-column justify-content-start">
                  <h4 className="fw mb-2">{carte.name}</h4>

                  <p className="text-muted mb-2">
                    {carte.setName || "Set inconnu"}
                    {carte.rarity ? ` • ${carte.rarity}` : ""}
                    {carte.number ? `, #${carte.number}` : ""}
                  </p>
                  <h2 className="fw mb-1" style={{ fontSize: "38px" }}>
                    {carte.marketPrice !== null &&
                    carte.marketPrice !== undefined
                      ? `$${eurToUsd(carte.marketPrice).toFixed(2)}`
                      : "N/A"}
                  </h2>
                </div>
              </div>
            </div>
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
