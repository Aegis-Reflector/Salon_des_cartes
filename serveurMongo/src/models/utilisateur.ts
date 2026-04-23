import { ObjectId } from "mongodb";
import type{Produit} from "./produit.js"

export interface Utilisateur {
  _id?: ObjectId;
  courriel: string;
  motDePasse: string;
  permissions?: {
    lire: boolean,
    modifier: boolean,
    ajouter: boolean,
    supprimer: boolean
  };
  panier?: {

    items: {
      produit: Produit;
      quantite: number;
    }[];
   
  };

   token?: string;
}