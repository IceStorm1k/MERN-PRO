import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { registerValidation , loginValidation, postCreateValidation } from "./validations.js";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import * as CommentController from "./controllers/CommentController.js";

import handleValidationErrors from "./utils/handleValidationErrors.js";
import checkAuth from "./utils/checkAuth.js";


mongoose.connect(process.env.MONGODB_URI, {autoIndex: true}).then(() => console.log("db ok")).catch((err) => console.log('db error', err));

const app = express();

const router = express.Router();

const storage = multer.diskStorage({
    destination: ( _, __, cb) => {
        cb(null, "uploads");
    },
    filename: ( _, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));


router.post("/upload", upload.single("image"), (req, res) => {
    try {
      console.log("File uploaded:", req.file);
      res.json({
        url: `/uploads/${req.file.originalname}`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Ошибка загрузки файла" });
    }
  });


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/login", loginValidation , handleValidationErrors, UserController.login);
app.post("/register", registerValidation , handleValidationErrors, UserController.register);
app.get("/me", checkAuth, UserController.getMe);

app.post("/uploads", checkAuth , upload.single("image"), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get("/tags", PostController.getLastTags);

app.get("/posts", PostController.getAll);
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth , postCreateValidation , handleValidationErrors, PostController.create);
app.delete("/posts/:id", checkAuth , PostController.remove);
app.patch("/posts/:id", checkAuth , postCreateValidation , handleValidationErrors, PostController.update);
app.post("/comments", checkAuth, CommentController.create);
app.get("/comments/:id", CommentController.getPostComments);
const PORT = process.env.PORT;

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log(`Server is running on: http://localhost:${PORT}`);
})