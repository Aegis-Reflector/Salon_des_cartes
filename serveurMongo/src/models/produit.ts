import { ObjectId } from "mongodb";

export interface Inventaire {
  quantiteDisponible: number;
}

export interface Produit {
  _id?: ObjectId;
  nom: string;
  prix: number;
  artiste?: string;
  numeroCarte?: string;
  rarete?: string;
  attaque?: string;
  image?: string;
  inventaire: Inventaire;
}