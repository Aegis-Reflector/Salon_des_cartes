import { Router } from "express";
import { authenticateToken } from "../middleware/jwtToken.js";

const router = Router();

router.post("/protected", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    return res.status(201).json({ message: `You are allowed: ${user?.courriel}` });
  } catch (error) {
    return res.status(500).json({ message: "Database error" });
  }
});

router.get("/me", authenticateToken, async (req , res) =>{
  try{
    const user = req.user;    
 if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    return res.status(200).json({
       _id: user._id,
      courriel: user.courriel,
      nomComplet: user.nomComplet,
      nomUtilisateur: user.nomUtilisateur,
      telephone: user.telephone,
      statutCompte: user.statutCompte,
      permissions: user.permissions,
      panier: user.panier,
    });
  } catch (error) {
    return res.status(500).json({ message: "Database error" });
  }
});

export default router;
