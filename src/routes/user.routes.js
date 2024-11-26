import userController from "../controllers/user.controller";

const { Router } = require("express");

const userRoutes = Router();

userRoutes.get("/users", userController.getAllUsers);
userRoutes.post("/user", userController.add);
userRoutes.put("/user", userController.updateUser);
userRoutes.delete("/user/:id", userController.deleteUser);
userRoutes.get("/user/:id", userController.findUser);
userRoutes.put("/user/updatePassword", userController.changePassword);

export { userRoutes };
