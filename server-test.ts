import express from "express";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Single test route
app.get("/test", (req, res) => {
  res.json({ status: "ok", port: PORT, cwd: process.cwd() });
});

// Start server
const server = app.listen(PORT, "0.0.0.0", () => {
  console.error(`[MINIMAL] Server listening on port ${PORT}`);
  console.log(`🚀 Server running on port ${PORT}`);
});

server.on("error", (err) => {
  console.error("[MINIMAL] Server error:", err);
  process.exit(1);
});
