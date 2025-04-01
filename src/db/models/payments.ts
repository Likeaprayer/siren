import { Model, RelationMappings, RelationMappingsThunk } from "objection";
import mixins from ".";
import { User } from "./user";
import { ListingIntent } from "./listings";

class PaymentIntent extends mixins(Model) {
    static tableName: string = 'payment_intent';
  
    public readonly id: string;
    public user_id: string;
    public amount: number;
    public currency: string;
    public is_processed: boolean;
    public listing_intent_id: string;
    public created_at: Date | string;
    public updated_at: Date | string;
  
    // Relation mappings
    static relationMappings: RelationMappings | RelationMappingsThunk = () => ({
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'payment_intent.user_id',
          to: 'users.id'
        }
      },
      listingIntent: {
        relation: Model.BelongsToOneRelation,
        modelClass: ListingIntent,
        join: {
          from: 'payment_intent.listing_intent_id',
          to: 'listing_intent.id'
        }
      },
      payment: {
        relation: Model.HasOneRelation,
        modelClass: Payment,
        join: {
          from: 'payment_intent.id',
          to: 'payments.payment_intent_id'
        }
      }
    });
  }
  
  // Payment Model
  class Payment extends mixins(Model) {
    static tableName: string = 'payments';
  
    public readonly id: string;
    public reference: string;
    public metadata: any; // jsonb
    public amount: number;
    public currency: string;
    public payment_intent_id: string;
    public created_at: Date | string;
    public updated_at: Date | string;
  
    // Relation mappings
    static relationMappings: RelationMappings | RelationMappingsThunk = () => ({
      paymentIntent: {
        relation: Model.BelongsToOneRelation,
        modelClass: PaymentIntent,
        join: {
          from: 'payments.payment_intent_id',
          to: 'payment_intent.id'
        }
      }
    });
  }

export { Payment, PaymentIntent}