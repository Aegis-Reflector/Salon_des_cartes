import express from "express";
import cors from "cors";
import mysql, { ResultSetHeader } from "mysql2/promise";

const app = express();
const PORT = 4000;

const pool = mysql.createPool({
    host: "localhost",
    user: "scott",
    password: "oracle",
    database: "scott",
});


app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//GET
    app.get("/produits", async (req, res) => {
    try {
        const [rows] = await pool.query(`
        SELECT id_produit, nom, prix, carte_texte, numero_carte, rarete, image, extension
        FROM produit
        `);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
    });

// POST
app.post("/produits", async (req, res) => {
  try {
    const {
      nom,
      prix,
      carte_texte,
      numero_carte,
      rarete,
      image,
      extension
    } = req.body;

    const [result] = await pool.query<ResultSetHeader>(
      `
      INSERT INTO produit
      (nom, prix, carte_texte, numero_carte, rarete, image, extension)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [nom, prix, carte_texte, numero_carte, rarete, image, extension]
    );

    res.status(201).json({
      message: "Produit ajouté",
      id: result.insertId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur ajout produit" });
  }
});

//PUT
app.put("/produits/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nom,
      prix,
      carte_texte,
      numero_carte,
      rarete,
      image,
      extension
    } = req.body;

     const [result] = await pool.query<ResultSetHeader>(
      `
      INSERT INTO produit
      (nom, prix, carte_texte, numero_carte, rarete, image, extension)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [nom, prix, carte_texte, numero_carte, rarete, image, extension]
    );

    res.status(201).json({
      message: "Produit ajouté",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur ajout produit" });
  }
});

//DELETE
app.delete("/produits/:id", async (req, res) => {
  try {
    const { id } = req.params;


     // Supprimer la relation panier
    await pool.query(
      "DELETE FROM panier_produit WHERE id_produit = ?",
      [id]
    );

    //Supprime la relation avec produit_commande en premier 
     await pool.query(
      "DELETE FROM produit_commande WHERE id_produit = ?",
      [id]
    );


    await pool.query(
      "DELETE FROM produit WHERE id_produit = ?",
      [id]
    );

    res.json({ message: "Produit supprimé" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur suppression produit" });
  }
});