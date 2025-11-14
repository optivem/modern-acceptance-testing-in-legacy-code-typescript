import { Request, Response, NextFunction } from 'express';
import { ValidationException, NotExistValidationException } from '../exceptions/ValidationExceptions';

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof ValidationException) {
    return res.status(422).json({ message: err.message });
  }

  if (err instanceof NotExistValidationException) {
    return res.status(404).send();
  }

  if (err.name === 'SyntaxError' && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }

  res.status(500).json({ message: 'Internal server error' });
};
