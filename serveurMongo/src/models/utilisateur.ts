import { ObjectId } from "mongodb";
import type{Produit} from "./produit.js"

export interface Utilisateur {
  _id?: ObjectId;

  courriel: string;
  motDePasse: string;

  nomUtilisateur?: string;
  telephone?: string;
  statutCompte?: string;

  compteActive?: boolean;
  cookiesAccepted?: boolean;


  notificationEmail?: boolean;
  notificationSMS?: boolean;

  visibiliteProfil?: boolean;
  partageDonnees?: boolean;


  permissions?: {
    lire: boolean,
    modifier: boolean,
    ajouter: boolean,
    supprimer: boolean
  };


  panier: {
    items: {
      produit: Produit;
      quantite: number;
    }[];
   
  };
  token?: string;
}