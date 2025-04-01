import { Validator } from "../common/validator";
import * as AuthHandler from "../handlers/auth.handler"

import express from "express";
const router = express.Router();

router.post("/signup", Validator.createUser(), AuthHandler.signup);
router.post("/login", Validator.login(), AuthHandler.login);

export default router;