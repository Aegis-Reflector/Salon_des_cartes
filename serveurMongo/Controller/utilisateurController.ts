import { Collection, ObjectId } from "mongodb";
import { Utilisateur } from "../models/utilisateur";


export async function createUser(
  collection: Collection<Utilisateur>,
  user: Utilisateur
) {
  await collection.insertOne(user);
}

export async function deleteUser(
  collection: Collection<Utilisateur>,
  user: Utilisateur
){
 await collection.deleteOne(user);
}

export async function updateUser(
  collection: Collection<Utilisateur>,
  id: ObjectId
){  
  await collection.updateOne({_id: id}, {})

}

export async function readUser(){

}


