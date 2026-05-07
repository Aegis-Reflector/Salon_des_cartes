import { Router } from "express";
import { authenticateToken } from "../middleware/jwtToken.js";
import { getUtilisateurs } from "../db/mongo.js";
import { getUtilisateurById } from "../Controller/utilisateurController.js"

const router = Router();

router.post("/protected", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    return res.status(201).json({ message: `You are allowed: ${user?.courriel}` });
  } catch (error) {
    return res.status(500).json({ message: "Database error" });
  }
});


router.get("/me", authenticateToken, async (req, res) => {
  try {
    console.log("cookies:", req.cookies);
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await getUtilisateurs().findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
       _id: user._id,
        courriel: user.courriel,

        nomUtilisateur: user.nomUtilisateur,
        motDePasse: user.motDePasse,
        telephone: user.telephone,
        statutCompte: user.statutCompte,

        compteActive: user.compteActive,
        cookiesAccepted: user.cookiesAccepted,

        notificationEmail: user.notificationEmail,
        notificationSMS: user.notificationSMS,

        visibiliteProfil: user.visibiliteProfil,
        partageDonnees: user.partageDonnees,

        permissions: user.permissions,
        panier: user.panier,
    });
  } catch (error) {
    return res.status(500).json({ message: "Database error" });
  }
});


router.delete("/deletePanier", authenticateToken, async(req , res) =>{
try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur not logged in" })
    }
    const result = await getUtilisateurs().updateOne(
      { _id: userId },
      { $set: { "panier.items": [] } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Aucun utilisateur avec ce id" });
    }

    return res.status(200).json({ message: "Panier vidé" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Database error" });

  }
})

router.get("/getPanier", authenticateToken, async(req, res) =>{

  try{

    const userId = req.user?._id;

    if(!userId){
      return res.status(401).json({message: " Utilisateur not logged in"})
    }
      const user = await getUtilisateurs().findOne({ _id: userId });

      if(user?.panier){
        return res.status(200).json({panier: user?.panier})
      }
    }catch(error){
    console.log(error)
    return res.status(500).json({ message: "Database error"})

  }


})

export default router;
