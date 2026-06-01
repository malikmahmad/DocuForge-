const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("OK - Minimal server working");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[OK] Listening on port ${PORT}`);
});
