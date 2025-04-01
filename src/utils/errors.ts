import { CheckViolationError, DBError, DataError, ForeignKeyViolationError, NotNullViolationError, UniqueViolationError } from 'objection';
import { httpStatusCodes } from '../common/enums';

export class BaseError extends Error {
  status: any;
  constructor(message: string, name: string, status: any, ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.status = status;
    Error.captureStackTrace(this);
  }
}

export class ApiNotFoundError extends BaseError {
  constructor(
    message = 'Resource Not found',
    name = 'NotFound',
    statusCode = httpStatusCodes.NOT_FOUND,
    
  ) {
    super(message ,name, statusCode );
  }
}

export class ApiUnauthorizedError extends BaseError {
  constructor(
    message = 'Unauthorized access of requested resource',
    name = 'Unauthorized',
    statusCode = httpStatusCodes.UNAUTHORIZED,
  ) {
    super(message ,name, statusCode );
  }
}

export class ApiInternalServerError extends BaseError {
  constructor(
    message= 'Something went wrong',
    name = 'InternalServerError',
    statusCode = httpStatusCodes.INTERNAL_SERVER
  ) {
    super(message ,name, statusCode );
  }
}

export class ApiBadRequestError extends BaseError {
  constructor(
    message = 'Bad request',
    name = 'BadRequest',
    statusCode = httpStatusCodes.BAD_REQUEST,
    
  ) {
    super(message ,name, statusCode );
  }
}

export class ApiUnprocessableEntity extends BaseError {
  constructor(
    message = 'Unprocessable Entity',
    name = 'UnprocessableEntity',
    statusCode = httpStatusCodes.UNPROCESSABLE_ENTITY,
    
  ) {
    super(message ,name, statusCode );
  }
}

function getErrorByStatusCode(statusCode: number){
  switch (statusCode) {
    case 404:
      return ApiNotFoundError
    case 400:
      return ApiBadRequestError
    case 401:
      return ApiUnauthorizedError
    case 422:
      return ApiUnprocessableEntity
    case 500:
    default:
      return ApiInternalServerError
  }
}

export const ApiInternalErrorHandling = (err: any) => {


  if (err instanceof UniqueViolationError) {
    return {
      type: err.name,
      message: `${err.columns.toString().replace(/_/g, ' ')} already exists`,
      statusCode: 403
    }
  }
  if (err instanceof NotNullViolationError) {
    return {
      type: err.name,
      message: `${err.column} cannot be null`,
      statusCode: 400
    }
  }
  if (err instanceof ForeignKeyViolationError) {
    return {
      type: err.name,
      message: "Foreign key violation",
      data: {
        table: err.table,
        constraint: err.constraint
      },
      statusCode: 409
    }
  }
  if (err instanceof CheckViolationError) {
    return {
      type: err.name,
      data: {
        table: err.table,
        constraint: err.constraint
      },
      statusCode: 400
    }
  }
  if (err instanceof DataError) {
    return {
      type: err.name,
      data: {},
      statusCode: 400
    }
  }
  if (err instanceof DBError) {
    return {
      type: 'UnknownDatabaseError',
      data: {
        message: err.message
      },
      statusCode: 500
    }
  }
  return {
    type: 'UnknownError',
    data: {
      message: err.message
    },
    statusCode: 500
  }
}