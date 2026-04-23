import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { config } from "dotenv";
import { connectToMongo, getUtilisateurs, getProduits, getCommandes } from "./db/mongo.js";

import userRoutes from "./routes/userRoutes.js"
import testRoutes from "./routes/testRoutes.js"


config();

const app = express()
const PORT = process.env.PORT;


app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());



const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}
await connectToMongo(uri);


app.use("/", userRoutes);
app.use("/", testRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


