import { Validator } from "../common/validator";
import * as PaymentHandler from "../handlers/payment.handler";
import express from "express";


const router = express.Router();

router.post("/intent",  Validator.createPaymentIntent(), PaymentHandler.createPaymentIntent);
router.post("/process/:id",  Validator.processPayment(), PaymentHandler.processPayment);
router.get("/:id",  Validator.getPaymentDetails(), PaymentHandler.getPaymentDetails);

export default router;