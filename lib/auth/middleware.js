import { verifyJwt } from '../security/jwt.js';
import { sendAuthError, sendError } from '../utils/response.js';
import { User } from '../../modules/user/model.js';
import { Role } from '../../modules/permission/model.role.js';
import { Seller } from '../../modules/user/model.seller.js';
import { BusinessNature } from '../../modules/systemConfigs/model/model.businessNature.js';
import { Industry } from '../../modules/systemConfigs/model/model.industry.js';
import { State } from '../../modules/systemConfigs/model/model.state.js';
import { getPermissionsForRole } from '../../modules/permission/services.js';

/**
 * Enrich user data with fresh information from database
 * @param {Object} decoded - Decoded JWT payload
 * @returns {Object} Enriched user data
 */
async function enrichUserData(decoded) {
  try {
    // Get fresh user data from database
    const user = await User.findOne({
      where: { id: decoded.sub },
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'roleName', 'isActive']
      }]
    });

    if (!user) {
      return null;
    }

    // Get fresh permissions
    const permissions = await getPermissionsForRole(user.roleId);

    // Fetch seller data if user has sellerId
    let sellerData = null;
    if (user.sellerId) {
      try {
        sellerData = await Seller.findByPk(user.sellerId, {
          include: [{
            model: BusinessNature,
            as: 'businessNature',
            attributes: ['businessNature']
          },
          {
            model: Industry,
            as: 'industry',
            attributes: ['industryName']
          },
          {
            model: State,
            as: 'state',
            attributes: ['state']
          }]
        });
      } catch (error) {
        console.error('Error fetching seller data in middleware:', error);
        // Continue without seller data if there's an error
      }
    }

    // Return comprehensive user data
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      ntn: user.ntn,
      roleId: user.roleId,
      roleName: user.role?.roleName,
      sellerId: user.sellerId,
      sellerData: sellerData ? {
        id: sellerData.id,
        sellerCode: sellerData.sellerCode,
        businessName: sellerData.businessName,
        ntnCnic: sellerData.ntnCnic,
        businessNatureId: sellerData.businessNatureId,
        businessNature: sellerData.businessNature?.businessNature,
        industryId: sellerData.industryId,
        industryName: sellerData.industry?.industryName,
        address1: sellerData.address1,
        address2: sellerData.address2,
        city: sellerData.city,
        stateId: sellerData.stateId,
        state: sellerData.state?.state,
        postalCode: sellerData.postalCode,
        businessPhone: sellerData.businessPhone,
        businessEmail: sellerData.businessEmail,
        fbrTokenType: sellerData.fbrTokenType,
        fbrSandBoxToken: sellerData.fbrSandBoxToken,
        fbrProdToken: sellerData.fbrProdToken,
        logoUrl: sellerData.logoUrl,
        isActive: sellerData.isActive
      } : null,
      permissions: permissions,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  } catch (error) {
    console.error('Error enriching user data:', error);
    return null;
  }
}

/**
 * Authentication middleware that requires JWT token for all routes except login
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 * @param {Function} done - Next function
 */
export async function requireAuth(request, reply) {
  // Skip authentication for login route
  if (request.url.includes('/auth/login') || request.url.includes('/login')) {
    return;
  }

  // Skip authentication for email quote request route (public form)
  if (request.url.includes('/email/quote-request') && request.method === 'POST') {
    return;
  }

  // Skip authentication for email test connection route (for debugging)
  if (request.url.includes('/email/test-connection') && request.method === 'GET') {
    return;
  }

  // Skip authentication for email test connection route (for debugging)
  if (request.url.includes('/email/quote-request') && request.method === 'POST') {
    return;
  }

  // Skip authentication for OPTIONS requests (CORS preflight)
  if (request.method === 'OPTIONS') {
    return;
  }

  // Get authorization header
  const authHeader = request.headers['authorization'];
  
  if (!authHeader) {
    return sendAuthError(reply, 'Authorization token is required');
  }

  // Check if header starts with 'Bearer '
  if (!authHeader.startsWith('Bearer ')) {
    return sendAuthError(reply, 'Invalid authorization format. Use: Bearer <token>');
  }

  // Extract token
  const token = authHeader.slice(7);
  
  if (!token) {
    return sendAuthError(reply, 'Authorization token is missing');
  }

  // Verify JWT token
  const decoded = verifyJwt(token);
  
  if (!decoded) {
    return sendAuthError(reply, 'Invalid or expired token');
  }

  // Enrich user data with fresh information from database
  const enrichedUserData = await enrichUserData(decoded);
  
  if (!enrichedUserData) {
    return sendAuthError(reply, 'User not found or inactive');
  }

  // Attach comprehensive user info to request
  request.user = enrichedUserData;
  
  // Also attach original JWT payload for reference
  request.jwt = decoded;
}

/**
 * Optional authentication middleware - doesn't fail if no token provided
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 * @param {Function} done - Next function
 */
export async function optionalAuth(request, reply) {
  const authHeader = request.headers['authorization'];
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const decoded = verifyJwt(token);
    
    if (decoded) {
      // Enrich user data with fresh information from database
      const enrichedUserData = await enrichUserData(decoded);
      
      if (enrichedUserData) {
        request.user = enrichedUserData;
        request.jwt = decoded;
      }
    }
  }
}

/**
 * Middleware to check if user is authenticated (use after requireAuth)
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 * @param {Function} done - Next function
 */
export function ensureAuthenticated(request, reply, done) {
  if (!request.user) {
    return sendAuthError(reply, 'User not authenticated');
  }
  done();
}
