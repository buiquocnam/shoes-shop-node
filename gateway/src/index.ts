import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { authGuard } from "./middlewares/authGuard";

const app = express();

app.get("/api/v1/health", (req, res) => res.json({ status: "gateway ok" }));

app.use("/api/v1", authGuard);

// Proxy routes to microservices
app.use(
  "/api/v1/auth",
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
    pathRewrite: { "^/api/v1/auth": "" },
  })
);

app.listen(4000, () => {
  console.log("Gateway listening on http://localhost:4000");
});
