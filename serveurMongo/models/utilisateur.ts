import { ObjectId } from "mongodb";

export interface Panier {
  produitId: number; 
  quantite: number;
}

export interface Permission {
  lire: boolean;
  modifier: boolean;
  ajouter: boolean;
  supprimer: boolean;
}

export interface Utilisateur {
  _id?: ObjectId;
  courriel: string;
  motDePasse: string;
  permissions: Permission;
  panier: {
    items: Panier[];
  };
}