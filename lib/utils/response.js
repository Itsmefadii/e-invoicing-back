/**
 * Standard API Response Utility
 * Provides consistent response format across all APIs
 */

/**
 * Send a successful response
 * @param {Object} reply - Fastify reply object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {Object} meta - Additional metadata (pagination, etc.)
 */
export function sendSuccess(reply, data = null, message = 'Success', statusCode = 200, meta = null) {
  const response = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  if (meta) {
    response.meta = meta;
  }

  return reply.code(statusCode).send(response);
}

/**
 * Send an error response
 * @param {Object} reply - Fastify reply object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {*} errors - Additional error details
 * @param {string} code - Error code for client handling
 */
export function sendError(reply, message = 'Internal server error', statusCode = 500, errors = null, code = null) {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };

  if (errors) {
    response.errors = errors;
  }

  if (code) {
    response.code = code;
  }

  return reply.code(statusCode).send(response);
}

/**
 * Send validation error response
 * @param {Object} reply - Fastify reply object
 * @param {string} message - Validation error message
 * @param {*} validationErrors - Detailed validation errors
 */
export function sendValidationError(reply, message = 'Validation failed', validationErrors = null) {
  return sendError(reply, message, 400, validationErrors, 'VALIDATION_ERROR');
}

/**
 * Send authentication error response
 * @param {Object} reply - Fastify reply object
 * @param {string} message - Authentication error message
 */
export function sendAuthError(reply, message = 'Authentication failed') {
  return sendError(reply, message, 401, null, 'AUTH_ERROR');
}

/**
 * Send not found error response
 * @param {Object} reply - Fastify reply object
 * @param {string} message - Not found error message
 */
export function sendNotFoundError(reply, message = 'Resource not found') {
  return sendError(reply, message, 404, null, 'NOT_FOUND');
}

/**
 * Send forbidden error response
 * @param {Object} reply - Fastify reply object
 * @param {string} message - Forbidden error message
 */
export function sendForbiddenError(reply, message = 'Access forbidden') {
  return sendError(reply, message, 403, null, 'FORBIDDEN');
}

/**
 * Send conflict error response
 * @param {Object} reply - Fastify reply object
 * @param {string} message - Conflict error message
 */
export function sendConflictError(reply, message = 'Resource conflict') {
  return sendError(reply, message, 409, null, 'CONFLICT');
}

/**
 * Send created response (201)
 * @param {Object} reply - Fastify reply object
 * @param {*} data - Created resource data
 * @param {string} message - Success message
 */
export function sendCreated(reply, data = null, message = 'Resource created successfully') {
  return sendSuccess(reply, data, message, 201);
}

/**
 * Send no content response (204)
 * @param {Object} reply - Fastify reply object
 * @param {string} message - Success message
 */
export function sendNoContent(reply, message = 'Operation completed successfully') {
  return sendSuccess(reply, null, message, 204);
}

/**
 * Send paginated response
 * @param {Object} reply - Fastify reply object
 * @param {Array} data - Array of items
 * @param {Object} pagination - Pagination info
 * @param {string} message - Success message
 */
export function sendPaginated(reply, data, pagination, message = 'Data retrieved successfully') {
  const meta = {
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      total: pagination.total || 0,
      totalPages: Math.ceil((pagination.total || 0) / (pagination.limit || 10)),
      hasNext: pagination.hasNext || false,
      hasPrev: pagination.hasPrev || false,
    }
  };

  return sendSuccess(reply, data, message, 200, meta);
}
