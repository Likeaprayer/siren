import { Model, RelationMappings, RelationMappingsThunk } from "objection";
import mixins from ".";
import { User } from "./user";
import { Listing, ListingIntent } from "./listings";



class Artist extends mixins(Model) {
    static tableName: string = 'artists';
  
    public readonly id: string;
    public user_id: string;
    public stagename: string;
    public gender: string;
    public contact_email: string;
    public contact_phone: string;
    public location: any; // jsonb
    public created_at: Date | string;
    public updated_at: Date | string;
  
    // Relation mappings
    static relationMappings: RelationMappings | RelationMappingsThunk = () => ({
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'artists.user_id',
          to: 'users.id'
        }
      },
      listings: {
        relation: Model.HasManyRelation,
        modelClass: Listing,
        join: {
          from: 'artists.id',
          to: 'listings.artist_id'
        }
      },
      listingIntents: {
        relation: Model.HasManyRelation,
        modelClass: ListingIntent,
        join: {
          from: 'artists.id',
          to: 'listing_intent.artist_id'
        }
      }
    });
  }

  export { Artist}