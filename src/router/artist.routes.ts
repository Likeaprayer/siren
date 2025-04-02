import { Validator } from "../common/validator";
import * as ArtistHandler from "../handlers/artist.handler";
import express from "express";

const router = express.Router();

router.get("/:id", Validator.getArtistById(), ArtistHandler.getArtistById);
router.post("/profile", Validator.createArtistProfile(), ArtistHandler.createArtistProfile);
router.put("/",  Validator.updateArtistProfile(), ArtistHandler.updateArtistProfile);
router.get("/search", Validator.searchArtists(), ArtistHandler.searchArtists);

export default router;