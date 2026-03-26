import { config } from "dotenv";
import { connectToMongo, getUtilisateurs, getProduits, getCommandes } from "./db/mongo.js";
import { createStudent } from "./Controller/utilisateurController.js";

config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

await connectToMongo(uri);

const students = getStudents();
createStudent(students);
