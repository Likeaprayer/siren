import Joi from "@hapi/joi";
import { validationMiddleware } from "./middleware/validation.middleware";

export const Validator = {
  signup: () =>
    validationMiddleware({
      body: {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        user_type: Joi.string().required(),
        name: Joi.string().required(),
      },
    }),
  login: () =>
    validationMiddleware({
      body: {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
    }),

  getUserById: () =>
    validationMiddleware({
      params: {
        id: Joi.string().required(),
      },
    }),
  createUser: () =>
    validationMiddleware({
      body: {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        user_type: Joi.string().required(),
        name: Joi.string().required(),
      },
    }),
  updateUserById: () =>
    validationMiddleware({
      params: {
        id: Joi.string().required(),
      },
    }),

  //listing
  createListingIntent: () => validationMiddleware({}),
  getListingIntentById: () => validationMiddleware({}),
  respondToListingIntent: () => validationMiddleware({}),
  createListingFromIntent: () => validationMiddleware({}),
  getListingById: () => validationMiddleware({}),
  updateListingStatus: () => validationMiddleware({}),

  //artist
  getArtistById: () => validationMiddleware({}),
  createArtistProfile: () => validationMiddleware({}),
  updateArtistProfile: () => validationMiddleware({}),
  searchArtists: () => validationMiddleware({}),

  //payments
  createPaymentIntent: () => validationMiddleware({}),
  processPayment: () => validationMiddleware({}),
  getPaymentDetails: () => validationMiddleware({}),

};
