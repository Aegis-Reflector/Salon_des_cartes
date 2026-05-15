import { ObjectId } from "mongodb";

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
      produitId: string;
      quantite: number;
    }[];
  };
  token?: string;
}
