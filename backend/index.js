import express from "express";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import {v2 as cloudinary} from "cloudinary"

dotenv.config(); // Load environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({limit:"5mb"}));
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded data

app.use(cookieParser()); // Middleware for parsing cookies
app.use("/api/auth", authRoutes)
app.use("/api/post", postRoutes)
app.use("/api/users", userRoutes)




app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});