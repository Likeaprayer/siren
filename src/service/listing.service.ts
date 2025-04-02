import Objection from "objection";
import { IntentStatus, ListingStatus } from "../common/enums";
import { ListingIntent, Listing } from "../db/models/listings";

export async function createListing(intentId: string, userId: string, trx: Objection.Transaction) {
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
}