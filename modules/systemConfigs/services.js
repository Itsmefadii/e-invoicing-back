import { BusinessNature } from './model/model.businessNature.js';
import { Industry } from './model/model.industry.js';
import { State } from './model/model.state.js';
import { HsCode } from './model/model.hsCode.js';
import { HsUom } from './model/model.hsUom.js';
import { SaleType } from './model/model.saleType.js';
import axios from 'axios';

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

// HsCode Services
async function getAllHsCodes() {
  try {
    const hsCodes = await HsCode.findAll({
      order: [['hsCode', 'ASC']],
      attributes: ['id', 'hsCode', 'description', 'createdAt', 'updatedAt']
    });
    return hsCodes;
  } catch (error) {
    throw new Error(`Failed to fetch HS codes: ${error.message}`);
  }
}

async function getHsCodeById(id) {
  try {
    const hsCode = await HsCode.findByPk(id);
    if (!hsCode) {
      throw new Error('HS code not found');
    }
    return hsCode;
  } catch (error) {
    throw new Error(`Failed to fetch HS code: ${error.message}`);
  }
}

async function createHsCode(data) {
  try {
    const hsCode = await HsCode.create(data);
    return hsCode;
  } catch (error) {
    throw new Error(`Failed to create HS code: ${error.message}`);
  }
}

async function updateHsCode(id, data) {
  try {
    const hsCode = await HsCode.findByPk(id);
    if (!hsCode) {
      throw new Error('HS code not found');
    }
    
    await hsCode.update(data);
    return hsCode;
  } catch (error) {
    throw new Error(`Failed to update HS code: ${error.message}`);
  }
}

async function deleteHsCode(id) {
  try {
    const hsCode = await HsCode.findByPk(id);
    if (!hsCode) {
      throw new Error('HS code not found');
    }
    
    await hsCode.destroy();
    return { message: 'HS code deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete HS code: ${error.message}`);
  }
}

async function populateHsCodesFromFBR() {
  try {
    const response = await fetch('https://gw.fbr.gov.pk/pdi/v1/itemdesccode', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.FBR_API_TOKEN}`
      },
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      throw new Error(`FBR API request failed with status: ${response.status}`);
    }
    
    const fbrData = await response.json();
    
    if (!Array.isArray(fbrData)) {
      throw new Error('Invalid data format received from FBR API');
    }
    
    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const item of fbrData) {
      if (!item.hS_CODE || !item.description) {
        skippedCount++;
        continue;
      }
      
      // Check if HS code already exists
      const existingHsCode = await HsCode.findOne({
        where: { hsCode: item.hS_CODE }
      });
      
      if (existingHsCode) {
        // Update existing record if description is different
        if (existingHsCode.description !== item.description) {
          await existingHsCode.update({ description: item.description });
          updatedCount++;
        } else {
          skippedCount++;
        }
      } else {
        // Create new record
        await HsCode.create({
          hsCode: item.hS_CODE,
          description: item.description
        });
        createdCount++;
      }
    }
    
    return {
      message: 'HS codes populated successfully from FBR API',
      stats: {
        created: createdCount,
        updated: updatedCount,
        skipped: skippedCount,
        total: fbrData.length
      }
    };
  } catch (error) {
    throw new Error(`Failed to populate HS codes from FBR API: ${error.message}`);
  }
}

async function fetchSaleType() {
  try {
    const saleTypes = await SaleType.findAll({
      order: [['transactionDesc', 'ASC']],
      attributes: ['id', 'transactionDesc']
    });
    return saleTypes;
  } catch (error) {
    throw new Error(`Failed to fetch sale type: ${error.message}`);
  }
}

// HsUom Services
async function populateHsUomsFromFBR(req) {
  try {
    console.log('Starting to populate HsUoms from FBR API...');
    
    // Get FBR token from user data
    const fbrToken = process.env.FBR_API_TOKEN;
    
    if (!fbrToken) {
      throw new Error('FBR token not found in user data. Please ensure the user has a valid FBR token.');
    }
    
    console.log('Using FBR token for API calls');
    
    // Get all HS codes from database
    const hsCodes = await HsCode.findAll({
      attributes: ['id', 'hsCode'],
      order: [['id', 'ASC']]
    });

    console.log(`Found ${hsCodes.length} HS codes to process`);

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    // Process each HS code
    for (const hsCode of hsCodes) {
      try {
        console.log(`Processing HS code: ${hsCode.hsCode}`);
        
        // Call FBR API for UOM data
        const fbrResponse = await axios.get(`https://gw.fbr.gov.pk/pdi/v2/HS_UOM?hs_code=${hsCode.hsCode}&annexure_id=3`, {
          timeout: 10000, // 10 second timeout
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${fbrToken}`,
            'User-Agent': 'E-Invoicing-System/1.0'
          }
        });

        if (fbrResponse.data && Array.isArray(fbrResponse.data)) {
          // Process each UOM entry
          for (const uomData of fbrResponse.data) {
            try {
              // Check if this UOM already exists for this HS code
              const existingUom = await HsUom.findOne({
                where: {
                  hsCode: hsCode.hsCode,
                  uomId: uomData.uoM_ID
                }
              });

              if (!existingUom) {
                // Create new HsUom entry
                const newHsUom = await HsUom.create({
                  hsCode: hsCode.hsCode,
                  uomId: uomData.uoM_ID,
                  description: uomData.description
                });

                results.push({
                  hsCode: hsCode.hsCode,
                  uomId: uomData.uoM_ID,
                  description: uomData.description,
                  status: 'created',
                  id: newHsUom.id
                });
              } else {
                // Update existing entry if description changed
                if (existingUom.description !== uomData.description) {
                  await existingUom.update({
                    description: uomData.description
                  });
                  
                  results.push({
                    hsCode: hsCode.hsCode,
                    uomId: uomData.uoM_ID,
                    description: uomData.description,
                    status: 'updated',
                    id: existingUom.id
                  });
                } else {
                  results.push({
                    hsCode: hsCode.hsCode,
                    uomId: uomData.uoM_ID,
                    description: uomData.description,
                    status: 'already_exists',
                    id: existingUom.id
                  });
                }
              }
            } catch (dbError) {
              console.error(`Database error for HS code ${hsCode.hsCode}, UOM ${uomData.uoM_ID}:`, dbError.message);
              errorCount++;
            }
          }
        } else {
          console.log(`No UOM data found for HS code: ${hsCode.hsCode}`);
        }

        successCount++;
        
        // Add a small delay to avoid overwhelming the FBR API
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (apiError) {
        console.error(`API error for HS code ${hsCode.hsCode}:`, apiError.message);
        errorCount++;
        
        // Continue with next HS code even if one fails
        continue;
      }
    }

    console.log(`HsUom population completed. Success: ${successCount}, Errors: ${errorCount}`);
    
    return {
      totalHsCodes: hsCodes.length,
      processedSuccessfully: successCount,
      errors: errorCount,
      results: results,
      summary: {
        created: results.filter(r => r.status === 'created').length,
        updated: results.filter(r => r.status === 'updated').length,
        alreadyExists: results.filter(r => r.status === 'already_exists').length
      }
    };

  } catch (error) {
    console.error('Error in populateHsUomsFromFBR:', error);
    throw new Error(`Failed to populate HsUoms from FBR: ${error.message}`);
  }
}

async function getAllHsUoms() {
  try {
    const hsUoms = await HsUom.findAll({
      order: [['hsCode', 'ASC'], ['uomId', 'ASC']],
      attributes: ['id', 'hsCode', 'uomId', 'description', 'createdAt', 'updatedAt']
    });
    return hsUoms;
  } catch (error) {
    throw new Error(`Failed to fetch HsUoms: ${error.message}`);
  }
}

async function getHsUomsByHsCode(hsCode) {
  try {
    const hsUoms = await HsUom.findAll({
      where: { hsCode },
      order: [['uomId', 'ASC']],
      attributes: ['id', 'hsCode', 'uomId', 'description', 'createdAt', 'updatedAt']
    });
    return hsUoms;
  } catch (error) {
    throw new Error(`Failed to fetch HsUoms for HS code ${hsCode}: ${error.message}`);
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
  deleteState,
  
  // HsCode exports
  getAllHsCodes,
  getHsCodeById,
  createHsCode,
  updateHsCode,
  deleteHsCode,
  populateHsCodesFromFBR,

  // Sale Type exports
  fetchSaleType,

  // HsUom exports
  populateHsUomsFromFBR,
  getAllHsUoms,
  getHsUomsByHsCode
};