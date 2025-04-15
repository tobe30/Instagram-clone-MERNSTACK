import express from "express";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { fileURLToPath } from 'url';

// ESM way to resolve __dirname in a module-based environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // Load environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded data

app.use(cookieParser()); // Middleware for parsing cookies

// Mount routes
console.log("Mounting auth routes...");
app.use("/api/auth", authRoutes);

console.log("Mounting post routes...");
app.use("/api/post", postRoutes);

console.log("Mounting user routes...");
app.use("/api/users", userRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    connectMongoDB();
});
