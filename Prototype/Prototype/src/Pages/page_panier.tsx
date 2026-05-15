import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  changerQuantitePanier,
  commanderPanier,
  lirePanier,
  supprimerDuPanier,
  type PanierItem,
} from "../utils/panier";

type Card = {
  id: string;
  name: string;
  image: string;
  quantite: number;
  prix: number;
};

const eurToUsd = (eur: number) => eur * 1.18;

export default function PagePanier() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [message, setMessage] = useState("");

  async function chargerCartes(items?: PanierItem[]) {
    try {
      const panier = items ?? (await lirePanier());

      const results = await Promise.all(
        panier.map(async (item) => {
          const res = await fetch(
            `https://api.tcgdex.net/v2/fr/cards/${item.produitId}`,
          );
          const data = await res.json();

          return {
            ...data,
            quantite: item.quantite,
            prix: eurToUsd(
              data.pricing?.cardmarket?.avg ??
                data.pricing?.cardmarket?.trend ??
                data.pricing?.cardmarket?.low ??
                0,
            ),
          };
        }),
      );

      setCards(results);
      setMessage("");
    } catch {
      setCards([]);
      setMessage("Connectez-vous pour voir votre panier.");
    }
  }

  useEffect(() => {
    chargerCartes();
  }, []);

  async function diminuerQuantite(id: string) {
    const carte = cards.find((card) => card.id === id);
    if (!carte || carte.quantite <= 1) return;

    const panier = await changerQuantitePanier(id, carte.quantite - 1);
    await chargerCartes(panier);
  }

  async function augmenterQuantite(id: string) {
    const carte = cards.find((card) => card.id === id);
    if (!carte) return;

    const panier = await changerQuantitePanier(id, carte.quantite + 1);
    await chargerCartes(panier);
  }

  async function supprimerCarte(id: string) {
    const panier = await supprimerDuPanier(id);
    await chargerCartes(panier);
  }

  async function commander() {
    const panier = await commanderPanier();
    await chargerCartes(panier);
    setMessage("Commande confirmée. Votre panier est maintenant vide.");
  }

  const total = cards.reduce(
    (somme, card) => somme + Number(card.prix) * card.quantite,
    0,
  );

  return (
    <div>
      <div
        className="sticky-top bg-white px-4 py-3 shadow-sm"
        style={{ zIndex: 1020 }}
      >
        <h3 className="mb-0">Vos commandes</h3>
      </div>

      <div className="card shadow">
        <div className="card-body p-4">
          {message && <p className="text-muted">{message}</p>}

          <div className="d-flex flex-column gap-3">
            {cards.length === 0 && !message ? (
              <p className="text-muted mb-0">Votre panier est vide.</p>
            ) : (
              cards.map((card) => (
                <div key={card.id} className="card shadow-sm">
                  <div className="card-body d-flex align-items-center gap-4">
                    <img
                      src={`${card.image}/high.png`}
                      alt={card.name}
                      style={{ width: "100px", borderRadius: "8px" }}
                    />

                    <div>
                      <h5 className="mb-2">{card.name}</h5>
                      <h5 className="mb-2">
                        Prix: {Number(card.prix).toFixed(2)}$
                      </h5>
                      <p className="mb-3">Quantité: {card.quantite}</p>
                    </div>

                    <div className="ms-auto">
                      <div className="input-group input-group-sm w-auto">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => diminuerQuantite(card.id)}
                        >
                          -
                        </button>

                        <input
                          type="text"
                          style={{ maxWidth: "50px" }}
                          className="form-control text-center"
                          value={card.quantite}
                          //readOnly
                        />

                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => augmenterQuantite(card.id)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="btn btn-outline-danger btn-sm mt-2"
                        type="button"
                        onClick={() => supprimerCarte(card.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="fixed-bottom bg-white px-5 py-4 shadow-lg">
          <div className="d-flex justify-content-between align-items-center px-4">
            <h5 className="mb-0">Total: {total.toFixed(2)}$</h5>

            <div className="d-flex gap-3">
              <button
                className="btn btn-outline-secondary btn-lg rounded-pill px-5"
                onClick={() => navigate("/")}
              >
                Exit
              </button>

              <button
                className="btn btn-outline-primary btn-lg rounded-pill px-5"
                onClick={commander}
              >
                Commander
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
