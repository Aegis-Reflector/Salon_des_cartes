import { Collection, ObjectId, InsertOneResult, UpdateResult, DeleteResult } from "mongodb";
import { Utilisateur } from "../models/utilisateur.js";

// Trouver un utilisateur par courriel
export async function getUtilisateurByCourriel(
  collection: Collection<Utilisateur>,
  courriel: string,
): Promise<Utilisateur | null> {
  return await collection.findOne({ courriel });
}

// Trouver un utilisateur par id
export async function getUtilisateurById(
  collection: Collection<Utilisateur>,
  id: ObjectId | string,
): Promise<Utilisateur | null> {
  return await collection.findOne({ _id: new ObjectId(id) });
}

// Ajouter un utilisateur
export async function registerUtilisateur(
  collection: Collection<Utilisateur>,
  utilisateur: Utilisateur,
): Promise<InsertOneResult<Utilisateur>> {
  return await collection.insertOne(utilisateur);
}

// Mettre à jour le token
export async function updateUtilisateurToken(
  collection: Collection<Utilisateur>,
  utilisateurId: ObjectId,
  token: string = "",
): Promise<UpdateResult<Utilisateur>> {
  return await collection.updateOne(
    { _id: utilisateurId },
    { $set: { token } },
  );
}

export async function getPanierUtilisateur(
  collection: Collection<Utilisateur>,
  utilisateurId: ObjectId,
) {
  const user = await collection.findOne(
    { _id: utilisateurId },
    { projection: { panier: 1 } },
  );

  return user?.panier?.items ?? [];
}

export async function ajouterProduitPanier(
  collection: Collection<Utilisateur>,
  utilisateurId: ObjectId,
  produitId: string,
): Promise<UpdateResult<Utilisateur>> {
  const user = await collection.findOne({ _id: utilisateurId });
  const items = user?.panier?.items ?? [];
  const itemExistant = items.find((item) => item.produitId === produitId);

  const nouveauxItems = itemExistant
    ? items.map((item) =>
        item.produitId === produitId
          ? { ...item, quantite: item.quantite + 1 }
          : item,
      )
    : [...items, { produitId, quantite: 1 }];

  return await collection.updateOne(
    { _id: utilisateurId },
    { $set: { "panier.items": nouveauxItems } },
  );
}

export async function changerQuantitePanier(
  collection: Collection<Utilisateur>,
  utilisateurId: ObjectId,
  produitId: string,
  quantite: number,
): Promise<UpdateResult<Utilisateur>> {
  const user = await collection.findOne({ _id: utilisateurId });
  const items = user?.panier?.items ?? [];
  const nouveauxItems = items
    .map((item) =>
      item.produitId === produitId ? { ...item, quantite } : item,
    )
    .filter((item) => item.quantite > 0);

  return await collection.updateOne(
    { _id: utilisateurId },
    { $set: { "panier.items": nouveauxItems } },
  );
}

export async function viderPanierUtilisateur(
  collection: Collection<Utilisateur>,
  utilisateurId: ObjectId,
): Promise<UpdateResult<Utilisateur>> {
  return await collection.updateOne(
    { _id: utilisateurId },
    { $set: { "panier.items": [] } },
  );
}

// Obtenir tous les utilisateurs
export async function getAllUtilisateurs(
  collection: Collection<Utilisateur>,
): Promise<Utilisateur[]> {
  return await collection.find({}).toArray();
}

export async function updateUtilisateurCompte(
  collection: Collection<Utilisateur>,
  id: string,
  compteActive: boolean,
  statutCompte: string,
): Promise<UpdateResult<Utilisateur>> {
  return await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { compteActive, statutCompte } },
  );
}

// Supprimer un utilisateur
export async function deleteUtilisateur(
  collection: Collection<Utilisateur>,
  id: string,
): Promise<DeleteResult> {
  return await collection.deleteOne({ _id: new ObjectId(id) });
}

