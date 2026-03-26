import { Collection, ObjectId } from "mongodb";
import { Produit } from "../models/produit";


export async function createProduit(
  collection: Collection<Produit>,
  user: Produit
) {
  await collection.insertOne(user);
}

export async function deleteProduit(
  collection: Collection<Produit>,
  user: Produit
){
 await collection.deleteOne(user);
}

export async function updateProduit(
  collection: Collection<Produit>,
  id: ObjectId
){  
  await collection.updateOne({_id: id}, {})

}

export async function readProduit(){

}


