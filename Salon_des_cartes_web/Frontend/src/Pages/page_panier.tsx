import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SidebarLayout from "../components/SidebarLayout";
import {
  changerQuantitePanier,
  commanderPanier,
  lirePanier,
  supprimerDuPanier,
  type PanierItem,
} from "../utils/panier";
// Type représentant une carte affichée dans le panier
type Carte = {
  id: string;
  name: string;
  image: string;
  quantite: number;
  prix: number;
};

// Convertit un prix en euros vers un prix en dollars américains
const convertirEurVersUsd = (eur: number) => eur * 1.18;

export default function PagePanier() {
  // Permet de naviguer vers une autre page
  const naviguer = useNavigate();

  // Liste des cartes affichées dans le panier
  const [cartes, setCartes] = useState<Carte[]>([]);

  // Message affiché à l’utilisateur
  const [message, setMessage] = useState("");

  // Charge les cartes du panier
  async function chargerCartes(items?: PanierItem[]) {
    try {
      // Si un panier est fourni, on l’utilise. Sinon, on lit le panier actuel.
      const panier = items ?? (await lirePanier());

      // Récupère les informations complètes de chaque carte
      const resultats = await Promise.all(
        panier.map(async (item) => {
          const reponse = await fetch(
            `https://api.tcgdex.net/v2/fr/cards/${item.produitId}`,
          );

          if (!reponse.ok) {
            throw new Error("Impossible de charger une carte");
          }

          const donnees = await reponse.json();

          return {
            id: donnees.id,
            name: donnees.name,
            image: donnees.image,
            quantite: item.quantite,
            prix: convertirEurVersUsd(
              donnees.pricing?.cardmarket?.avg ??
                donnees.pricing?.cardmarket?.trend ??
                donnees.pricing?.cardmarket?.low ??
                0,
            ),
          };
        }),
      );

      setCartes(resultats);
      setMessage("");
    } catch {
      setCartes([]);
      setMessage("Connectez-vous pour voir votre panier.");
    }
  }

  // Charge le panier au chargement de la page
  useEffect(() => {
    chargerCartes();
  }, []);

  // Diminue la quantité d’une carte
  async function diminuerQuantite(id: string) {
    const carte = cartes.find((carte) => carte.id === id);

    if (!carte || carte.quantite <= 1) return;

    const panier = await changerQuantitePanier(id, carte.quantite - 1);
    await chargerCartes(panier);
  }

  // Augmente la quantité d’une carte
  async function augmenterQuantite(id: string) {
    const carte = cartes.find((carte) => carte.id === id);

    if (!carte) return;

    const panier = await changerQuantitePanier(id, carte.quantite + 1);
    await chargerCartes(panier);
  }

  // Supprime une carte du panier
  async function supprimerCarte(id: string) {
    const panier = await supprimerDuPanier(id);
    await chargerCartes(panier);
  }

  // Confirme la commande et vide le panier
  async function commander() {
    const panier = await commanderPanier();
    await chargerCartes(panier);
    setMessage("Commande confirmée. Votre panier est maintenant vide.");
  }

  // Calcule le prix total du panier
  const total = cartes.reduce(
    (somme, carte) => somme + Number(carte.prix) * carte.quantite,
    0,
  );

  return (
    <SidebarLayout title="Panier">
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
              {cartes.length === 0 && !message ? (
                <p className="text-muted mb-0">Votre panier est vide.</p>
              ) : (
                cartes.map((carte) => (
                  <div key={carte.id} className="card shadow-sm">
                    <div className="card-body d-flex align-items-center gap-4">
                      <img
                        src={`${carte.image}/high.png`}
                        alt={carte.name}
                        style={{ width: "100px", borderRadius: "8px" }}
                      />

                      <div>
                        <h5 className="mb-2">{carte.name}</h5>
                        <h5 className="mb-2">
                          Prix: {Number(carte.prix).toFixed(2)}$
                        </h5>
                        <p className="mb-3">Quantité: {carte.quantite}</p>
                      </div>

                      <div className="ms-auto">
                        <div className="input-group input-group-sm w-auto">
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => diminuerQuantite(carte.id)}
                          >
                            -
                          </button>

                          <input
                            type="text"
                            style={{ maxWidth: "50px" }}
                            className="form-control text-center"
                            value={carte.quantite}
                            readOnly
                          />

                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => augmenterQuantite(carte.id)}
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="btn btn-outline-danger btn-sm mt-2"
                          type="button"
                          onClick={() => supprimerCarte(carte.id)}
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

          <div
            className="position-fixed bottom-0 end-0 bg-white px-5 py-4 shadow-lg"
            style={{ zIndex: 1020, left: "246px" }}
          >
            <div className="d-flex justify-content-between align-items-center px-4">
              <h5 className="mb-0">Total: {total.toFixed(2)}$</h5>

              <div className="d-flex gap-3">
                <button
                  className="btn btn-outline-secondary btn-lg rounded-pill px-5"
                  type="button"
                  onClick={() => naviguer("/")}
                >
                  Exit
                </button>

                <button
                  className="btn btn-outline-primary btn-lg rounded-pill px-5"
                  type="button"
                  onClick={commander}
                  disabled={cartes.length === 0}
                >
                  Commander
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}