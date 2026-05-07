import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function PagePanier() {
  const navigate = useNavigate();

  // DELETE THIS LATER
  const panier = [
    { produitId: "swsh3-136", quantite: 2 },
    { produitId: "swsh1-1", quantite: 1 },
  ];

  type Card = {
    id: string;
    name: string;
    image: string;
    quantite: number;
    prix: number;
  };

  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    async function fetchCards() {
      const results = await Promise.all(
        panier.map(async (item) => {
          const res = await fetch(
            `http://localhost:4000/tests/produits/${item.produitId}`,
            {
              method: "GET",
              credentials: "include",
            },
          );

          const produit = await res.json();

          return {
            ...produit,
            quantite: item.quantite,
          };
        }),
      );

      setCards(results);
    }
    fetchCards();
  }, []);

  function diminuerQuantite(id: string) {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id && card.quantite > 1
          ? { ...card, quantite: card.quantite - 1 }
          : card,
      ),
    );
  }

  function augmenterQuantite(id: string) {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id && card.quantite > 1
          ? { ...card, quantite: card.quantite + 1 }
          : card,
      ),
    );
  }

  function calculerPrixTotal() {
    return cards.reduce((total, card) => total + card.prix * card.quantite, 0);
  }

  async function clearPanierUtilisateur() {
    try {
      const res = await fetch(
        "http://localhost:4000/utilisateurs/deletePanier",
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Impossible de vider le panier");
      }

      setCards([]);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }
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
          {/* SECTION CARTE */}

          <div className="d-flex flex-column gap-3">
            {cards.map((card) => (
              <div key={card.id} className="card shadow-sm">
                <div className="card-body d-flex align-items-center gap-4">
                  <img
                    src={`${card.image}/high.png`}
                    style={{ width: "100px", borderRadius: "8px" }}
                  />

                  <div>
                    <h5 className="mb-2">{card.name}</h5>
                    <div>
                      <h5 className="mb-2">Prix: {card.prix}</h5>
                    </div>
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
                        readOnly
                      />

                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => augmenterQuantite(card.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION BAS */}
        <div className="fixed-bottom bg-white px-5 py-4 shadow-lg">
          <div className="d-flex justify-content-between align-items-center px-4">
            <h5 className="mb-0">Total: {calculerPrixTotal().toFixed(2)}$ </h5>

            <div className="d-flex gap-3">
              <button
                className="btn btn-outline-secondary btn-lg rounded-pill px-5"
                onClick={() => navigate("/")}
              >
                Exit
              </button>

              <button
                className="btn btn-outline-primary btn-lg rounded-pill px-5"
                onClick={() => {
                  clearPanierUtilisateur();
                  navigate("/");
                }}
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
