import express, { Response } from "express";
import { prisma } from "../prismaClient";
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Get all projects the user is part of
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    let projects;
    if (role === "Admin") {
      projects = await prisma.project.findMany({
        include: { members: { select: { id: true, name: true, email: true } } }
      });
    } else {
      projects = await prisma.project.findMany({
        where: {
          members: { some: { id: userId } }
        },
        include: { members: { select: { id: true, name: true, email: true } } }
      });
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new project (Admins only)
router.post("/", authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, memberIds } = req.body;
    const userId = req.user!.id;

    // Connect creator and explicit members
    const members = memberIds ? [...new Set([...memberIds, userId])].map(id => ({ id: id as string })) : [{ id: userId }];

    const project = await prisma.project.create({
      data: {
        name,
        description,
        createdById: userId,
        members: {
          connect: members
        }
      },
      include: { members: { select: { id: true, name: true, email: true } } }
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get project details
router.get("/:id", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projectId = req.params.id as string;
    const userId = req.user!.id;
    const role = req.user!.role;

    const project: any = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: { select: { id: true, name: true, email: true } },
        tasks: {
          include: {
            assignedTo: { select: { id: true, name: true } }
          }
        }
      }
    });

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    // Check access
    const isMember = project.members.some((m: any) => m.id === userId);
    if (role !== "Admin" && !isMember) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
