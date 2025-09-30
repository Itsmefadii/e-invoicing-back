import { BusinessNature } from './model/model.businessNature.js';

async function getAllBusinessNatures() {
  try {
    const businessNatures = await BusinessNature.findAll({
      order: [['businessnature', 'DESC']],
      attributes: ['id', 'businessnature']
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

export {
  getAllBusinessNatures,
  getBusinessNatureById,
  createBusinessNature,
  updateBusinessNature,
  deleteBusinessNature
};
