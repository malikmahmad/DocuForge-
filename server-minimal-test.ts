import express from "express";

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok",
    message: "Minimal test server running",
    port: PORT,
    env: process.env.NODE_ENV,
    time: new Date().toISOString()
  });
});

app.get("/", (req, res) => {
  res.send("<h1>🎉 Minimal Test Server Working!</h1><p>PORT=" + PORT + "</p>");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Minimal server started on port ${PORT}`);
});
