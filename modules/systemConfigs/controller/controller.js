import { 
  getAllBusinessNatures, 
  getBusinessNatureById, 
  createBusinessNature, 
  updateBusinessNature, 
  deleteBusinessNature 
} from '../services.js';
import { sendSuccess, sendError, sendCreated, sendNotFoundError } from '../../../lib/utils/response.js';
import { getUser } from '../../../lib/utils/user.js';

export async function fetchAllBusinessNatures(request, reply) {
  try {
    // User data is automatically available in request.user
    console.log('User data available:', {
      id: request.user.id,
      name: request.user.name,
      role: request.user.roleName,
      permissions: request.user.permissions
    });

    const businessNatures = await getAllBusinessNatures();
    return sendSuccess(reply, businessNatures, 'Business natures fetched successfully');
  } catch (error) {
    return sendError(reply, error.message, 500);
  }
}

export async function fetchBusinessNatureById(request, reply) {
  try {
    // User data is automatically available in request.user
    console.log('User fetching business nature by ID:', {
      userId: request.user.id,
      userName: request.user.name,
      businessNatureId: request.params.id
    });

    const { id } = request.params;
    const businessNature = await getBusinessNatureById(id);
    return sendSuccess(reply, businessNature, 'Business nature fetched successfully');
  } catch (error) {
    if (error.message === 'Business nature not found') {
      return sendNotFoundError(reply, error.message);
    }
    return sendError(reply, error.message, 500);
  }
}

export async function createBusinessNatureHandler(request, reply) {
  try {
    // User data is automatically available in request.user
    console.log('User creating business nature:', {
      userId: request.user.id,
      userName: request.user.name,
      userRole: request.user.roleName,
      sellerId: request.user.sellerId
    });

    const data = request.body;
    
    // Add user-specific data to the creation
    const enrichedData = {
      ...data,
      createdBy: request.user.id,
      sellerId: request.user.sellerId // If this is seller-specific data
    };

    const businessNature = await createBusinessNature(enrichedData);
    return sendCreated(reply, businessNature, 'Business nature created successfully');
  } catch (error) {
    return sendError(reply, error.message, 500);
  }
}

export async function updateBusinessNatureHandler(request, reply) {
  try {
    // User data is automatically available in request.user
    console.log('User updating business nature:', {
      userId: request.user.id,
      userName: request.user.name,
      businessNatureId: request.params.id,
      updateData: request.body
    });

    const { id } = request.params;
    const data = request.body;
    const businessNature = await updateBusinessNature(id, data);
    return sendSuccess(reply, businessNature, 'Business nature updated successfully');
  } catch (error) {
    if (error.message === 'Business nature not found') {
      return sendNotFoundError(reply, error.message);
    }
    return sendError(reply, error.message, 500);
  }
}

export async function deleteBusinessNatureHandler(request, reply) {
  try {
    // User data is automatically available in request.user
    console.log('User deleting business nature:', {
      userId: request.user.id,
      userName: request.user.name,
      businessNatureId: request.params.id
    });

    const { id } = request.params;
    const result = await deleteBusinessNature(id);
    return sendSuccess(reply, result, 'Business nature deleted successfully');
  } catch (error) {
    if (error.message === 'Business nature not found') {
      return sendNotFoundError(reply, error.message);
    }
    return sendError(reply, error.message, 500);
  }
}
