import { Invoice, InvoiceItem, SandboxInvoice, SandboxInvoiceItem } from '../../modules/models.js';

/**
 * Get the appropriate invoice models based on fbrTokenType
 * @param {string} fbrTokenType - The FBR token type ('sandbox' or 'production')
 * @returns {Object} Object containing Invoice and InvoiceItem models
 */
export function getInvoiceModels(fbrTokenType) {
  if (fbrTokenType === 'Sandbox') {
    return {
      Invoice: SandboxInvoice,
      InvoiceItem: SandboxInvoiceItem
    };
  }
  
  // Default to production models
  return {
    Invoice: Invoice,
    InvoiceItem: InvoiceItem
  };
}

/**
 * Get the appropriate invoice models from request user data
 * @param {Object} user - The user object from req.user
 * @returns {Object} Object containing Invoice and InvoiceItem models
 */
export function getInvoiceModelsFromUser(user) {
  const fbrTokenType = user?.sellerData?.fbrTokenType;
  return getInvoiceModels(fbrTokenType);
}
