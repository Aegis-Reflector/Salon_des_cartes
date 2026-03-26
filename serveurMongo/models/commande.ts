import { ObjectId } from "mongodb";

export interface Produit {
  produitId: number;
  nom: string;
  prix: number;
  quantite: number;
}

export interface AdresseLivraison {
  adresse: string;
  ville: string;
  codePostal: string;
}

export interface Commande {
  _id?: ObjectId;
  userId: number;
  dateCommande: Date;
  adresseLivraison: AdresseLivraison;
  items: Produit[];
  total: number;
}