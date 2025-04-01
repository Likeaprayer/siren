import { Validator } from "../common/validator";
import * as UserHandler from "../handlers/user.handler";

import express from "express";
const router = express.Router();

router.get("/", UserHandler.getAllUsers);
router.get("/:id",Validator.getUserById(),  UserHandler.getUserById);
router.post("/",  Validator.createUser(), UserHandler.createUser);
router.put("/:id", Validator.updateUserById(), UserHandler.updateUser);
router.delete("/:id",Validator.updateUserById(), UserHandler.deleteUser);

export default router;

