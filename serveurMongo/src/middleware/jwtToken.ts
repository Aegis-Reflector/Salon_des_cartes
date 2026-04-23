import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
 import { getUtilisateurById, updateUtilisateurToken } from "../Controller/utilisateurController.js";
 import { getUtilisateurs } from "../db/mongo.js";
 import { MyTokenPayload } from "../interfaces/interfaces.js";

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const refreshToken = req.cookies.refresh;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as MyTokenPayload;

    const user = await getUtilisateurById(getUtilisateurs(), decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

export async function createAndSaveRefreshToken(userId: ObjectId) {
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" },
  );
  const updateResult = await updateUtilisateurToken(getUtilisateurs(), userId, refreshToken);
  if (!updateResult.acknowledged) {
    return null;
  }

  return refreshToken;
}
