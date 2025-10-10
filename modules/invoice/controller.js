import { listInvoicesService, getInvoiceByIdService, postInvoiceService, createInvoiceService, updateInvoiceService, deleteInvoiceService, getDashboardStatsService, getReportsAnalyticsService } from './services.js';
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

    const results = await postInvoiceService(request, invoiceIds);
    
    if (!results || results.length === 0) {
      return sendNotFoundError(reply, 'No invoices processed');
    }

    console.log('Received response from postInvoiceService:', JSON.stringify(results, null, 2));

    // Check if any invoices have validation errors using the new standardized structure
    const hasValidationErrors = results.some(invoice => {
      // Check for invoice-level errors
      const hasInvoiceError = invoice.statusCode === "01" || 
                             invoice.status === "Invalid" || 
                             invoice.status === "invalid" ||
                             invoice.status === "Error";
      
      // Check for item-level errors
      const hasItemErrors = invoice.itemErrors && invoice.itemErrors.length > 0;
      
      console.log(`Invoice ${invoice.invoiceId}: invoiceError=${hasInvoiceError}, itemErrors=${hasItemErrors}`);
      
      return hasInvoiceError || hasItemErrors;
    });

    console.log('Final validation check result:', hasValidationErrors);

    if (hasValidationErrors) {
      console.log('Returning 400 error response due to validation errors');
      // Return validation error response with standardized structure
      return reply.status(400).send({
        success: false,
        message: 'Invoice failed to submit: kindly check the invoice data in invoice view',
        data: results,
        timestamp: new Date().toISOString()
      });
    }

    console.log('Returning 200 success response - no validation errors');

    return sendSuccess(reply, results, 'Invoice posted successfully');
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
    return sendError(reply, error.message);
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

export async function getReportsAnalyticsHandler(request, reply) {
  try {
    const analytics = await getReportsAnalyticsService(request);
    return sendSuccess(reply, analytics, 'Reports and analytics data retrieved successfully');
  } catch (error) {
    console.error('Reports analytics error:', error);
    return sendError(reply, 'Failed to retrieve reports and analytics data. Please try again later.');
  }
}




