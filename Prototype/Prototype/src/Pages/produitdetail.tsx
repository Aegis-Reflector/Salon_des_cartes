import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TCGdex from "@tcgdex/sdk";
import CarteUI from "../components/CarteUI";


const tcgdex = new TCGdex("fr");

type Carte = {
  id: string;
  name: string;
  image?: string;
  rarity?: string;
  localId?: string;
  category?: string;
  illustrator?: string;
  description?: string;
  set?: {
    name?: string;
  };
  pricing?: {
    cardmarket?: {
      avg?: number;
      trend?: number;
      low?: number;
      "avg-holo"?: number;
      "trend-holo"?: number;
      "low-holo"?: number;
    };
  };
};

const eurToUsd = (eur: number) => eur * 1.18;

export default function ProductDetail() {
    
  const { id } = useParams();
  const [carte, setCarte] = useState<Carte | null>(null);

  

  useEffect(() => {
    async function chargerProduit() {
      if (!id) return;

      try {
        const data: any = await tcgdex.card.get(id);
        setCarte(data);
      } catch (error) {
        console.error("Erreur detail carte:", error);
      }
    }

    chargerProduit();
  }, [id]);

  if (!carte) {
    return <p className="text-center mt-5">Chargement...</p>;
  }

  const cm = carte.pricing?.cardmarket;

  const prix =
    cm?.avg ??
    cm?.trend ??
    cm?.low ??
    cm?.["avg-holo"] ??
    cm?.["trend-holo"] ??
    cm?.["low-holo"] ??
    null;

  return (
    <div className="container py-5">
     
      <div className="row g-5">
        <div className="col-md-5 text-center">
          {carte.image && (
            <img
              src={`${carte.image}/high.png`}
              alt={carte.name}
              className="img-fluid rounded shadow"
              style={{ maxHeight: "600px" }}
            />
          )}
        </div>

        <div className="col-md-7">
          <h1>{carte.name}</h1>
          <p className="text-muted">{carte.set?.name}</p>

          <hr />

          <h3>
           {prix == null
             ? "N/A"
            : `$${eurToUsd(prix).toFixed(2)}`}

            </h3>

          <p>
            <strong>Numéro:</strong> {carte.localId}
          </p>

          <p>
            <strong>Rareté:</strong> {carte.rarity}
          </p>

          {carte.category && (
            <p>
              <strong>Type:</strong> {carte.category}
            </p>
          )}

          {carte.illustrator && (
            <p>
              <strong>Artiste:</strong> {carte.illustrator}
            </p>
          )}

          {carte.description && (
            <>
              <h5 className="mt-4">Description</h5>
              <p>{carte.description}</p>
            </>
          )}

          <button className="btn btn-primary btn-lg mt-3">
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}
