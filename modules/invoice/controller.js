import { listInvoicesService, getInvoiceByIdService, postInvoiceService, createInvoiceService, updateInvoiceService, deleteInvoiceService, getDashboardStatsService } from './services.js';
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

    const item = await getInvoiceByIdService(id, request.user);
    
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

    console.log('Received response from postInvoiceService:', JSON.stringify(item, null, 2));

    // Check if any invoices have validation errors
    // item is the data array returned from postInvoiceService
    const hasValidationErrors = item.some(invoice => {
      const validation = invoice.fbrResponse?.validationResponse;
      console.log('Checking validation for invoice:', invoice.invoiceId, 'validation:', validation);
      
      if (validation) {
        const isInvalid = validation.statusCode === "01" || 
                         validation.status === "Invalid" || 
                         validation.status === "invalid";
        console.log('Is invalid:', isInvalid, 'statusCode:', validation.statusCode, 'status:', validation.status);
        return isInvalid;
      }
      
      // Also check if there's an error field (for catch block errors)
      if (invoice.error) {
        console.log('Invoice has error field:', invoice.error);
        return true;
      }
      
      return false;
    });

    console.log('Final validation check result:', hasValidationErrors);

    if (hasValidationErrors) {
      console.log('Returning 400 error response due to validation errors');
      // Return validation error response
      return reply.status(400).send({
        success: false,
        message: 'Invoice validation failed',
        data: item,
        timestamp: new Date().toISOString()
      });
    }

    console.log('Returning 200 success response - no validation errors');

    return sendSuccess(reply, item, 'Invoice posted successfully');
  } catch (error) {
    console.error('Post invoice error:', error);
    return sendError(reply, 'Failed to post invoice. Please try again later.');
  }
}

export async function createInvoiceHandler(request, reply) {
  try {
    const data = await createInvoiceService(request);
    return sendSuccess(reply, data, 'Invoice created successfully');
  } catch (error) {
    console.error('Create invoice error:', error);
    return sendError(reply, 'Failed to create invoice. Please try again later.');
  }
}

export async function updateInvoiceHandler(request, reply) {
  try {
    const data = await updateInvoiceService(request);
    return sendSuccess(reply, data, 'Invoice updated successfully');
  } catch (error) {
    console.error('Update invoice error:', error);
    return sendError(reply, 'Failed to update invoice. Please try again later.');
  }
}

export async function deleteInvoiceHandler(request, reply) {
  try {
    const data = await deleteInvoiceService(request);
    return sendSuccess(reply, data, 'Invoice deleted successfully');
  } catch (error) {
    console.error('Delete invoice error:', error);
    return sendError(reply, 'Failed to delete invoice. Please try again later.');
  }
}

export async function getDashboardStatsHandler(request, reply) {
  try {
    const stats = await getDashboardStatsService(request);
    return sendSuccess(reply, stats, 'Dashboard statistics retrieved successfully');
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return sendError(reply, 'Failed to retrieve dashboard statistics. Please try again later.');
  }
}




