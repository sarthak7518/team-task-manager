import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

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

// Frontend static files
// After build, frontend is copied to backend/dist/public
// __dirname at runtime = /app/backend/dist/src  OR  /app/backend/dist
// So we check both
const searchPaths = [
  path.join(__dirname, "public"),           // if __dirname = backend/dist
  path.join(__dirname, "../public"),        // if __dirname = backend/dist/src
];

const frontendPath = searchPaths.find(p => fs.existsSync(path.join(p, "index.html")));

if (!frontendPath) {
  console.error("❌ Could not find frontend build. Searched:");
  searchPaths.forEach(p => console.error("  -", p));
} else {
  console.log("✅ Serving frontend from:", frontendPath);
  app.use(express.static(frontendPath));

  // SPA catch-all: serve index.html for any non-API route
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});