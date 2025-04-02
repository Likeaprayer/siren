import express from "express";
import authRouter from "./auth.routes"
import userRouter from "./user.routes"
import userRoutes from "./user.routes";
import artistRoutes from "./artist.routes";

import listingRoutes from "./listing.routes";
import paymentRoutes from "./payment.routes";

const router = express.Router();

// API routes
router.use("/users", userRoutes);
router.use("/artists", artistRoutes);
router.use("/listing", listingRoutes);
router.use("/payments", paymentRoutes);
router.use('/auth', authRouter)
router.use('/users', userRouter)

export default router