import AppError from '../utils/AppError.js';

/**
 * Global Error Handling Middleware.
 *
 * Must be registered LAST in app.js (after all routes).
 * Catches any error passed via next(err) and returns a consistent JSON response.
 */
const errorHandler = (err, req, res, next) => {
  // Default to 500 if no status code is set
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal server error.';

  // Log all errors to the console
  console.error(`[Error] ${req.method} ${req.url} → ${err.statusCode}: ${err.message}`);

  // If in development, also log the stack trace
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Mongoose: duplicate key error (e.g. unique email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    err = new AppError(409, `${field} already exists.`);
  }

  // Mongoose: cast error (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    err = new AppError(400, `Invalid value for field: ${err.path}`);
  }

  // Mongoose: validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    err = new AppError(400, messages.join('. '));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    err = new AppError(401, 'Invalid token. Please log in again.');
  }
  if (err.name === 'TokenExpiredError') {
    err = new AppError(401, 'Your session has expired. Please log in again.');
  }

  res.status(err.statusCode).json({
    status: err.status || 'error',
    message: err.message,
    // Include stack only in development for easier debugging
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
