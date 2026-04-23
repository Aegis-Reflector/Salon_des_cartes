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

// Obtenir tous les utilisateurs
export async function getAllUtilisateurs(
  collection: Collection<Utilisateur>,
): Promise<Utilisateur[]> {
  return await collection.find({}).toArray();
}

// Supprimer un utilisateur
export async function deleteUtilisateur(
  collection: Collection<Utilisateur>,
  id: string,
): Promise<DeleteResult> {
  return await collection.deleteOne({ _id: new ObjectId(id) });
}

