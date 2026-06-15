/**
 * Custom Application Error class.
 * Extends the native Error to include an HTTP status code.
 *
 * Usage:
 *   throw new AppError(404, 'User not found');
 *   throw new AppError(400, 'Invalid email or password');
 */
class AppError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g. 400, 401, 403, 404, 500)
   * @param {string} message    - Human-readable error message sent to the client
   */
  constructor(statusCode, message) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // Marks this as an operational error (expected), not a programming bug
    this.isOperational = true;

    // Capture stack trace, excluding the constructor call itself
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
