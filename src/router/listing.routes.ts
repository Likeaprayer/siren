import { Validator } from "../common/validator";
import * as ListingHandler from "../handlers/listing.handler";
import express from "express";


const router = express.Router();

router.post("/", Validator.createListingIntent(), ListingHandler.createListingIntent);
router.get("/:id", Validator.getListingIntentById(), ListingHandler.getListingIntentById);
router.patch("/:id/respond", Validator.respondToListingIntent(), ListingHandler.respondToListingIntent);
router.post("/intent/:intentId", Validator.createListingFromIntent(), ListingHandler.createListingFromIntent);
router.get("/:id", Validator.getListingById(), ListingHandler.getListingById);
router.patch("/:id/status", Validator.updateListingStatus(), ListingHandler.updateListingStatus);

export default router;