import { verifyPassword } from '../../lib/security/hash.js';
import { signJwt } from '../../lib/security/jwt.js';
import { User } from '../user/model.js';
import { Role } from '../permission/model.role.js';
import { Seller } from '../user/model.seller.js';
import { getPermissionsForRole } from '../permission/services.js';
import { Industry } from '../systemConfigs/model/model.industry.js';
import { BusinessNature } from '../systemConfigs/model/model.businessNature.js';
import { State } from '../systemConfigs/model/model.state.js';

export async function login({ email, password }) {
  try {
    // Input validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new Error('Email and password must be strings');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Password length validation
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Find user with role information
    const user = await User.findOne({ 
      where: { email: email.trim().toLowerCase() },
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'roleName', 'isActive']
      }]
    });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Verify password
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      throw new Error('Invalid email or password');
    }
    
    // Fetch permissions for the user's role
    const permissions = await getPermissionsForRole(user.roleId);
    
    // Fetch seller data if user has sellerId
    let sellerData = null;
    let findIndustry = null;
    let findBusinessNature = null;
    let findState = null;
    if (user.sellerId) {
      try {
        sellerData = await Seller.findByPk(user.sellerId);
        findIndustry = await Industry.findByPk(sellerData.industryId, {
          attributes: ['industryName']
        });
        findBusinessNature = await BusinessNature.findByPk(sellerData.businessNatureId, {
          attributes: ['businessNature']
        });
        findState = await State.findByPk(sellerData.stateId, {
          attributes: ['state']
        });
      } catch (error) {
        console.error('Error fetching seller data:', error);
        // Continue without seller data if there's an error
      }
    }
    
    // Generate JWT token
    const token = signJwt({
      sub: user.id,
      ntn: user.ntn,
      roleId: user.roleId,
      roleName: user.role?.roleName,
      sellerId: user.sellerId || null,
      sellerCode: sellerData?.sellerCode || null,
    });
   
    return {
      token,
      user: {
        id: user.id,
        ntn: user.ntn,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`,
        phoneNumber: user.phoneNumber,
        roleId: user.roleId,
        roleName: user.role?.roleName,
        roleDescription: user.role?.description,
        sellerId: user.sellerId || null,
        sellerData: sellerData ? {
          id: sellerData.id,
          sellerCode: sellerData.sellerCode,
          businessName: sellerData.businessName,
          ntnCnic: sellerData.ntnCnic,
          businessNatureId: sellerData.businessNatureId,
          businessNature: findBusinessNature.businessNature,
          industryId: sellerData.industryId,
          industryName: findIndustry.industryName,
          address1: sellerData.address1,
          address2: sellerData.address2,
          city: sellerData.city,
          stateId: sellerData.stateId,
          state: findState.state,
          postalCode: sellerData.postalCode,
          businessPhone: sellerData.businessPhone,
          businessEmail: sellerData.businessEmail,
          fbrSandBoxToken: sellerData.fbrSandBoxToken,
          fbrProdToken: sellerData.fbrProdToken,
          logoUrl: sellerData.logoUrl,
          isActive: sellerData.isActive
        } : null,
        permissions: permissions,
      },
    };
  } catch (error) {
    // Log error for debugging (in production, use proper logging)
    console.error('Login error:', error.message);
    
    // Re-throw validation errors as-is
    if (error.message.includes('required') || 
        error.message.includes('must be') || 
        error.message.includes('Invalid') ||
        error.message.includes('Password must be')) {
      throw error;
    }
    
    // For database or other unexpected errors, throw generic message
    throw new Error('Login failed. Please try again later.');
  }
}


