import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Carte = {
  id: string;
  name: string;
  image?: string;
  rarity?: string;
  setName?: string;
  number?: string;
  marketPrice?: number | null;
};

type CarteUIProps = {
  carte: Carte;
};

const eurToUsd = (eur: number) => eur * 1.18;

export default function CarteUI({ carte }: CarteUIProps) {
  const [tempsDepasse, setTempsDepasse] = useState(false);

  useEffect(() => {
    setTempsDepasse(false);

    const timer = setTimeout(() => {
      setTempsDepasse(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, [carte.id]);

  return (
    <Link
    to={`/produit/${carte.id}`}
    className="text-decoration-none text-dark"
  >
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
            loading="lazy"
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
          <h4 className="mb-2">{carte.name}</h4>

          <p className="text-muted mb-2">
            {carte.setName || "Set inconnu"}
            {carte.rarity ? ` • ${carte.rarity}` : ""}
            {carte.number ? `, #${carte.number}` : ""}
          </p>

          <h4>
            {carte.marketPrice !== null && carte.marketPrice !== undefined ? (
              `$${eurToUsd(carte.marketPrice).toFixed(2)}`
            ) : tempsDepasse ? (
              "N/A"
            ) : (
              <div
                className="spinner-border spinner-border-sm text-dark"
                role="status"
              >
                <span className="visually-hidden">Chargement...</span>
              </div>
            )}
          </h4>
        </div>
      </div>
    </div>
    </Link>
  );
}
