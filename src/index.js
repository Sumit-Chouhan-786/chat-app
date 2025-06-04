import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// CORS settings for your frontend domain
app.use(
  cors({
    origin: "https://chat-app-vjqf.onrender.com",
    credentials: true,
  })
);

// Helmet CSP settings
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: [
        "'self'",
        "https://chat-app-vjqf.onrender.com",
        "wss://chat-app-vjqf.onrender.com",
      ],
      imgSrc: ["'self'", "data:"],
      workerSrc: ["'self'", "blob:"],
      objectSrc: ["'none'"],
    },
  })
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start server
server.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
  connectDB();
});
