import { Result, Ok, Err } from 'ts-results-es';

export type AppError =
  | ValidationError
  | DatabaseError
  | NotFoundError
  | InternalServerError;

export class ValidationError {
  readonly _tag = 'ValidationError';
  constructor(public readonly message: string, public readonly details?: unknown) {}
}

export class DatabaseError {
  readonly _tag = 'DatabaseError';
  constructor(public readonly message: string) {}
}

export class NotFoundError {
  readonly _tag = 'NotFoundError';
  constructor(public readonly message: string) {}
}

export class InternalServerError {
  readonly _tag = 'InternalServerError';
  constructor(public readonly message: string) {}
}

export function ok<T>(value: T): Result<T, AppError> {
  return Ok(value);
}

export function err<E extends AppError>(error: E): Result<never, AppError> {
  return Err(error);
}
