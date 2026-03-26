import { Collection, Db, MongoClient } from "mongodb";
import { Utilisateur } from "../models/utilisateur";
import { Commande } from "../models/commande";
import { Produit } from "../models/produit";
 


let mongoClient: MongoClient;

export async function connectToMongo(uri: string) {
  mongoClient = new MongoClient(uri);

  try {
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Connection to MongoDB failed!", error);
    throw Error("Connection to MongoDB failed, error: " + error);
  }
}

export function getSalonDB(): Db {
  return mongoClient.db("Salon");
}

export function getUtilisateurs(): Collection<Utilisateur> {
  return getSalonDB().collection("utilisateurs");
}

export function getCommandes(): Collection<Commande> {
  return getSalonDB().collection("commandes");
}

export function getProduits(): Collection<Produit> {
  return getSalonDB().collection("produits");
}
