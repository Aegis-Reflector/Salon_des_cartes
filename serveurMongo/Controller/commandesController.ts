import { Collection, ObjectId } from "mongodb";
import { Commande } from "../models/commande";


export async function createCommande(
  collection: Collection<Commande>,
  user: Commande
) {
  await collection.insertOne(user);
}

export async function deleteCommande(
  collection: Collection<Commande>,
  user: Commande
){
 await collection.deleteOne(user);
}

export async function updateCommande(
  collection: Collection<Commande>,
  id: ObjectId
){  
  await collection.updateOne({_id: id}, {})

}

export async function readCommande(){

}


