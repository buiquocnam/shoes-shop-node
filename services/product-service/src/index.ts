import express from "express";
import brandRoutes from "./routes";
import { connectDB } from "./models";
import redis from "./config/redis";

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Health check
app.get("/health", (req, res) => res.json({ status: "product service ok" }));

// Auth routes - gateway will rewrite /auth to "", so routes should be at root
app.use("/", brandRoutes);

// Error handler middleware (must be last)
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);

    // Handle http-errors (has status or statusCode property)
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal server error";

    res.status(status).json({
      error: err.name || "Error",
      message: message,
    });
  }
);

// Connect to MongoDB
connectDB();

// Redis is already connected via import (singleton pattern)

app.listen(3004, () => {
  console.log("Auth service listening on http://localhost:3004");
});

// Thêm 2 dòng này vào cuối file
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Container will NOT crash:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION! Container will NOT crash:', reason);
});
