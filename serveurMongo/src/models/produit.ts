import { ObjectId } from "mongodb";

export interface Inventaire {
  quantiteDisponible: number;
}

export interface Produit {
  _id?: ObjectId;
  nom: string;
  prix: number;
  carteTexte?: string;
  type?: string;
  artiste?: string;
  numeroCarte?: string;
  rarete?: string;
  attaque?: string;
  description?: string;
  extension?: string;
  image?: string;
  inventaire: Inventaire;
}