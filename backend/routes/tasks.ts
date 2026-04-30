import express, { Response } from "express";
import { prisma } from "../prismaClient";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Get all tasks assigned to me or all tasks (if admin) across all projects
// OR tasks by project. Let's do project tasks inside project, and user tasks here.
router.get("/my-tasks", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const tasks = await prisma.task.findMany({
      where: { assignedToId: userId },
      include: { project: { select: { name: true } } }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create task in a project
router.post("/project/:projectId", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projectId = req.params.projectId as string;
    const { title, description, status, dueDate, assignedToId } = req.body;
    const userId = req.user!.id;
    const role = req.user!.role;

    const project: any = await prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true }
    });

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    const isMember = project.members.some((m: any) => m.id === userId);
    if (role !== "Admin" && !isMember) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || "TODO",
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assignedToId: assignedToId || null,
      },
      include: { assignedTo: { select: { id: true, name: true } } }
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update task status
router.put("/:taskId", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const taskId = req.params.taskId as string;
    const { status, assignedToId } = req.body;
    const userId = req.user!.id;
    const role = req.user!.role;

    const task: any = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: { include: { members: true } } }
    });

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const isMember = task.project.members.some((m: any) => m.id === userId);
    if (role !== "Admin" && !isMember) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(status && { status }),
        ...(assignedToId !== undefined && { assignedToId })
      },
      include: { assignedTo: { select: { id: true, name: true } } }
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
