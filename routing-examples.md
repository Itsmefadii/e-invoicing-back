# Single Endpoint Routing System

This project now uses a single endpoint per module where the HTTP method determines which controller function to call. This provides a clean, RESTful API design.

## How It Works

Each module has one main endpoint that handles multiple HTTP methods:
- **GET** - Retrieve data (with optional ID parameter)
- **POST** - Create new data
- **PUT** - Update existing data (requires ID)
- **DELETE** - Delete data (requires ID)

## API Endpoints

### Business Natures (System Configs)
```
GET    /api/v1/system-configs/business-natures     - Get all business natures
GET    /api/v1/system-configs/business-natures/:id - Get specific business nature
POST   /api/v1/system-configs/business-natures     - Create new business nature
PUT    /api/v1/system-configs/business-natures/:id - Update business nature
DELETE /api/v1/system-configs/business-natures/:id - Delete business nature
```

### Invoices
```
GET    /api/v1/invoice/        - Get all invoices
GET    /api/v1/invoice/:id     - Get specific invoice
```

### Users
```
POST   /api/v1/users/admin/sellers  - Create seller (Admin only)
POST   /api/v1/users/seller/users   - Create user (Seller only)
```

### Authentication
```
POST   /api/v1/auth/login      - Login (no auth required)
```

## Usage Examples

### Business Natures

**Get all business natures:**
```bash
GET /api/v1/system-configs/business-natures
Authorization: Bearer <token>
```

**Get specific business nature:**
```bash
GET /api/v1/system-configs/business-natures/1
Authorization: Bearer <token>
```

**Create new business nature:**
```bash
POST /api/v1/system-configs/business-natures
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessnature": "Retail Business"
}
```

**Update business nature:**
```bash
PUT /api/v1/system-configs/business-natures/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessnature": "Updated Business Type"
}
```

**Delete business nature:**
```bash
DELETE /api/v1/system-configs/business-natures/1
Authorization: Bearer <token>
```

## Router Utilities

The system includes utility functions for creating routes:

### `createCRUDRoute(resourceName, handlers, preHandler)`
Creates a full CRUD route for a resource.

```javascript
fastify.route(createCRUDRoute('business-natures', {
  GET_ALL: fetchAllBusinessNatures,
  GET_BY_ID: fetchBusinessNatureById,
  POST: createBusinessNatureHandler,
  PUT: updateBusinessNatureHandler,
  DELETE: deleteBusinessNatureHandler
}));
```

### `createRoute(config)`
Creates a custom route with method-based routing.

```javascript
fastify.route(createRoute({
  method: ['GET', 'POST'],
  url: '/custom-endpoint/:id?',
  handlers: {
    GET: getHandler,
    POST: postHandler
  },
  preHandler: [authenticate, requireRole(ROLE.ADMIN)]
}));
```

## Benefits

1. **Clean URLs**: Single endpoint per resource
2. **RESTful Design**: HTTP methods determine actions
3. **Consistent API**: All modules follow the same pattern
4. **Easy to Extend**: Add new methods without new endpoints
5. **Reduced Complexity**: Fewer route definitions to manage

## Error Handling

The system provides consistent error responses:

- **405 Method Not Allowed**: When using unsupported HTTP method
- **400 Bad Request**: When required parameters are missing
- **401 Unauthorized**: When authentication fails
- **403 Forbidden**: When user lacks permissions
- **404 Not Found**: When resource doesn't exist
- **500 Internal Server Error**: When server errors occur
