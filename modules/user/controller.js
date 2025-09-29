import { createSeller, createSellerUser } from './services.js';
import { ROLE } from '../../lib/auth/guards.js';
import { 
  sendCreated, 
  sendValidationError, 
  sendError 
} from '../../lib/utils/response.js';

export async function adminCreateSellerHandler(request, reply) {
  try {
    // Validate request body
    if (!request.body) {
      return sendValidationError(reply, 'Request body is required');
    }

    const { email, name, password } = request.body;
    
    // Validate required fields
    if (!email || !name || !password) {
      return sendValidationError(reply, 'Email, name, and password are required');
    }

    const result = await createSeller({ email, name, password });
    return sendCreated(reply, result, 'Seller created successfully');
  } catch (error) {
    console.error('Create seller error:', error);
    
    if (error.message.includes('required') || 
        error.message.includes('must be') || 
        error.message.includes('Invalid')) {
      return sendValidationError(reply, error.message);
    }
    
    return sendError(reply, 'Failed to create seller. Please try again later.');
  }
}

export async function sellerCreateUserHandler(request, reply) {
  try {
    // Validate request body
    if (!request.body) {
      return sendValidationError(reply, 'Request body is required');
    }

    const sellerId = request.user.sellerId;
    const { email, name, password, permissions } = request.body;
    
    // Validate required fields
    if (!email || !name || !password) {
      return sendValidationError(reply, 'Email, name, and password are required');
    }

    const result = await createSellerUser({ sellerId, email, name, password, permissions });
    return sendCreated(reply, result, 'User created successfully');
  } catch (error) {
    console.error('Create user error:', error);
    
    if (error.message.includes('required') || 
        error.message.includes('must be') || 
        error.message.includes('Invalid')) {
      return sendValidationError(reply, error.message);
    }
    
    return sendError(reply, 'Failed to create user. Please try again later.');
  }
}



