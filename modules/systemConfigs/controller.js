import { 
  getAllBusinessNatures, 
  getBusinessNatureById, 
  createBusinessNature, 
  updateBusinessNature, 
  deleteBusinessNature,
  getAllIndustries,
  getIndustryById,
  createIndustry,
  updateIndustry,
  deleteIndustry,
  getAllStates,
  getStateById,
  createState,
  updateState,
  deleteState,
  getAllHsCodes,
  getHsCodeById,
  createHsCode,
  updateHsCode,
  deleteHsCode,
  populateHsCodesFromFBR
} from './services.js';
import { sendSuccess, sendError, sendCreated, sendNotFoundError } from '../../lib/utils/response.js';

// Business Nature Controllers
export async function fetchAllBusinessNatures(request, reply) {
  try {
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
      userName: request.user.fullName,
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
      userName: request.user.fullName,
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
      userName: request.user.fullName,
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
      userName: request.user.fullName,
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

// Industry Controllers
export async function fetchAllIndustries(request, reply) {
  try {
    // User data is automatically available in request.user
    console.log('User fetching industries:', {
      userId: request.user.id,
      userName: request.user.fullName,
      roleName: request.user.roleName
    });

    const industries = await getAllIndustries();
    return sendSuccess(reply, industries, 'Industries fetched successfully');
  } catch (error) {
    return sendError(reply, error.message, 500);
  }
}

export async function fetchIndustryById(request, reply) {
  try {
    // User data is automatically available in request.user
    console.log('User fetching industry by ID:', {
      userId: request.user.id,
      userName: request.user.fullName,
      industryId: request.params.id
    });

    const { id } = request.params;
    const industry = await getIndustryById(id);
    return sendSuccess(reply, industry, 'Industry fetched successfully');
  } catch (error) {
    if (error.message === 'Industry not found') {
      return sendNotFoundError(reply, error.message);
    }
    return sendError(reply, error.message, 500);
  }
}

export async function createIndustryHandler(request, reply) {
  try {
    // User data is automatically available in request.user
    console.log('User creating industry:', {
      userId: request.user.id,
      userName: request.user.fullName,
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

    const industry = await createIndustry(enrichedData);
    return sendCreated(reply, industry, 'Industry created successfully');
  } catch (error) {
    return sendError(reply, error.message, 500);
  }
}

export async function updateIndustryHandler(request, reply) {
  try {
    // User data is automatically available in request.user
    console.log('User updating industry:', {
      userId: request.user.id,
      userName: request.user.fullName,
      industryId: request.params.id,
      updateData: request.body
    });

    const { id } = request.params;
    const data = request.body;
    const industry = await updateIndustry(id, data);
    return sendSuccess(reply, industry, 'Industry updated successfully');
  } catch (error) {
    if (error.message === 'Industry not found') {
      return sendNotFoundError(reply, error.message);
    }
    return sendError(reply, error.message, 500);
  }
}

export async function deleteIndustryHandler(request, reply) {
  try {
    // User data is automatically available in request.user
    console.log('User deleting industry:', {
      userId: request.user.id,
      userName: request.user.fullName,
      industryId: request.params.id
    });

    const { id } = request.params;
    const result = await deleteIndustry(id);
    return sendSuccess(reply, result, 'Industry deleted successfully');
  } catch (error) {
    if (error.message === 'Industry not found') {
      return sendNotFoundError(reply, error.message);
    }
    return sendError(reply, error.message, 500);
  }
}

// State Controllers
export async function fetchAllStates(request, reply) {
  try {
    // User data is automatically available in request.user
    console.log('User fetching states:', {
      userId: request.user.id,
      userName: request.user.fullName,
      roleName: request.user.roleName
    });

    const states = await getAllStates();
    return sendSuccess(reply, states, 'States fetched successfully');
  } catch (error) {
    return sendError(reply, error.message, 500);
  }
}

export async function fetchStateById(request, reply) {
  try {
    // User data is automatically available in request.user
    console.log('User fetching state by ID:', {
      userId: request.user.id,
      userName: request.user.fullName,
      stateId: request.params.id
    });

    const { id } = request.params;
    const state = await getStateById(id);
    return sendSuccess(reply, state, 'State fetched successfully');
  } catch (error) {
    if (error.message === 'State not found') {
      return sendNotFoundError(reply, error.message);
    }
    return sendError(reply, error.message, 500);
  }
}

export async function createStateHandler(request, reply) {
  try {
    // User data is automatically available in request.user
    console.log('User creating state:', {
      userId: request.user.id,
      userName: request.user.fullName,
      userRole: request.user.roleName,
      sellerId: request.user.sellerId
    });

    const {state, stateCode} = request.body;

    const data = {state, stateCode};
    const createstate = await createState(data);
    return sendCreated(reply, createstate, 'State created successfully');
  } catch (error) {
    return sendError(reply, error.message, 500);
  }
}

export async function updateStateHandler(request, reply) {
  try {
    // User data is automatically available in request.user
    console.log('User updating state:', {
      userId: request.user.id,
      userName: request.user.fullName,
      stateId: request.params.id,
      updateData: request.body
    });

    const { id } = request.params;
    const data = request.body;
    const state = await updateState(id, data);
    return sendSuccess(reply, state, 'State updated successfully');
  } catch (error) {
    if (error.message === 'State not found') {
      return sendNotFoundError(reply, error.message);
    }
    return sendError(reply, error.message, 500);
  }
}

export async function deleteStateHandler(request, reply) {
  try {
    // User data is automatically available in request.user
    console.log('User deleting state:', {
      userId: request.user.id,
      userName: request.user.fullName,
      stateId: request.params.id
    });

    const { id } = request.params;
    const result = await deleteState(id);
    return sendSuccess(reply, result, 'State deleted successfully');
  } catch (error) {
    if (error.message === 'State not found') {
      return sendNotFoundError(reply, error.message);
    }
    return sendError(reply, error.message, 500);
  }
}

// HsCode Controllers
export async function fetchAllHsCodes(request, reply) {
  try {
    // User data is automatically available in request.user
    console.log('User fetching HS codes:', {
      userId: request.user.id,
      userName: request.user.fullName,
      roleName: request.user.roleName
    });

    const hsCodes = await getAllHsCodes();
    return sendSuccess(reply, hsCodes, 'HS codes fetched successfully');
  } catch (error) {
    return sendError(reply, error.message, 500);
  }
}

export async function fetchHsCodeById(request, reply) {
  try {
    // User data is automatically available in request.user
    console.log('User fetching HS code by ID:', {
      userId: request.user.id,
      userName: request.user.fullName,
      hsCodeId: request.params.id
    });

    const { id } = request.params;
    const hsCode = await getHsCodeById(id);
    return sendSuccess(reply, hsCode, 'HS code fetched successfully');
  } catch (error) {
    if (error.message === 'HS code not found') {
      return sendNotFoundError(reply, error.message);
    }
    return sendError(reply, error.message, 500);
  }
}

export async function createHsCodeHandler(request, reply) {
  try {
    // User data is automatically available in request.user
    console.log('User creating HS code:', {
      userId: request.user.id,
      userName: request.user.fullName,
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

    const hsCode = await createHsCode(enrichedData);
    return sendCreated(reply, hsCode, 'HS code created successfully');
  } catch (error) {
    return sendError(reply, error.message, 500);
  }
}

export async function updateHsCodeHandler(request, reply) {
  try {
    // User data is automatically available in request.user
    console.log('User updating HS code:', {
      userId: request.user.id,
      userName: request.user.fullName,
      hsCodeId: request.params.id,
      updateData: request.body
    });

    const { id } = request.params;
    const data = request.body;
    const hsCode = await updateHsCode(id, data);
    return sendSuccess(reply, hsCode, 'HS code updated successfully');
  } catch (error) {
    if (error.message === 'HS code not found') {
      return sendNotFoundError(reply, error.message);
    }
    return sendError(reply, error.message, 500);
  }
}

export async function deleteHsCodeHandler(request, reply) {
  try {
    // User data is automatically available in request.user
    console.log('User deleting HS code:', {
      userId: request.user.id,
      userName: request.user.fullName,
      hsCodeId: request.params.id
    });

    const { id } = request.params;
    const result = await deleteHsCode(id);
    return sendSuccess(reply, result, 'HS code deleted successfully');
  } catch (error) {
    if (error.message === 'HS code not found') {
      return sendNotFoundError(reply, error.message);
    }
    return sendError(reply, error.message, 500);
  }
}

export async function populateHsCodesFromFBRHandler(request, reply) {
  try {
    // User data is automatically available in request.user
    console.log('User populating HS codes from FBR API:', {
      userId: request.user.id,
      userName: request.user.fullName,
      userRole: request.user.roleName
    });

    const result = await populateHsCodesFromFBR();
    return sendSuccess(reply, result, 'HS codes populated successfully from FBR API');
  } catch (error) {
    return sendError(reply, error.message, 500);
  }
}
