import { BusinessNature } from './model/model.businessNature.js';
import { Industry } from './model/model.industry.js';
import { State } from './model/model.state.js';

// Business Nature Services
async function getAllBusinessNatures() {
  try {
    const businessNatures = await BusinessNature.findAll({
      order: [['businessnature', 'DESC']],
      attributes: ['id', 'businessnature', 'createdAt', 'updatedAt']
    });
    return businessNatures;
  } catch (error) {
    throw new Error(`Failed to fetch business natures: ${error.message}`);
  }
}

async function getBusinessNatureById(id) {
  try {
    const businessNature = await BusinessNature.findByPk(id);
    if (!businessNature) {
      throw new Error('Business nature not found');
    }
    return businessNature;
  } catch (error) {
    throw new Error(`Failed to fetch business nature: ${error.message}`);
  }
}

async function createBusinessNature(data) {
  try {
    const businessNature = await BusinessNature.create(data);
    return businessNature;
  } catch (error) {
    throw new Error(`Failed to create business nature: ${error.message}`);
  }
}

async function updateBusinessNature(id, data) {
  try {
    const businessNature = await BusinessNature.findByPk(id);
    if (!businessNature) {
      throw new Error('Business nature not found');
    }
    
    await businessNature.update(data);
    return businessNature;
  } catch (error) {
    throw new Error(`Failed to update business nature: ${error.message}`);
  }
}

async function deleteBusinessNature(id) {
  try {
    const businessNature = await BusinessNature.findByPk(id);
    if (!businessNature) {
      throw new Error('Business nature not found');
    }
    
    await businessNature.destroy();
    return { message: 'Business nature deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete business nature: ${error.message}`);
  }
}

// Industry Services
async function getAllIndustries() {
  try {
    const industries = await Industry.findAll({
      order: [['industryName', 'ASC']],
      attributes: ['id', 'industryName']
    });
    return industries;
  } catch (error) {
    throw new Error(`Failed to fetch industries: ${error.message}`);
  }
}

async function getIndustryById(id) {
  try {
    const industry = await Industry.findByPk(id);
    if (!industry) {
      throw new Error('Industry not found');
    }
    return industry;
  } catch (error) {
    throw new Error(`Failed to fetch industry: ${error.message}`);
  }
}

async function createIndustry(data) {
  try {
    const industry = await Industry.create(data);
    return industry;
  } catch (error) {
    throw new Error(`Failed to create industry: ${error.message}`);
  }
}

async function updateIndustry(id, data) {
  try {
    const industry = await Industry.findByPk(id);
    if (!industry) {
      throw new Error('Industry not found');
    }
    
    await industry.update(data);
    return industry;
  } catch (error) {
    throw new Error(`Failed to update industry: ${error.message}`);
  }
}

async function deleteIndustry(id) {
  try {
    const industry = await Industry.findByPk(id);
    if (!industry) {
      throw new Error('Industry not found');
    }
    
    await industry.destroy();
    return { message: 'Industry deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete industry: ${error.message}`);
  }
}

// State Services
async function getAllStates() {
  try {
    const states = await State.findAll({
      order: [['state', 'ASC']],
      attributes: ['id', 'state', 'stateCode']
    });
    return states;
  } catch (error) {
    throw new Error(`Failed to fetch states: ${error.message}`);
  }
}

async function getStateById(id) {
  try {
    const state = await State.findByPk(id);
    if (!state) {
      throw new Error('State not found');
    }
    return state;
  } catch (error) {
    throw new Error(`Failed to fetch state: ${error.message}`);
  }
}

async function createState(data) {
  try {
    const state = await State.create(data);
    return state;
  } catch (error) {
    throw new Error(`Failed to create state: ${error.message}`);
  }
}

async function updateState(id, data) {
  try {
    const state = await State.findByPk(id);
    if (!state) {
      throw new Error('State not found');
    }
    
    await state.update(data);
    return state;
  } catch (error) {
    throw new Error(`Failed to update state: ${error.message}`);
  }
}

async function deleteState(id) {
  try {
    const state = await State.findByPk(id);
    if (!state) {
      throw new Error('State not found');
    }
    
    await state.destroy();
    return { message: 'State deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete state: ${error.message}`);
  }
}

export {
  // Business Nature exports
  getAllBusinessNatures,
  getBusinessNatureById,
  createBusinessNature,
  updateBusinessNature,
  deleteBusinessNature,
  
  // Industry exports
  getAllIndustries,
  getIndustryById,
  createIndustry,
  updateIndustry,
  deleteIndustry,
  
  // State exports
  getAllStates,
  getStateById,
  createState,
  updateState,
  deleteState
};