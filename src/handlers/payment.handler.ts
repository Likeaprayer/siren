import { Request, Response } from "express";
import { transaction } from "objection";
import { ListingIntent } from "../db/models/listings";
import { PaymentIntent, Payment } from "../db/models/payments";
import { createListing } from "../service/listing.service";
import { IntentStatus } from "../common/enums";


export const createPaymentIntent = async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = req.user.id; // From auth middleware
      const { listing_intent_id, amount, currency } = req.body;
      
      // Verify the listing intent exists and is valid
      const listingIntent = await ListingIntent.query().findById(listing_intent_id);
      
      if (!listingIntent) {
        return res.status(404).json({ message: "Listing intent not found" });
      }

      if (listingIntent.status != IntentStatus.ACCEPTED) {
        return res.status(403).json({ message: "Listing must be accepted before making payment" });
      }
      
      // Create the payment intent
      const paymentIntent = await PaymentIntent.query().insert({
        user_id: userId,
        amount,
        currency,
        is_processed: false,
        listing_intent_id
      });
      
      res.status(201).json({ message: "Payment intent created successfully", data: paymentIntent });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const processPayment = async (req: Request, res: Response): Promise<any> => {
    try {
      const paymentIntentId = req.params.id;
      const { reference, metadata } = req.body;
      
      // Start a transaction
      const result = await transaction(PaymentIntent.knex(), async (trx) => {
        // Get the payment intent
        const paymentIntent = await PaymentIntent.query(trx)
          .findById(paymentIntentId)
          .withGraphFetched('listingIntent');
        
        if (!paymentIntent) {
          throw new Error("Payment intent not found");
        }
        
        // Check if payment is already processed
        if (paymentIntent.is_processed) {
          throw new Error("Payment already processed");
        }
        
        // Create the payment
        const payment = await Payment.query(trx).insert({
          reference,
          metadata,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          payment_intent_id: paymentIntent.id
        });
        
        // Update payment intent status
        await PaymentIntent.query(trx).patchAndFetchById(paymentIntentId, {
          is_processed: true
        });

        await createListing(paymentIntentId, paymentIntent.user_id, trx)
        
        return { paymentIntent, payment };
      });

      
      
      res.status(201).json({ 
        message: "Payment processed successfully", 
        data: result.payment 
      });
    } catch (error: any) {
      console.error('Error processing payment:', error);
      
      if (error.message.includes("already processed") || 
          error.message.includes("not found")) {
        return res.status(400).json({ message: error.message });
      }
      
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const getPaymentDetails = async (req: Request, res: Response): Promise<any> => {
    try {
      const id = req.params.id;
      const payment = await Payment.query()
        .findById(id)
        .withGraphFetched('paymentIntent.[listingIntent.[artist, lister]]');
      
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      
      res.json({ message: "success", data: payment });
    } catch (error) {
      console.error('Error fetching payment details:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  };