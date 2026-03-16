import express from "express";
import cors from "cors";
import mysql, { ResultSetHeader , RowDataPacket  } from "mysql2/promise";
import { json } from "node:stream/consumers";

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

//Connexion 
app.post("/connexion", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    //Pour pouvoir transformer a une liste 
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM utilisateur WHERE courriel = ?", [email]);
    
    //Si il ny pas de comptes qui utilise cette email envoye faux
    if(rows.length === 0){
      console.log("Length error")
      return res.json({ success: false });
    }
    

    //Prenne l'utilisateur
    const utilisateur = rows[0];

    //Regarde si le mot de passe est bien celui dans notre systeme
    if(utilisateur.mot_de_passe !== password){

      //Si non on retourne faux 
      console.log("Password error")
      return res.json({success: false})
    }

    return res.json({success: true})
 	
  }catch(error){
    console.log(error)
    res.status(500).json({success: false });
    
  }
});


//Inscription
app.post("/inscription", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;


    //On regarde si le courriel nest pas deja utilisate
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM utilisateur WHERE courriel = ?", [email]);
    
    if(rows.length > 0){
      return res.json({success: false})
    }


    //Trouver le resultat de l'operation de creation
    const [user] = await pool.query<ResultSetHeader>("INSERT INTO utilisateur(courriel, mot_de_passe, panier_id_panier) VALUES(?,?, ?)", 
      [email, password, null]);

    //Remettre a jour les ids 
    const userId = user.insertId;

    //Creation de nouveau panier associer avec cette nouveau utilisateur
    await pool.query("INSERT INTO panier(quantite, id_utilisateur) VALUES(?,?)", [0,userId]);
    

    return res.json({success: true})

 	
  }catch(error){
    
    console.log(error)
    res.status(500).json({success: false });
  }
});

app.get("/events", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM events");
    res.status(201).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});


