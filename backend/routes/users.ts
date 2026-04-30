import express, { Response } from "express";
import { prisma } from "../prismaClient";
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Get all users (useful for assigning tasks or projects)
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
