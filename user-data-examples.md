# User Data in All APIs

Once a user is logged in, comprehensive user data is automatically available in all API endpoints through `request.user`.

## What's Available

### Complete User Object
```javascript
request.user = {
  id: "user-uuid",
  email: "user@example.com",
  name: "John Doe",
  ntn: "1234567890",
  roleId: "role-uuid",
  roleName: "seller",
  roleDescription: "Seller role description",
  sellerId: "seller-uuid", // If user belongs to a seller
  permissions: ["dashboard:view", "invoices:view", "reports:view"],
  isActive: true,
  lastLogin: "2024-01-15T10:30:00Z",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-15T10:30:00Z"
}
```

### JWT Payload (Original)
```javascript
request.jwt = {
  sub: "user-uuid",
  ntn: "1234567890",
  roleId: "role-uuid",
  roleName: "seller",
  sellerId: "seller-uuid"
}
```

## Usage Examples

### 1. Basic User Data Access
```javascript
export async function someController(request, reply) {
  // Get user data
  const user = getUser(request);
  console.log('Current user:', user.name, user.roleName);
  
  // Get specific user properties
  const userId = getUserId(request);
  const userRole = getUserRole(request);
  const permissions = getUserPermissions(request);
}
```

### 2. Permission Checking
```javascript
export async function protectedController(request, reply) {
  // Check single permission
  if (!hasPermission(request, 'invoices:create')) {
    return sendError(reply, 'Insufficient permissions', 403);
  }
  
  // Check multiple permissions (any)
  if (!hasAnyPermission(request, ['invoices:view', 'reports:view'])) {
    return sendError(reply, 'No view permissions', 403);
  }
  
  // Check multiple permissions (all)
  if (!hasAllPermissions(request, ['invoices:create', 'invoices:edit'])) {
    return sendError(reply, 'Missing required permissions', 403);
  }
}
```

### 3. Role-Based Access
```javascript
export async function roleBasedController(request, reply) {
  // Check if user is admin
  if (isAdmin(request)) {
    // Admin-only logic
  }
  
  // Check if user is seller
  if (isSeller(request)) {
    // Seller-specific logic
    const sellerId = getSellerId(request);
    // Filter data by seller
  }
}
```

### 4. User-Specific Data Creation
```javascript
export async function createResourceController(request, reply) {
  const user = getUser(request);
  
  // Add user context to data
  const data = {
    ...request.body,
    createdBy: user.id,
    sellerId: user.sellerId, // If seller-specific
    createdByName: user.name
  };
  
  const result = await createResource(data);
  return sendCreated(reply, result, 'Resource created successfully');
}
```

### 5. Auditing and Logging
```javascript
export async function auditedController(request, reply) {
  // Log user action
  logUserAction(request, 'DELETE_INVOICE', {
    invoiceId: request.params.id,
    endpoint: 'DELETE /invoices/:id'
  });
  
  // Your controller logic here
}
```

### 6. Data Filtering by User Context
```javascript
export async function getInvoicesController(request, reply) {
  const user = getUser(request);
  
  // Filter invoices based on user context
  let whereClause = {};
  
  if (isSeller(request)) {
    // Sellers can only see their own invoices
    whereClause.sellerId = user.sellerId;
  } else if (!isAdmin(request)) {
    // Non-admins can only see their own invoices
    whereClause.createdBy = user.id;
  }
  // Admins can see all invoices (no filter)
  
  const invoices = await getInvoices(whereClause);
  return sendSuccess(reply, invoices, 'Invoices retrieved successfully');
}
```

## Available Utility Functions

### User Data Access
- `getUser(request)` - Get complete user object
- `getUserId(request)` - Get user ID
- `getUserRole(request)` - Get user role name
- `getUserPermissions(request)` - Get user permissions array
- `getSellerId(request)` - Get seller ID (if applicable)

### Permission Checking
- `hasPermission(request, permission)` - Check single permission
- `hasAnyPermission(request, permissions)` - Check if user has any permission
- `hasAllPermissions(request, permissions)` - Check if user has all permissions

### Role Checking
- `isAdmin(request)` - Check if user is admin
- `isSeller(request)` - Check if user is seller

### Auditing
- `logUserAction(request, action, details)` - Log user actions for auditing

## Benefits

1. **Automatic Data**: User data is automatically available in every API
2. **Fresh Data**: User data is fetched fresh from database on each request
3. **Comprehensive**: Includes user info, role, permissions, and context
4. **Easy to Use**: Simple utility functions for common operations
5. **Auditing**: Built-in logging for user actions
6. **Security**: Permission checking utilities
7. **Context-Aware**: Data can be filtered based on user context

## Example API Response with User Context

```javascript
// GET /api/v1/system-configs/business-natures
// Headers: Authorization: Bearer <token>

// Console output:
// [USER ACTION] John Doe (user-uuid) - FETCH_BUSINESS_NATURES { endpoint: 'GET /business-natures' }

// Response:
{
  "success": true,
  "message": "Business natures fetched successfully",
  "data": [...],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

The user data is now automatically available in all your API endpoints! 🚀
