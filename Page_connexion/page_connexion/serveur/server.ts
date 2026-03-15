import express from "express";
import cors from "cors";
import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";
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



