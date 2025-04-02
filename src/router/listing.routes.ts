import { Validator } from "../common/validator";
import * as ListingHandler from "../handlers/listing.handler";
import express from "express";


const router = express.Router();

router.post("/intents/", Validator.createListingIntent(), ListingHandler.createListingIntent);
router.get("/intents/:id", Validator.getListingIntentById(), ListingHandler.getListingIntentById);
router.patch("/intents/:id/respond", Validator.respondToListingIntent(), ListingHandler.respondToListingIntent);
router.post("/create/:intentId", Validator.createListingFromIntent(), ListingHandler.createListingFromIntent);
router.get("/:id", Validator.getListingById(), ListingHandler.getListingById);
router.patch("/:id/status", Validator.updateListingStatus(), ListingHandler.updateListingStatus);

export default router;