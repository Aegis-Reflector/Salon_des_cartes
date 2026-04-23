import bcrypt from "bcrypt";
import { Router } from "express";
import {
  getUtilisateurByCourriel,
  registerUtilisateur,
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

router.post("/signIn", async (req, res) => {
  try {
    let { email, password, remember } = req.body;

    const user = await getUtilisateurByCourriel(getUtilisateurs(), email);

    // Make sure the email exists
    if (user == null || user._id == null)
      return res.status(401).json({ message: "Email doesn't exist" });

    // Make sure the password matches
    const match = await bcrypt.compare(password, user!.motDePasse);
    if (!match)
      return res.status(401).json({ message: "Password doesn't match" });

    // Create and save refresh token in a safe cookie
    const refreshToken = await createAndSaveRefreshToken(user._id);
    if (refreshToken == null) {
      res.status(500).json({ message: "Failed to add refresh token" });
    }
    res.cookie("refresh", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      sameSite: "lax",
      secure: false,
    });

    return res.status(201).json({ message: "Connected" });
  } catch (error) {
    return res.status(500).json({ message: "Database error" });
  }
});

router.post("/signUp", async (req, res) => {
  try {
    const { email, password, passwordConfirm } = req.body;

    // Make sure the received passwords are the same
    if (password != passwordConfirm) {
      return res.status(500).json({ message: "Passwords don t match" });
    }

    // Make sure the email is not already used
    const userExists = await getUtilisateurByCourriel(getUtilisateurs(), email);
    if (userExists != null) {
      return res.status(500).json({ message: "Email already used" });
    }

    // Create the user and hash the password
    const user: Utilisateur = {
      courriel: email,
      motDePasse: password,
      token: "",
    };
    user.motDePasse = await bcrypt.hash(password, saltRounds);

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
      res.status(500).json({ message: "Failed to add refresh token" });
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

export default router;
