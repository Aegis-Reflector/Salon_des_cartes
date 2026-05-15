export type PanierItem = {
  produitId: string;
  quantite: number;
};

const API_PANIER = "http://localhost:4000/panier";
export const EVENEMENT_PANIER = "panier-modifie";

export class ErreurPanier extends Error {
  status: number;

  constructor(status: number) {
    super("Impossible de charger le panier");
    this.status = status;
  }
}

function notifierPanierModifie() {
  window.dispatchEvent(new Event(EVENEMENT_PANIER));
}

async function lireReponsePanier(response: Response): Promise<PanierItem[]> {
  if (!response.ok) {
    throw new ErreurPanier(response.status);
  }

  const data = await response.json();
  return data.items ?? [];
}

export async function lirePanier(): Promise<PanierItem[]> {
  const response = await fetch(API_PANIER, {
    credentials: "include",
  });

  return lireReponsePanier(response);
}

export async function ajouterAuPanier(produitId: string): Promise<PanierItem[]> {
  const response = await fetch(`${API_PANIER}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ produitId }),
  });

  const panier = await lireReponsePanier(response);
  notifierPanierModifie();
  return panier;
}

export async function changerQuantitePanier(
  produitId: string,
  quantite: number,
): Promise<PanierItem[]> {
  const response = await fetch(`${API_PANIER}/items/${produitId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ quantite }),
  });

  const panier = await lireReponsePanier(response);
  notifierPanierModifie();
  return panier;
}

export async function supprimerDuPanier(
  produitId: string,
): Promise<PanierItem[]> {
  const response = await fetch(`${API_PANIER}/items/${produitId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const panier = await lireReponsePanier(response);
  notifierPanierModifie();
  return panier;
}

export async function commanderPanier(): Promise<PanierItem[]> {
  const response = await fetch(`${API_PANIER}/commander`, {
    method: "POST",
    credentials: "include",
  });

  const panier = await lireReponsePanier(response);
  notifierPanierModifie();
  return panier;
}
