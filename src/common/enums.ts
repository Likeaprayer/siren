export enum UserType {
    ARTIST = 'artist',
    LISTER = 'lister',
    ADMIN = 'admin'
  }
  
  export enum ListingStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
  }
  
  export enum IntentStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    COUNTERED = 'countered',
    CANCELLED = 'cancelled'
  }

export enum httpStatusCodes {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER = 500,
  }