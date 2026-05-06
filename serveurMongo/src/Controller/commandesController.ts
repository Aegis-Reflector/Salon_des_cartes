import { Collection, ObjectId, InsertOneResult, UpdateResult, DeleteResult } from "mongodb";
import { Commande } from "../models/commande.js";


export async function getCommandeById(
  collection: Collection<Commande>,
  id: string,
): Promise<Commande | null> {
  return await collection.findOne({ _id: new ObjectId(id) });
}

export async function getAllCommandes(
  collection: Collection<Commande>,
): Promise<Commande[]> {
  return await collection.find({}).toArray();
}

export async function createCommande(
  collection: Collection<Commande>,
  commande: Commande,
): Promise<InsertOneResult<Commande>> {
  return await collection.insertOne(commande);
}

export async function updateCommande(
  collection: Collection<Commande>,
  id: string,
  data: Partial<Commande>,
): Promise<UpdateResult<Commande>> {
  return await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: data },
  );
}

export async function deleteCommande(
  collection: Collection<Commande>,
  id: string,
): Promise<DeleteResult> {
  return await collection.deleteOne({ _id: new ObjectId(id) });
}


