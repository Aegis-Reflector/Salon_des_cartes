import { Router } from "express";
import {
  ajouterProduitPanier,
  changerQuantitePanier,
  getPanierUtilisateur,
  viderPanierUtilisateur,
} from "../Controller/utilisateurController.js";
import { getUtilisateurs } from "../db/mongo.js";
import { authenticateToken } from "../middleware/jwtToken.js";

const router = Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const items = await getPanierUtilisateur(getUtilisateurs(), userId);
    return res.status(200).json({ items });
  } catch {
    return res.status(500).json({ message: "Database error" });
  }
});  

router.post("/items", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id;
    const { produitId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!produitId) {
      return res.status(400).json({ message: "produitId is required" });
    }

    await ajouterProduitPanier(getUtilisateurs(), userId, produitId);
    const items = await getPanierUtilisateur(getUtilisateurs(), userId);

    return res.status(200).json({ items });
  } catch {
    return res.status(500).json({ message: "Database error" });
  }
});

router.patch("/items/:produitId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id;
    const produitId = String(req.params.produitId);
    const quantite = Number(req.body.quantite);

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!Number.isFinite(quantite)) {
      return res.status(400).json({ message: "quantite must be a number" });
    }

    await changerQuantitePanier(
      getUtilisateurs(),
      userId,
      produitId,
      Math.max(0, quantite),
    );
    const items = await getPanierUtilisateur(getUtilisateurs(), userId);

    return res.status(200).json({ items });
  } catch {
    return res.status(500).json({ message: "Database error" });
  }
});

router.delete("/items/:produitId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id;
    const produitId = String(req.params.produitId);

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    await changerQuantitePanier(getUtilisateurs(), userId, produitId, 0);
    const items = await getPanierUtilisateur(getUtilisateurs(), userId);

    return res.status(200).json({ items });
  } catch {
    return res.status(500).json({ message: "Database error" });
  }
});

router.post("/commander", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    await viderPanierUtilisateur(getUtilisateurs(), userId);
    return res.status(200).json({ items: [] });
  } catch {
    return res.status(500).json({ message: "Database error" });
  }
});

export default router;
