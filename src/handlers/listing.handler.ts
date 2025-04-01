import { Request, Response } from "express";
import { transaction } from "objection";
import { IntentStatus, ListingStatus } from "../common/enums";
import { ListingIntent, Listing } from "../db/models/listings";

export const createListingIntent = async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = res.locals.user.id; // From auth middleware
      const { 
        artist_id, 
        start_date, 
        end_date, 
        bid, 
        currency, 
        capacity, 
        location, 
        notes, 
        event_type 
      } = req.body;
      
      const listingIntent = await ListingIntent.query().insert({
        artist_id,
        lister_id: userId,
        start_date,
        end_date,
        bid,
        currency,
        capacity,
        location,
        status: IntentStatus.PENDING,
        notes,
        event_type
      });
      
      res.status(201).json({ message: "Listing intent created successfully", data: listingIntent });
    } catch (error) {
      console.error('Error creating listing intent:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const getListingIntentById = async (req: Request, res: Response): Promise<any> => {
    try {
      const id = req.params.id;
      const listingIntent = await ListingIntent.query()
        .findById(id)
        .withGraphFetched('[artist, lister, eventType]');
      
      if (!listingIntent) {
        return res.status(404).json({ message: "Listing intent not found" });
      }
      
      res.json({ message: "success", data: listingIntent });
    } catch (error) {
      console.error('Error fetching listing intent:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const respondToListingIntent = async (req: Request, res: Response): Promise<any> => {
    try {
      const id = req.params.id;
      const userId = res.locals.user.id; 
      const { status, counter_bid } = req.body;
      
      // Get the listing intent and verify permissions
      const listingIntent = await ListingIntent.query()
        .findById(id)
        .withGraphFetched('artist.[user]');
      
      if (!listingIntent) {
        return res.status(404).json({ message: "Listing intent not found" });
      }
      
      // Check if the user is the artist (or associated with the artist)
      const artistUserId = listingIntent.artist?.user_id;
      if (artistUserId !== userId) {
        return res.status(403).json({ message: "Not authorized to respond to this listing intent" });
      }
      
      // Update the listing intent based on response
      const updateData: any = { status };
      if (status === IntentStatus.COUNTERED && counter_bid) {
        updateData.counter_bid = counter_bid;
      }
      
      const updatedIntent = await ListingIntent.query().patchAndFetchById(id, updateData);
      
      res.json({ message: "Response recorded successfully", data: updatedIntent });
    } catch (error) {
      console.error('Error responding to listing intent:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  // ============ LISTING HANDLERS ============
  
  export const createListingFromIntent = async (req: Request, res: Response): Promise<any> => {
    try {
      const intentId = req.params.intentId;
      const userId = res.locals.user.id; // From auth middleware
      
      // Start a transaction
      const result = await transaction(ListingIntent.knex(), async (trx) => {
        // Get the listing intent
        const listingIntent = await ListingIntent.query(trx)
          .findById(intentId)
          .withGraphFetched('artist');
        
        if (!listingIntent) {
          throw new Error("Listing intent not found");
        }
        
        // Verify the user is the lister
        if (listingIntent.lister_id !== userId) {
          throw new Error("Not authorized to create listing from this intent");
        }
        
        // Check if the intent is accepted
        if (listingIntent.status !== IntentStatus.ACCEPTED) {
          throw new Error("Cannot create listing from non-accepted intent");
        }
        
        // Create the listing
        const listing = await Listing.query(trx).insert({
          artist_id: listingIntent.artist_id,
          lister_id: listingIntent.lister_id,
          start_date: listingIntent.start_date,
          end_date: listingIntent.end_date,
          status: ListingStatus.PENDING,
          capacity: listingIntent.capacity,
          listing_intent_id: listingIntent.id
        });
        
        return { listingIntent, listing };
      });
      
      res.status(201).json({ 
        message: "Listing created successfully from intent", 
        data: result.listing 
      });
    } catch (error: any) {
      console.error('Error creating listing from intent:', error);
      
      if (error.message.includes("Not authorized") || 
          error.message.includes("Cannot create") ||
          error.message.includes("not found")) {
        return res.status(400).json({ message: error.message });
      }
      
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const getListingById = async (req: Request, res: Response): Promise<any> => {
    try {
      const id = req.params.id;
      const listing = await Listing.query()
        .findById(id)
        .withGraphFetched('[artist, lister, listingIntent.[eventType]]');
      
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      res.json({ message: "success", data: listing });
    } catch (error) {
      console.error('Error fetching listing:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const updateListingStatus = async (req: Request, res: Response): Promise<any> => {
    try {
      const id = req.params.id;
      const userId = res.locals.user.id; // From auth middleware
      const { status } = req.body;
      
      // Get the listing and verify permissions
      const listing = await Listing.query().findById(id);
      
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      // Check if the user is authorized (either the artist or the lister)
      if (listing.artist_id !== userId && listing.lister_id !== userId) {
        return res.status(403).json({ message: "Not authorized to update this listing" });
      }
      
      // Update the listing status
      const updatedListing = await Listing.query().patchAndFetchById(id, { status });
      
      res.json({ message: "Listing status updated successfully", data: updatedListing });
    } catch (error) {
      console.error('Error updating listing status:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  };