import { Collection, ObjectId, InsertOneResult, UpdateResult, DeleteResult } from "mongodb";
import { Produit } from "../models/produit.js";

export async function getProduitById(
  collection: Collection<Produit>,
  id: string,
): Promise<Produit | null> {
  return await collection.findOne({ _id: new ObjectId(id) });
}

export async function getAllProduits(
  collection: Collection<Produit>,
): Promise<Produit[]> {
  return await collection.find({}).toArray();
}

export async function createProduit(
  collection: Collection<Produit>,
  produit: Produit,
): Promise<InsertOneResult<Produit>> {
  return await collection.insertOne(produit);
}

export async function updateProduit(
  collection: Collection<Produit>,
  id: string,
  data: Partial<Produit>,
): Promise<UpdateResult<Produit>> {
  return await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: data },
  );
}

export async function deleteProduit(
  collection: Collection<Produit>,
  id: string,
): Promise<DeleteResult> {
  return await collection.deleteOne({ _id: new ObjectId(id) });
}


