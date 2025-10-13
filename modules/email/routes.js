import emailController from './controller.js';

export default async function emailRoutes(fastify, options) {
  // Test email connection
  fastify.get('/test-connection', {
    schema: {
      description: 'Test email service connection',
      tags: ['Email'],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                connected: { type: 'boolean' }
              }
            }
          }
        }
      }
    }
  }, emailController.testEmailConnection);

  // Submit quote request
  fastify.post('/quote-request', {
    schema: {
      description: 'Submit a quote request form',
      tags: ['Email'],
      body: {
        type: 'object',
        required: ['fullName', 'email', 'invoicingNeeds'],
        properties: {
          fullName: { 
            type: 'string', 
            minLength: 2, 
            maxLength: 100,
            description: 'Full name of the person requesting the quote' 
          },
          email: { 
            type: 'string', 
            format: 'email', 
            description: 'Email address for contact' 
          },
          companyName: { 
            type: 'string', 
            maxLength: 100,
            description: 'Company name (optional)' 
          },
          phoneNumber: { 
            type: 'string', 
            maxLength: 20,
            description: 'Phone number (optional)' 
          },
          invoicingNeeds: { 
            type: 'string', 
            minLength: 10, 
            maxLength: 1000,
            description: 'Description of invoicing needs and requirements' 
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                quoteRequestId: { type: 'string' },
                confirmationId: { type: 'string' }
              }
            }
          }
        },
        400: {
          type: 'object',
          properties: {
            success: { type: 'boolean', default: false },
            message: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            success: { type: 'boolean', default: false },
            message: { type: 'string' },
            errors: { type: 'string' }
          }
        }
      }
    }
  }, emailController.submitQuoteRequest);
}
