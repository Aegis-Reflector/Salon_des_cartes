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
const saltRounds = 10;

function verifierAdmin(req: any, res: any) {
  if (req.user?.courriel !== "admin1@pokemon.com") {
    res.status(403).json({ message: "Admin only" });
    return false;
  }

  return true;
}

router.post("/signIn", async (req, res) => {
  try {
    let { courriel, motDePasse } = req.body;

    const user = await getUtilisateurByCourriel(getUtilisateurs(), courriel);

    // Make sure the email exists
    if (user == null || user._id == null)
      return res.status(401).json({ message: "Email doesn't exist" });

    if (user.compteActive === false) {
      return res.status(403).json({ message: "Account disabled" });
    }

    // Make sure the password matches
    const match = await bcrypt.compare(motDePasse, user!.motDePasse);
    if (!match)
      return res.status(401).json({ message: "Password doesn't match" });

    // Create and save refresh token in a safe cookie
    const refreshToken = await createAndSaveRefreshToken(user._id);
    if (refreshToken == null) {
      return res.status(500).json({ message: "Failed to add refresh token" });
    }
    res.cookie("refresh", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      sameSite: "lax",
      secure: false,
    });

    return res.status(200).json({ message: "Connected" });
  } catch (error) {
    return res.status(500).json({ message: "Database error" });
  }
});

router.post("/signUp", async (req, res) => {
  try {
    const { courriel, motDePasse,nomUtilisateur, telephone  } = req.body;

    // Make sure the email is not already used
    const userExists = await getUtilisateurByCourriel(getUtilisateurs(), courriel);
    if (userExists != null) {
      return res.status(500).json({ message: "Email already used" });
    }

    // Create the user and hash the password
    const user: Utilisateur = {
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
      panier:{
        items:[],
      }
      
    };
    user.motDePasse = await bcrypt.hash(motDePasse, saltRounds);

    // Register the user in the BD
    const registerResult = await registerUtilisateur(getUtilisateurs(), user);
    if (!registerResult.acknowledged) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    // Create and save refresh token in a safe cookie
    const refreshToken = await createAndSaveRefreshToken(
      registerResult.insertedId,
    );
    if (refreshToken == null) {
      return res.status(500).json({ message: "Failed to add refresh token" });
    }
    res.cookie("refresh", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      sameSite: "lax",
      secure: false,
    });

    return res.status(201).json({ message: "Registered" });
  } catch (error) {
    return res.status(500).json({ message: "Database error" });
  }
});

router.post("/logout", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Clear the token from the DB
    await updateUtilisateurToken(getUtilisateurs(), userId);

    // Clear the cookie from the browser
    res.clearCookie("refresh", {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      sameSite: "lax",
      secure: false,
    });

    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

router.get("/users", authenticateToken, async (req, res) => {
  try {
    if (!verifierAdmin(req, res)) return;

    const users = await getAllUtilisateurs(getUtilisateurs());
    return res.status(200).json(
      users.map((user) => ({
        _id: user._id,
        courriel: user.courriel,
        nomUtilisateur: user.nomUtilisateur,
        telephone: user.telephone,
        statutCompte: user.statutCompte,
        compteActive: user.compteActive,
      })),
    );
  } catch {
    return res.status(500).json({ message: "Database error" });
  }
});

router.patch("/users/:id", authenticateToken, async (req, res) => {
  try {
    if (!verifierAdmin(req, res)) return;

    const id = String(req.params.id);
    const compteActive = Boolean(req.body.compteActive);
    const statutCompte = compteActive ? "Actif" : "Inactif";

    await updateUtilisateurCompte(
      getUtilisateurs(),
      id,
      compteActive,
      statutCompte,
    );

    return res.status(200).json({ message: "Utilisateur modifié" });
  } catch {
    return res.status(500).json({ message: "Database error" });
  }
});

router.delete("/users/:id", authenticateToken, async (req, res) => {
  try {
    if (!verifierAdmin(req, res)) return;

    await deleteUtilisateur(getUtilisateurs(), String(req.params.id));
    return res.status(200).json({ message: "Utilisateur supprimé" });
  } catch {
    return res.status(500).json({ message: "Database error" });
  }
});

export default router;
