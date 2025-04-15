import express from "express";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import {v2 as cloudinary} from "cloudinary"
import path from "path";

dotenv.config(); // Load environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const app = express();
const PORT = process.env.PORT || 5000;
const __dirname =path.resolve();

app.use(express.json({limit:"5mb"}));
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded data

app.use(cookieParser()); // Middleware for parsing cookies
app.use("/api/auth", authRoutes)
app.use("/api/post", postRoutes)
app.use("/api/users", userRoutes)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}


app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});