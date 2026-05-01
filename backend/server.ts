import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

// Routers
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import taskRoutes from "./routes/tasks";
import userRoutes from "./routes/users";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.NODE_ENV === "production" ? false : "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Find frontend files - check multiple possible paths
import fs from "fs";
const searchPaths = [
  path.join(__dirname, "public"),
  path.join(__dirname, "../public"),
  path.join(__dirname, "../../frontend/dist"),
  path.join(__dirname, "../frontend/dist"),
  path.join(process.cwd(), "public"),
  path.join(process.cwd(), "dist/public"),
  path.join(process.cwd(), "frontend/dist"),
  path.join(process.cwd(), "../frontend/dist"),
];
const frontendPath = searchPaths.find(p => fs.existsSync(path.join(p, "index.html"))) || searchPaths[0];
console.log("__dirname:", __dirname);
console.log("cwd:", process.cwd());
console.log("Serving frontend from:", frontendPath);
console.log("index.html exists:", fs.existsSync(path.join(frontendPath, "index.html")));
app.use(express.static(frontendPath));

// SPA catch-all: serve index.html for any non-API route
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
