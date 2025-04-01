import { Model, RelationMappings, RelationMappingsThunk } from "objection";
import mixins from ".";
import { User } from "./user";
import { IntentStatus, ListingStatus } from "../../common/enums";
import { Artist } from "./artists";
import { PaymentIntent } from "./payments";

class EventType extends mixins(Model) {
    static tableName: string = 'event_type';
  
    public readonly id: string;
    public name: string;
    public description: string;
    public desigination: string;
    public created_at: Date | string;
    public updated_at: Date | string;
  
    // Relation mappings
    static relationMappings: RelationMappings | RelationMappingsThunk = () => ({
      listingIntents: {
        relation: Model.HasManyRelation,
        modelClass: ListingIntent,
        join: {
          from: 'event_type.id',
          to: 'listing_intent.event_type'
        }
      }
    });
  }
  
  // Listing Intent Model
  class ListingIntent extends mixins(Model) {
    static tableName: string = 'listing_intent';
  
    public readonly id: string;
    public artist_id: string;
    public lister_id: string;
    public start_date: Date | string;
    public end_date: Date | string;
    public bid: number;
    public counter_bid: number;
    public currency: string;
    public capacity: number;
    public location: any; // jsonb
    public status: IntentStatus;
    public notes: string;
    public event_type: string;
    public created_at: Date | string;
    public updated_at: Date | string;


    public artist: Artist
  
    // Relation mappings
    static relationMappings: RelationMappings | RelationMappingsThunk = () => ({
      artist: {
        relation: Model.BelongsToOneRelation,
        modelClass: Artist,
        join: {
          from: 'listing_intent.artist_id',
          to: 'artists.id'
        }
      },
      lister: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'listing_intent.lister_id',
          to: 'users.id'
        }
      },
      eventType: {
        relation: Model.BelongsToOneRelation,
        modelClass: EventType,
        join: {
          from: 'listing_intent.event_type',
          to: 'event_type.id'
        }
      },
      listing: {
        relation: Model.HasOneRelation,
        modelClass: Listing,
        join: {
          from: 'listing_intent.id',
          to: 'listings.listing_intent_id'
        }
      },
      paymentIntent: {
        relation: Model.HasOneRelation,
        modelClass: PaymentIntent,
        join: {
          from: 'listing_intent.id',
          to: 'payment_intent.listing_intent_id'
        }
      }
    });
  }
  
  // Listing Model
  class Listing extends mixins(Model) {
    static tableName: string = 'listings';
  
    public readonly id: string;
    public artist_id: string;
    public lister_id: string;
    public start_date: Date | string;
    public end_date: Date | string;
    public status: ListingStatus;
    public capacity: number;
    public listing_intent_id: string;
    public created_at: Date | string;
    public updated_at: Date | string;
  
    // Relation mappings
    static relationMappings: RelationMappings | RelationMappingsThunk = () => ({
      artist: {
        relation: Model.BelongsToOneRelation,
        modelClass: Artist,
        join: {
          from: 'listings.artist_id',
          to: 'artists.id'
        }
      },
      lister: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'listings.lister_id',
          to: 'users.id'
        }
      },
      listingIntent: {
        relation: Model.BelongsToOneRelation,
        modelClass: ListingIntent,
        join: {
          from: 'listings.listing_intent_id',
          to: 'listing_intent.id'
        }
      }
    });
  }

  export { Listing, ListingIntent }