import { Model, ModelObject, RelationMappings, RelationMappingsThunk, mixin } from "objection";
import mixins, { modelUnique, modelUuid } from ".";
import { Artist } from "./artists";
import { ListingIntent, Listing } from "./listings";
import { PaymentIntent } from "./payments";
// import { DBErrors } from "objection-db-errors";
// import visibility from 'objection-visibility';




class UserTypeModel extends mixins(Model) {
    static tableName: string = 'user_type';
  
    public readonly id: string;
    public name: string;
    public created_at: Date | string;
    public updated_at: Date | string;
  
    // Relation mappings
    static relationMappings: RelationMappings | RelationMappingsThunk = () => ({
      users: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: 'user_type.id',
          to: 'users.user_type'
        }
      }
    });
  }
  
  // User Model
  class User extends mixins(Model) {
    static tableName: string = 'users';
  
    public readonly id: string;
    public name: string;
    public email: string;
    public password: string;
    public user_type: string;
    public created_At: Date | string;
    public created_at: Date | string;
    public updated_at: Date | string;
  
    static hidden = ["password"];
  
    // Relation mappings
    static relationMappings: RelationMappings | RelationMappingsThunk = () => ({
      userType: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserTypeModel,
        join: {
          from: 'users.user_type',
          to: 'user_type.id'
        }
      },
      artist: {
        relation: Model.HasOneRelation,
        modelClass: Artist,
        join: {
          from: 'users.id',
          to: 'artists.user_id'
        }
      },
      listingIntents: {
        relation: Model.HasManyRelation,
        modelClass: ListingIntent,
        join: {
          from: 'users.id',
          to: 'listing_intent.lister_id'
        }
      },
      listings: {
        relation: Model.HasManyRelation,
        modelClass: Listing,
        join: {
          from: 'users.id',
          to: 'listings.lister_id'
        }
      },
      paymentIntents: {
        relation: Model.HasManyRelation,
        modelClass: PaymentIntent,
        join: {
          from: 'users.id',
          to: 'payment_intent.user_id'
        }
      }
    });
  }
  

// export type UserT = ModelObject<User>
export {User, UserTypeModel} 