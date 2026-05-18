import bcrypt from "bcrypt";
import { Router } from "express";
import {
  deleteUtilisateur,
  getAllUtilisateurs,
  getUtilisateurByCourriel,
  registerUtilisateur,
  updateUtilisateurCompte,
  updateUtilisateurToken,
} from "../Controller/utilisateurController.js";
import { getUtilisateurs } from "../db/mongo.js";
import {
  authenticateToken,
  createAndSaveRefreshToken,
} from "../middleware/jwtToken.js";
import { Utilisateur } from "../models/utilisateur.js";

const router = Router();
const nombreToursSel = 10;

// Fonction qui vérifie si l'utilisateur connecté est administrateur
function verifierAdmin(req: any, res: any) {
  if (req.user?.courriel !== "admin1@pokemon.com") {
    res.status(403).json({ message: "Admin only" });
    return false;
  }

  return true;
}

// Route de connexion
router.post("/signIn", async (req, res) => {
  try {
    // Récupère le courriel et le mot de passe envoyés par le frontend
    const { courriel, motDePasse } = req.body;

    // Recherche l'utilisateur avec son courriel
    const utilisateur = await getUtilisateurByCourriel(
      getUtilisateurs(),
      courriel,
    );

    // Vérifie si l'utilisateur existe
    if (utilisateur == null || utilisateur._id == null) {
      return res.status(401).json({ message: "Email doesn't exist" });
    }

    // Bloque la connexion si le compte est désactivé
    if (utilisateur.compteActive === false) {
      return res.status(403).json({ message: "Account disabled" });
    }

    // Compare le mot de passe entré avec le mot de passe haché dans la base de données
    const motDePasseCorrespond = await bcrypt.compare(
      motDePasse,
      utilisateur.motDePasse,
    );

    // Refuse la connexion si le mot de passe est incorrect
    if (!motDePasseCorrespond) {
      return res.status(401).json({ message: "Password doesn't match" });
    }

    // Crée un refresh token et l'enregistre dans la base de données
    const refreshToken = await createAndSaveRefreshToken(utilisateur._id);

    // Vérifie si la création du token a échoué
    if (refreshToken == null) {
      return res.status(500).json({ message: "Failed to add refresh token" });
    }

    // Enregistre le token dans un cookie sécurisé côté navigateur
    res.cookie("refresh", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    });

    return res.status(200).json({ message: "Connected" });
  } catch (erreur) {
    return res.status(500).json({ message: "Database error" });
  }
});

// Route d'inscription
router.post("/signUp", async (req, res) => {
  try {
    // Récupère les informations envoyées par le formulaire d'inscription
    const { courriel, motDePasse, nomUtilisateur, telephone } = req.body;

    // Vérifie si le courriel est déjà utilisé
    const utilisateurExiste = await getUtilisateurByCourriel(
      getUtilisateurs(),
      courriel,
    );

    if (utilisateurExiste != null) {
      return res.status(500).json({ message: "Email already used" });
    }

    // Crée un nouvel utilisateur avec les valeurs par défaut
    const utilisateur: Utilisateur = {
      courriel,
      motDePasse,

      nomUtilisateur: nomUtilisateur || "",
      telephone: telephone || "",

      statutCompte: "Actif",

      compteActive: true,
      cookiesAccepted: false,

      notificationEmail: false,
      notificationSMS: false,

      visibiliteProfil: false,
      partageDonnees: false,

      token: "",

      panier: {
        items: [],
      },
    };

    // Hache le mot de passe avant de l'enregistrer
    utilisateur.motDePasse = await bcrypt.hash(motDePasse, nombreToursSel);

    // Enregistre l'utilisateur dans la base de données
    const resultatInscription = await registerUtilisateur(
      getUtilisateurs(),
      utilisateur,
    );

    // Vérifie si l'enregistrement a échoué
    if (!resultatInscription.acknowledged) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    // Crée un refresh token pour connecter l'utilisateur après l'inscription
    const refreshToken = await createAndSaveRefreshToken(
      resultatInscription.insertedId,
    );

    // Vérifie si la création du token a échoué
    if (refreshToken == null) {
      return res.status(500).json({ message: "Failed to add refresh token" });
    }

    // Enregistre le token dans un cookie
    res.cookie("refresh", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    });

    return res.status(201).json({ message: "Registered" });
  } catch (erreur) {
    return res.status(500).json({ message: "Database error" });
  }
});

// Route de déconnexion
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    // Récupère l'identifiant de l'utilisateur connecté
    const idUtilisateur = req.user?._id;

    // Vérifie si l'utilisateur est authentifié
    if (!idUtilisateur) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Supprime le token enregistré dans la base de données
    await updateUtilisateurToken(getUtilisateurs(), idUtilisateur);

    // Supprime le cookie du navigateur
    res.clearCookie("refresh", {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    });

    return res.status(200).json({ message: "Logged out" });
  } catch (erreur) {
    console.error("Logout Error:", erreur);
    return res.status(500).json({ message: "Database error" });
  }
});

// Route admin qui retourne la liste de tous les utilisateurs
router.get("/users", authenticateToken, async (req, res) => {
  try {
    // Vérifie si l'utilisateur connecté est administrateur
    if (!verifierAdmin(req, res)) return;

    // Récupère tous les utilisateurs de la base de données
    const utilisateurs = await getAllUtilisateurs(getUtilisateurs());

    // Retourne seulement les champs nécessaires au frontend admin
    return res.status(200).json(
      utilisateurs.map((utilisateur) => ({
        _id: utilisateur._id,
        courriel: utilisateur.courriel,
        nomUtilisateur: utilisateur.nomUtilisateur,
        telephone: utilisateur.telephone,
        statutCompte: utilisateur.statutCompte,
        compteActive: utilisateur.compteActive,
      })),
    );
  } catch (erreur) {
    return res.status(500).json({ message: "Database error" });
  }
});

// Route admin qui active ou désactive un compte utilisateur
router.patch("/users/:id", authenticateToken, async (req, res) => {
  try {
    // Vérifie si l'utilisateur connecté est administrateur
    if (!verifierAdmin(req, res)) return;

    // Récupère l'identifiant de l'utilisateur à modifier
    const idUtilisateur = String(req.params.id);

    // Convertit la valeur reçue en booléen
    const compteActive = Boolean(req.body.compteActive);

    // Définit le statut du compte selon sa valeur active/inactive
    const statutCompte = compteActive ? "Actif" : "Inactif";

    // Met à jour le compte dans la base de données
    await updateUtilisateurCompte(
      getUtilisateurs(),
      idUtilisateur,
      compteActive,
      statutCompte,
    );

    return res.status(200).json({ message: "Utilisateur modifié" });
  } catch (erreur) {
    return res.status(500).json({ message: "Database error" });
  }
});

// Route admin qui supprime un utilisateur
router.delete("/users/:id", authenticateToken, async (req, res) => {
  try {
    // Vérifie si l'utilisateur connecté est administrateur
    if (!verifierAdmin(req, res)) return;

    // Supprime l'utilisateur ciblé avec son identifiant
    await deleteUtilisateur(getUtilisateurs(), String(req.params.id));

    return res.status(200).json({ message: "Utilisateur supprimé" });
  } catch (erreur) {
    return res.status(500).json({ message: "Database error" });
  }
});

export default router;