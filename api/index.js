// Use 'import' syntax consistently
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

// Local imports
import connectWithDB from "./config/db.js"; // Add .js for local files
import mainRoutes from "./routes/index.js"; // Assuming your main route file is index.js
import adminRoutes from './routes/adminRoutes.js';

// --- SETUP ---

// Load environment variables from .env file
dotenv.config();

// Initialize the express app (ONLY ONCE)
const app = express();

// --- DATABASE & CLOUDINARY CONNECTION ---

// Connect with database
connectWithDB();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- MIDDLEWARE ---

// For handling cookies
app.use(cookieParser());

// Initialize cookie-session middleware
app.use(
  cookieSession({
    name: "session",
    maxAge: process.env.COOKIE_TIME * 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production', // Best practice
    sameSite: "none",
    httpOnly: true,
  })
);

// Middleware to handle JSON (ONLY ONCE)
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// --- ROUTES ---

// Use express router for API routes
app.use("/", mainRoutes);
app.use('/api/admin', adminRoutes);

// --- START SERVER ---

const PORT = process.env.PORT || 8000;
app.listen(PORT, (err) => {
  if (err) {
    console.log("Error in connecting to server: ", err);
  }
  console.log(`Server is running on port no. ${PORT}`);
});

export default app; // Use export with ES Modules