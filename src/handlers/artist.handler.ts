import { Request, Response } from "express";
import { Artist } from "../db/models/artists";


export const getArtistById = async (req: Request, res: Response): Promise<any> => {
    try {
      const id = req.params.id;
      const artist = await Artist.query()
        .findById(id)
        .withGraphFetched('user');
      
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }
      
      res.json({ message: "success", data: artist });
    } catch (error) {
      console.error('Error fetching artist:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const createArtistProfile = async (req: Request, res: Response): Promise<any> => {
    try {
      // console.log("user_id", req?.user)
      const userId = req.user.id; 
      
      const { stagename, gender, contact_email, contact_phone, location } = req.body;
      
      // Check if artist profile already exists for this user
      const existingArtist = await Artist.query().where('user_id', userId).first();
      if (existingArtist) {
        return res.status(400).json({ message: "Artist profile already exists for this user" });
      }
      
      const artist = await Artist.query().insert({
        user_id: userId,
        stagename,
        gender,
        contact_email,
        contact_phone,
        location
      });
      
      res.status(201).json({ message: "Artist profile created successfully", data: artist });
    } catch (error) {
      console.error('Error creating artist profile:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const updateArtistProfile = async (req: Request, res: Response): Promise<any> => {
    try {

      const id = req.user.id; 
      const { stagename, gender, contact_email, contact_phone, location } = req.body;
      
      // Ensure artist belongs to the authenticated user
      const artist = await Artist.query().findById(id);
      if (!artist) {
        return res.status(404).json({ message: "Artist profile not found" });
      }
      
      const updatedArtist = await Artist.query().patchAndFetchById(id, {
        stagename,
        gender,
        contact_email,
        contact_phone,
        location
      });
      
      res.status(200).json({ message: "Artist profile updated successfully", data: updatedArtist });
    } catch (error) {
      console.error('Error updating artist profile:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const searchArtists = async (req: Request, res: Response): Promise<any> => {
    try {
      const { stagename, gender } = req.query;
      
      let query = Artist.query().withGraphFetched('user');
      
      if (stagename) {
        query = query.where('stagename', 'ilike', `%${stagename}%`);
      }
      
      if (gender) {
        query = query.where('gender', gender as string);
      }
      
      const artists = await query;
      
      res.json({ message: "success", data: artists });
    } catch (error) {
      console.error('Error searching artists:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  };