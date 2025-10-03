import { listInvoicesService, getInvoiceByIdService, postInvoiceService } from './services.js';
import { 
  sendSuccess, 
  sendValidationError,
  sendNotFoundError, 
  sendError 
} from '../../lib/utils/response.js';

export async function listInvoicesHandler(request, reply) {
  try {
    const items = await listInvoicesService(request);
    return sendSuccess(reply, items, 'Invoices retrieved successfully');
  } catch (error) {
    console.error('List invoices error:', error);
    return sendError(reply, 'Failed to retrieve invoices. Please try again later.');
  }
}

export async function getInvoiceByIdHandler(request, reply) {
  try {
    const { id } = request.params;
    
    if (!id) {
      return sendValidationError(reply, 'Invoice ID is required');
    }

    const item = await getInvoiceByIdService(id);
    
    if (!item) {
      return sendNotFoundError(reply, 'Invoice not found');
    }

    return sendSuccess(reply, item, 'Invoice retrieved successfully');
  } catch (error) {
    console.error('Get invoice error:', error);
    return sendError(reply, 'Failed to retrieve invoice. Please try again later.');
  }
}

export async function postInvoiceHandler(request, reply) {
  try {
    const { invoiceIds } = request.body;
    
    if (!invoiceIds) {
      return sendValidationError(reply, 'Invoice ID is required');
    }

    const item = await postInvoiceService(request, invoiceIds);
    
    if (!item) {
      return sendNotFoundError(reply, 'Invoice not posted');
    }

    return sendSuccess(reply, item, 'Invoice posted successfully');
  } catch (error) {
    console.error('Post invoice error:', error);
    return sendError(reply, 'Failed to post invoice. Please try again later.');
  }
}



