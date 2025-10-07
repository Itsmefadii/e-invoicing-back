# HsUom API Documentation

## Overview
The HsUom API provides functionality to fetch HS codes from the database, call the FBR API to get UOM (Unit of Measure) data for each HS code, and store the results in the HsUoms table.

## Database Schema

### HsUoms Table
```sql
CREATE TABLE HsUoms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  hsCode VARCHAR(255) NOT NULL,
  uomId INT NOT NULL,
  description VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

### 1. Populate HsUoms from FBR API

**POST** `/api/v1/system-configs/hs-uoms/populate-from-fbr`

Fetches all HS codes from the database and calls the FBR API for each one to get UOM data.

#### Headers
- `Authorization: Bearer <token>` (required)

#### Response

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "HsUoms populated successfully from FBR API",
  "data": {
    "totalHsCodes": 150,
    "processedSuccessfully": 145,
    "errors": 5,
    "results": [
      {
        "hsCode": "5904.9000",
        "uomId": 77,
        "description": "Square Meter",
        "status": "created",
        "id": 1
      },
      {
        "hsCode": "5904.9000",
        "uomId": 78,
        "description": "Kilogram",
        "status": "updated",
        "id": 2
      }
    ],
    "summary": {
      "created": 120,
      "updated": 25,
      "alreadyExists": 0
    }
  },
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Failed to populate HsUoms from FBR: API timeout",
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

### 2. Get All HsUoms

**GET** `/api/v1/system-configs/hs-uoms`

Retrieves all HsUom records from the database.

#### Headers
- `Authorization: Bearer <token>` (required)

#### Response

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "HsUoms retrieved successfully",
  "data": [
    {
      "id": 1,
      "hsCode": "5904.9000",
      "uomId": 77,
      "description": "Square Meter",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    },
    {
      "id": 2,
      "hsCode": "5904.9000",
      "uomId": 78,
      "description": "Kilogram",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

### 3. Get HsUoms by HS Code

**GET** `/api/v1/system-configs/hs-uoms/:hsCode`

Retrieves all HsUom records for a specific HS code.

#### Parameters
- `hsCode` (path parameter): The HS code to search for (e.g., "5904.9000")

#### Headers
- `Authorization: Bearer <token>` (required)

#### Response

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "HsUoms for HS Code 5904.9000 retrieved successfully",
  "data": [
    {
      "id": 1,
      "hsCode": "5904.9000",
      "uomId": 77,
      "description": "Square Meter",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "HS Code is required",
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

## FBR API Integration

The system calls the FBR API endpoint:
```
https://gw.fbr.gov.pk/pdi/v2/HS_UOM?hs_code={hsCode}&annexure_id=3
```

### FBR API Response Format
```json
[
  {
    "uoM_ID": 77,
    "description": "Square Meter"
  },
  {
    "uoM_ID": 78,
    "description": "Kilogram"
  }
]
```

## Usage Examples

### cURL Examples

#### Populate HsUoms from FBR
```bash
curl -X POST "http://localhost:3001/api/v1/system-configs/hs-uoms/populate-from-fbr" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

#### Get All HsUoms
```bash
curl -X GET "http://localhost:3001/api/v1/system-configs/hs-uoms" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get HsUoms by HS Code
```bash
curl -X GET "http://localhost:3001/api/v1/system-configs/hs-uoms/5904.9000" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JavaScript Examples

#### Populate HsUoms
```javascript
const response = await fetch('/api/v1/system-configs/hs-uoms/populate-from-fbr', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log('Population result:', data.data.summary);
```

#### Get HsUoms by HS Code
```javascript
const hsCode = '5904.9000';
const response = await fetch(`/api/v1/system-configs/hs-uoms/${hsCode}`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});

const data = await response.json();
console.log('HsUoms for', hsCode, ':', data.data);
```

## Features

- **Batch Processing**: Processes all HS codes from the database in sequence
- **Error Handling**: Continues processing even if individual HS codes fail
- **Duplicate Prevention**: Checks for existing records before creating new ones
- **Update Support**: Updates existing records if descriptions change
- **Rate Limiting**: Includes delays between API calls to avoid overwhelming FBR API
- **Comprehensive Logging**: Detailed console logging for monitoring progress
- **Timeout Protection**: 10-second timeout for each FBR API call

## Error Handling

The API includes comprehensive error handling:

1. **API Timeouts**: 10-second timeout for FBR API calls
2. **Network Errors**: Continues processing other HS codes if one fails
3. **Database Errors**: Logs database errors but continues processing
4. **Authentication Errors**: Proper error responses for missing tokens
5. **Validation Errors**: Validates required parameters

## Performance Considerations

- **Processing Time**: Large datasets may take several minutes to process
- **API Rate Limits**: Includes 100ms delay between FBR API calls
- **Memory Usage**: Processes HS codes sequentially to manage memory
- **Database Transactions**: Each UOM record is processed individually

## Dependencies

- `axios`: For HTTP requests to FBR API
- `sequelize`: For database operations
- `fastify`: Web framework
- Existing HS codes in database

## Notes

- The FBR API requires proper authentication credentials
- The populate operation may take several minutes for large datasets
- Results include detailed statistics about the operation
- The system handles both creation and updates of existing records
- All operations require valid JWT authentication
