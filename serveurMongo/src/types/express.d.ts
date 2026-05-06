import { Utilisateur } from "../models/utilisateur";

declare global {
  namespace Express {
    interface Request {
      user?: Utilisateur;
    }
  }
}
