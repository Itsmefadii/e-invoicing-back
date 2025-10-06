# Dashboard API Documentation

## Overview
The Dashboard API provides comprehensive statistics for invoices and users, offering insights into business performance and invoice processing success rates.

## Endpoint
```
GET /api/v1/invoice/dashboard/stats
```

## Authentication
- **Required**: Yes
- **Type**: Bearer Token
- **Header**: `Authorization: Bearer <token>`

## Response Format

### Success Response (200)
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "totalInvoices": 150,
    "totalUsers": 25,
    "totalRevenue": 125000.50,
    "successRate": 85.5,
    "pendingInvoices": 20,
    "submittedInvoices": 100,
    "invalidInvoices": 15,
    "validInvoices": 15
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response (401)
```json
{
  "success": false,
  "message": "Unauthorized access",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response (500)
```json
{
  "success": false,
  "message": "Failed to retrieve dashboard statistics. Please try again later.",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `totalInvoices` | number | Total number of invoices in the system |
| `totalUsers` | number | Total number of users (filtered by seller if user is a seller) |
| `totalRevenue` | number | Total revenue from submitted invoices (sum of totalAmount) |
| `successRate` | number | Percentage of successfully submitted invoices (submitted / (submitted + invalid)) |
| `pendingInvoices` | number | Number of invoices with 'pending' status |
| `submittedInvoices` | number | Number of invoices with 'submitted' status |
| `invalidInvoices` | number | Number of invoices with 'invalid' status |
| `validInvoices` | number | Number of invoices with 'valid' status |

## User Role Behavior

### Seller Role
- Statistics are filtered to show only data for the authenticated seller
- `totalUsers` shows count of users belonging to the seller
- All invoice statistics are limited to the seller's invoices

### Admin Role
- Statistics show data across all sellers
- `totalUsers` shows count of all users in the system
- All invoice statistics include invoices from all sellers

## Usage Examples

### cURL
```bash
curl -X GET "http://localhost:3001/api/v1/invoice/dashboard/stats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### JavaScript/Fetch
```javascript
const response = await fetch('http://localhost:3001/api/v1/invoice/dashboard/stats', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

### PowerShell
```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_JWT_TOKEN"
    "Content-Type" = "application/json"
}

$response = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/invoice/dashboard/stats" -Method GET -Headers $headers
$response | ConvertTo-Json -Depth 10
```

## Testing
Use the provided test script to verify the API functionality:
```bash
node test-dashboard-api.js
```

## Notes
- The API requires authentication with a valid JWT token
- Revenue calculation is based on the `totalAmount` field of invoices with 'submitted' status
- Success rate is calculated as: (submitted invoices / (submitted + invalid invoices)) * 100
- All monetary values are returned as numbers with appropriate decimal precision
- The API handles both seller-specific and admin-level data access based on user role
