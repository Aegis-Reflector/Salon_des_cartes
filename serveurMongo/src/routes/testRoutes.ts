import { Router } from "express";
import { authenticateToken } from "../middleware/jwtToken.js";
import { getUtilisateurs } from "../db/mongo.js";
import bcrypt from "bcrypt";

const router = Router();

// Route protégée utilisée pour tester si l'utilisateur est authentifié
router.post("/protected", authenticateToken, async (req, res) => {
  try {
    // Récupère l'utilisateur connecté à partir du token
    const utilisateur = req.user;

    return res.status(201).json({
      message: `You are allowed: ${utilisateur?.courriel}`,
    });
  } catch (erreur) {
    return res.status(500).json({ message: "Database error" });
  }
});

// Route qui retourne les informations de l'utilisateur connecté
router.get("/me", authenticateToken, async (req, res) => {
  try {
    console.log("cookies:", req.cookies);

    // Récupère l'identifiant de l'utilisateur à partir du token
    const idUtilisateur = req.user?._id;

    // Vérifie si l'utilisateur est connecté
    if (!idUtilisateur) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Recherche l'utilisateur dans la base de données
    const utilisateur = await getUtilisateurs().findOne({
      _id: idUtilisateur,
    });

    // Vérifie si l'utilisateur existe
    if (!utilisateur) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retourne seulement les informations nécessaires au frontend
    return res.status(200).json({
      _id: utilisateur._id,
      courriel: utilisateur.courriel,

      nomUtilisateur: utilisateur.nomUtilisateur,
      telephone: utilisateur.telephone,
      statutCompte: utilisateur.statutCompte,

      compteActive: utilisateur.compteActive,
      cookiesAccepted: utilisateur.cookiesAccepted,

      notificationEmail: utilisateur.notificationEmail,
      notificationSMS: utilisateur.notificationSMS,

      visibiliteProfil: utilisateur.visibiliteProfil,
      partageDonnees: utilisateur.partageDonnees,

      permissions: utilisateur.permissions,
      panier: utilisateur.panier,
    });
  } catch (erreur) {
    return res.status(500).json({ message: "Database error" });
  }
});

// Route qui vide le panier de l'utilisateur connecté
router.delete("/deletePanier", authenticateToken, async (req, res) => {
  try {
    // Récupère l'identifiant de l'utilisateur connecté
    const idUtilisateur = req.user?._id;

    // Vérifie si l'utilisateur est connecté
    if (!idUtilisateur) {
      return res.status(401).json({ message: "Utilisateur not logged in" });
    }

    // Remplace les items du panier par un tableau vide
    const resultat = await getUtilisateurs().updateOne(
      { _id: idUtilisateur },
      { $set: { "panier.items": [] } },
    );

    // Vérifie si un utilisateur correspondant a été trouvé
    if (resultat.matchedCount === 0) {
      return res.status(404).json({ message: "Aucun utilisateur avec ce id" });
    }

    return res.status(200).json({ message: "Panier vidé" });
  } catch (erreur) {
    console.error(erreur);
    return res.status(500).json({ message: "Database error" });
  }
});

// Route qui retourne le panier de l'utilisateur connecté
router.get("/getPanier", authenticateToken, async (req, res) => {
  try {
    // Récupère l'identifiant de l'utilisateur connecté
    const idUtilisateur = req.user?._id;

    // Vérifie si l'utilisateur est connecté
    if (!idUtilisateur) {
      return res.status(401).json({ message: " Utilisateur not logged in" });
    }

    // Recherche l'utilisateur dans la base de données
    const utilisateur = await getUtilisateurs().findOne({
      _id: idUtilisateur,
    });

    // Retourne le panier si celui-ci existe
    if (utilisateur?.panier) {
      return res.status(200).json({ panier: utilisateur.panier });
    }

    return res.status(404).json({ message: "Panier introuvable" });
  } catch (erreur) {
    console.log(erreur);
    return res.status(500).json({ message: "Database error" });
  }
});

// Route qui modifie les informations du profil utilisateur
router.patch("/updateProfil", authenticateToken, async (req, res) => {
  try {
    // Récupère l'identifiant de l'utilisateur connecté
    const idUtilisateur = req.user?._id;

    // Récupère les nouvelles valeurs envoyées par le frontend
    const { nomUtilisateur, courriel, telephone } = req.body;

    // Vérifie si l'utilisateur est connecté
    if (!idUtilisateur) {
      return res.status(401).json({ message: "Utilisateur not logged in" });
    }

    // Met à jour le profil dans la base de données
    const resultat = await getUtilisateurs().updateOne(
      { _id: idUtilisateur },
      {
        $set: {
          nomUtilisateur,
          courriel,
          telephone,
        },
      },
    );

    // Vérifie si un utilisateur correspondant a été trouvé
    if (resultat.matchedCount === 0) {
      return res.status(404).json({ message: "Aucun utilisateur avec ce id" });
    }

    return res.status(200).json({
      message: "succès",
    });
  } catch (erreur) {
    console.error(erreur);
    return res.status(500).json({ message: "Database error" });
  }
});

// Route qui permet de modifier le mot de passe de l'utilisateur connecté
router.patch("/changePassword", authenticateToken, async (req, res) => {
  try {
    // Récupère l'identifiant de l'utilisateur connecté
    const idUtilisateur = req.user?._id;

    // Récupère le nouveau mot de passe envoyé par le frontend
    const { nouveauMotDePasse } = req.body;

    // Vérifie si l'utilisateur est connecté
    if (!idUtilisateur) {
      return res.status(401).json({ message: "Utilisateur not logged in" });
    }

    // Vérifie si un nouveau mot de passe a été fourni
    if (!nouveauMotDePasse) {
      return res.status(400).json({ message: "Nouveau mot de passe requis" });
    }

    // Hash le nouveau mot de passe avant de l'enregistrer
    const motDePasseHash = await bcrypt.hash(nouveauMotDePasse, 10);

    // Met à jour le mot de passe dans la base de données
    const resultat = await getUtilisateurs().updateOne(
      { _id: idUtilisateur },
      {
        $set: {
          motDePasse: motDePasseHash,
        },
      },
    );

    // Vérifie si un utilisateur correspondant a été trouvé
    if (resultat.matchedCount === 0) {
      return res.status(404).json({ message: "Aucun utilisateur avec ce id" });
    }

    return res.status(200).json({
      message: "Mot de passe modifié avec succès",
    });
  } catch (erreur) {
    console.error(erreur);
    return res.status(500).json({ message: "Database error" });
  }
});

// Route qui met à jour les paramètres de sécurité
router.patch("/updateSecurite", authenticateToken, async (req, res) => {
  try {
    // Récupère l'identifiant de l'utilisateur connecté
    const idUtilisateur = req.user?._id;

    // Récupère les nouveaux paramètres de sécurité
    const { twoFactorEnabled, cookiesAccepted } = req.body;

    // Vérifie si l'utilisateur est connecté
    if (!idUtilisateur) {
      return res.status(401).json({ message: "Utilisateur not logged in" });
    }

    // Met à jour les paramètres de sécurité dans la base de données
    const resultat = await getUtilisateurs().updateOne(
      { _id: idUtilisateur },
      {
        $set: {
          twoFactorEnabled,
          cookiesAccepted,
        },
      },
    );

    // Vérifie si un utilisateur correspondant a été trouvé
    if (resultat.matchedCount === 0) {
      return res.status(404).json({ message: "Aucun utilisateur avec ce id" });
    }

    return res.status(200).json({
      message: "Sécurité modifiée avec succès",
    });
  } catch (erreur) {
    console.error(erreur);
    return res.status(500).json({ message: "Database error" });
  }
});

// Route qui met à jour les paramètres utilisateur
router.patch("/updateSettings", authenticateToken, async (req, res) => {
  try {
    // Récupère l'identifiant de l'utilisateur connecté
    const idUtilisateur = req.user?._id;

    // Récupère les paramètres envoyés par le frontend
    const {
      notificationEmail,
      notificationSMS,
      visibiliteProfil,
      partageDonnees,
    } = req.body;

    // Vérifie si l'utilisateur est connecté
    if (!idUtilisateur) {
      return res.status(401).json({ message: "Utilisateur not logged in" });
    }

    // Met à jour les paramètres dans la base de données
    const resultat = await getUtilisateurs().updateOne(
      { _id: idUtilisateur },
      {
        $set: {
          notificationEmail,
          notificationSMS,
          visibiliteProfil,
          partageDonnees,
        },
      },
    );

    // Vérifie si un utilisateur correspondant a été trouvé
    if (resultat.matchedCount === 0) {
      return res.status(404).json({ message: "Aucun utilisateur avec ce id" });
    }

    return res.status(200).json({
      message: "Paramètres sauvegardés avec succès",
    });
  } catch (erreur) {
    console.error(erreur);
    return res.status(500).json({ message: "Database error" });
  }
});

export default router;