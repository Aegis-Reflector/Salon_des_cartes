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


export default router;
