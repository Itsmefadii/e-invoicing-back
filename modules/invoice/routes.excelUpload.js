import { uploadExcelController, getUploadTemplateController } from './controller.excelUpload.js';

export async function excelUploadRoutes(fastify, options) {
  // Register multipart support for file uploads
  await fastify.register(import('@fastify/multipart'), {
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit
    }
  });

  // Upload Excel file route
  fastify.route({
    method: 'POST',
    url: '/upload-excel',
    handler: uploadExcelController,
    schema: {
      description: 'Upload Excel file with invoice data',
      tags: ['Invoice Excel Upload'],
      consumes: ['multipart/form-data'],
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                invoices: { type: 'array' },
                items: { type: 'array' },
                summary: {
                  type: 'object',
                  properties: {
                    totalInvoices: { type: 'number' },
                    totalItems: { type: 'number' },
                    totalAmount: { type: 'number' }
                  }
                }
              }
            }
          }
        },
        400: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        },
        403: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    }
  });

  // Get upload template information
  fastify.route({
    method: 'GET',
    url: '/upload-template',
    handler: getUploadTemplateController,
    schema: {
      description: 'Get Excel upload template and format information',
      tags: ['Invoice Excel Upload'],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                requiredHeaders: { type: 'array', items: { type: 'string' } },
                fieldDescriptions: { type: 'object' },
                sampleData: { type: 'object' },
                notes: { type: 'array', items: { type: 'string' } }
              }
            }
          }
        }
      }
    }
  });
}
