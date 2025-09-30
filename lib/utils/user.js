/**
 * User utility functions for accessing user data in controllers
 */

/**
 * Get user information from request
 * @param {Object} request - Fastify request object
 * @returns {Object} User data
 */
export function getUser(request) {
  return request.user || null;
}

/**
 * Get user ID from request
 * @param {Object} request - Fastify request object
 * @returns {string|null} User ID
 */
export function getUserId(request) {
  return request.user?.id || null;
}

/**
 * Get user role from request
 * @param {Object} request - Fastify request object
 * @returns {string|null} User role
 */
export function getUserRole(request) {
  return request.user?.roleName || null;
}

/**
 * Get user permissions from request
 * @param {Object} request - Fastify request object
 * @returns {Array} User permissions
 */
export function getUserPermissions(request) {
  return request.user?.permissions || [];
}

/**
 * Check if user has specific permission
 * @param {Object} request - Fastify request object
 * @param {string} permission - Permission to check
 * @returns {boolean} True if user has permission
 */
export function hasPermission(request, permission) {
  const permissions = getUserPermissions(request);
  return permissions.includes(permission) || permissions.includes('*');
}

/**
 * Check if user has any of the specified permissions
 * @param {Object} request - Fastify request object
 * @param {Array} permissions - Permissions to check
 * @returns {boolean} True if user has any of the permissions
 */
export function hasAnyPermission(request, permissions) {
  const userPermissions = getUserPermissions(request);
  return permissions.some(permission => 
    userPermissions.includes(permission) || userPermissions.includes('*')
  );
}

/**
 * Check if user has all of the specified permissions
 * @param {Object} request - Fastify request object
 * @param {Array} permissions - Permissions to check
 * @returns {boolean} True if user has all permissions
 */
export function hasAllPermissions(request, permissions) {
  const userPermissions = getUserPermissions(request);
  return permissions.every(permission => 
    userPermissions.includes(permission) || userPermissions.includes('*')
  );
}

/**
 * Check if user is admin
 * @param {Object} request - Fastify request object
 * @returns {boolean} True if user is admin
 */
export function isAdmin(request) {
  return getUserRole(request) === 'admin';
}

/**
 * Check if user is seller
 * @param {Object} request - Fastify request object
 * @returns {boolean} True if user is seller
 */
export function isSeller(request) {
  return getUserRole(request) === 'seller';
}

/**
 * Get seller ID from request (for seller-specific operations)
 * @param {Object} request - Fastify request object
 * @returns {string|null} Seller ID
 */
export function getSellerId(request) {
  return request.user?.sellerId || null;
}

/**
 * Log user action for auditing
 * @param {Object} request - Fastify request object
 * @param {string} action - Action being performed
 * @param {Object} details - Additional details
 */
export function logUserAction(request, action, details = {}) {
  const user = getUser(request);
  if (user) {
    console.log(`[USER ACTION] ${user.name} (${user.id}) - ${action}`, {
      user: {
        id: user.id,
        name: user.name,
        role: user.roleName,
        sellerId: user.sellerId
      },
      action,
      details,
      timestamp: new Date().toISOString()
    });
  }
}
