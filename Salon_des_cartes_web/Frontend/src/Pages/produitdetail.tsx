import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TCGdex from "@tcgdex/sdk";
import { ErreurPanier, ajouterAuPanier } from "../utils/panier";
import CarteUI from "../components/CarteUI";
import flecheG from "../images/flecheG.png";
import flecheD from "../images/flecheD.png";


const tcgdex = new TCGdex("fr");

type Carte = {
  id: string;
  name: string;
  image?: string;
  rarity?: string;
  localId?: string;
  number?: string;
  category?: string;
  illustrator?: string;
  description?: string;
  setName?: string;
  marketPrice?: number | null;
  set?: {
    id?: string;
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

function melangerTableau(tableau: Carte[]) {
  const copie = [...tableau];

  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }

  return copie;
}

export default function ProductDetail() {
    
  const { id } = useParams();
  const navigate = useNavigate();
  const [carte, setCarte] = useState<Carte | null>(null);
  const [cartesSuggerees, setCartesSuggerees] = useState<Carte[]>([]);
  const [pageSuggestions, setPageSuggestions] = useState(1);
  const [messagePanier, setMessagePanier] = useState("");

  

  useEffect(() => {
    async function chargerProduit() {
      if (!id) return;

      try {
        const data: any = await tcgdex.card.get(id);
        setCarte(data);

        const cartesListe: any[] = await tcgdex.card.list();
        const cartesFormatees: Carte[] = cartesListe
          .filter((card: any) => card.id !== id && card.image && card.name)
          .map((card: any) => ({
            id: card.id,
            name: card.name,
            image: `${card.image}/low.png`,
            rarity: card.rarity,
            marketPrice: null,
          }));

        const cartesMelangees = melangerTableau(cartesFormatees);
        const huitCartesRandom = cartesMelangees.slice(0, 8);

        setPageSuggestions(1);
        setCartesSuggerees(huitCartesRandom);

        const suggestions = await Promise.all(
          huitCartesRandom.map(async (card) => {
            try {
              const detail: any = await tcgdex.card.get(card.id);
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
                image: detail.image ? `${detail.image}/low.png` : undefined,
                rarity: detail.rarity,
                number: detail.localId,
                setName: detail.set?.name,
                marketPrice,
              };
            } catch {
              return card;
            }
          }),
        );

        setCartesSuggerees(suggestions);
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
  const suggestionsParPage = 4;
  const totalPagesSuggestions = Math.max(
    1,
    Math.ceil(cartesSuggerees.length / suggestionsParPage),
  );
  const suggestionsAffichees = cartesSuggerees.slice(
    (pageSuggestions - 1) * suggestionsParPage,
    pageSuggestions * suggestionsParPage,
  );

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

          <button
            className="btn btn-primary btn-lg mt-3"
            type="button"
            onClick={async () => {
              if (!id) return;

              try {
                await ajouterAuPanier(id);
                setMessagePanier("Carte ajoutée au panier");
              } catch (error) {
                if (error instanceof ErreurPanier && error.status === 401) {
                  navigate("/connexion");
                  return;
                }

                setMessagePanier("Impossible d'ajouter la carte au panier");
              }
            }}
          >
            Ajouter au panier
          </button>
          {messagePanier && <p className="mt-2">{messagePanier}</p>}
        </div>
      </div>

      {cartesSuggerees.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-4">Cartes suggérées</h3>
          <div className="row g-4">
            {suggestionsAffichees.map((suggestion) => (
              <div key={suggestion.id} className="col-lg-3 col-md-6 col-sm-12">
                <CarteUI
                  carte={suggestion}
                  lien={`/produit/${encodeURIComponent(suggestion.id)}`}
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <button
              className="btn btn-outline-dark me-2"
              disabled={pageSuggestions === 1}
              onClick={() => setPageSuggestions((page) => page - 1)}
            >
              <img src={flecheG} alt="page précédente" style={{ width: "18px" }} />
            </button>

            <span className="mx-2">
              Page {pageSuggestions} / {totalPagesSuggestions}
            </span>

            <button
              className="btn btn-outline-dark ms-2"
              disabled={pageSuggestions === totalPagesSuggestions}
              onClick={() => setPageSuggestions((page) => page + 1)}
            >
              <img src={flecheD} alt="page suivante" style={{ width: "18px" }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
