import { login } from './services.js';
import { 
  sendSuccess, 
  sendValidationError, 
  sendAuthError, 
  sendError 
} from '../../lib/utils/response.js';

export async function loginHandler(request, reply) {
  try {
    // Validate request body exists
    if (!request.body) {
      return sendValidationError(reply, 'Request body is required');
    }

    const { email, password } = request.body;
    
    // Call login service (now with built-in validation)
    const result = await login({ email, password });
    
    // Return success response
    return sendSuccess(reply, result, 'Login successful');
    
  } catch (error) {
    // Handle validation errors (400 Bad Request)
    if (error.message.includes('required') || 
        error.message.includes('must be') || 
        error.message.includes('Invalid') ||
        error.message.includes('Password must be')) {
      return sendValidationError(reply, error.message);
    }
    
    // Handle authentication errors (401 Unauthorized)
    if (error.message.includes('Invalid email or password')) {
      return sendAuthError(reply, 'Invalid email or password');
    }
    
    // Handle server errors (500 Internal Server Error)
    console.error('Login controller error:', error);
    return sendError(reply, 'Internal server error. Please try again later.');
  }
}
 
