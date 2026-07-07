import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import postRoutes from "./src/routes/postRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
dotenv.config();
await connectDB();

const app = express();

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Blog API is running",
  });
});

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/categories", categoryRoutes);
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
