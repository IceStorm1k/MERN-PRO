import { body } from "express-validator";

export const loginValidation = [
    body("email", "Invalid email").isEmail(),
    body("password" , "Password must be at least 5 characters").isLength({ min: 5 }),
];

export const registerValidation = [
    body("email", "Invalid email").isEmail(),
    body("password" , "Password must be at least 5 characters").isLength({ min: 5 }),
    body("fullName" , "Name must be at least 3 characters").isLength({ min: 3 }),
    body("avatarUrl" , "Invalid avatar url").optional().isURL()
];

export const postCreateValidation = [
    body("title", "Enter title").isLength({ min: 3 }).isString(),
    body("text" , "Enter text").isLength({ min: 10 }).isString(),
    body("tags" , "Incorrect format of tags (specify an array)").optional(),
    body("imageUrl" , "Invalid image url").optional().isString()
];