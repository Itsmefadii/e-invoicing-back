# HS Code API Documentation

## Overview
This API provides functionality to manage HS (Harmonized System) codes in the e-invoicing system. It includes the ability to populate the HS code table from the FBR (Federal Board of Revenue) API.

## Endpoints

### 1. Get All HS Codes
- **Method**: `GET`
- **URL**: `/api/system-configs/hs-codes`
- **Description**: Retrieves all HS codes from the database
- **Response**: Array of HS code objects with id, hsCode, description, createdAt, updatedAt

### 2. Get HS Code by ID
- **Method**: `GET`
- **URL**: `/api/system-configs/hs-codes/:id`
- **Description**: Retrieves a specific HS code by its ID
- **Parameters**: 
  - `id` (path parameter): The ID of the HS code
- **Response**: HS code object

### 3. Create HS Code
- **Method**: `POST`
- **URL**: `/api/system-configs/hs-codes`
- **Description**: Creates a new HS code entry
- **Request Body**:
  ```json
  {
    "hsCode": "8432.1010",
    "description": "NUCLEAR REACTOR, BOILERS, MACHINERY..."
  }
  ```
- **Response**: Created HS code object

### 4. Update HS Code
- **Method**: `PUT`
- **URL**: `/api/system-configs/hs-codes/:id`
- **Description**: Updates an existing HS code
- **Parameters**: 
  - `id` (path parameter): The ID of the HS code to update
- **Request Body**:
  ```json
  {
    "hsCode": "8432.1010",
    "description": "Updated description..."
  }
  ```
- **Response**: Updated HS code object

### 5. Delete HS Code
- **Method**: `DELETE`
- **URL**: `/api/system-configs/hs-codes/:id`
- **Description**: Deletes an HS code entry
- **Parameters**: 
  - `id` (path parameter): The ID of the HS code to delete
- **Response**: Success message

### 6. Populate HS Codes from FBR API
- **Method**: `POST`
- **URL**: `/api/system-configs/hs-codes/populate-from-fbr`
- **Description**: Fetches HS codes from the FBR API and populates the local database
- **Features**:
  - Fetches data from `https://gw.fbr.gov.pk/pdi/v1/itemdesccode`
  - Creates new HS codes if they don't exist
  - Updates existing HS codes if descriptions have changed
  - Skips duplicate entries
  - Provides detailed statistics about the operation
- **Response**:
  ```json
  {
    "success": true,
    "message": "HS codes populated successfully from FBR API",
    "data": {
      "message": "HS codes populated successfully from FBR API",
      "stats": {
        "created": 150,
        "updated": 25,
        "skipped": 10,
        "total": 185
      }
    }
  }
  ```

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Error Handling
The API returns appropriate HTTP status codes and error messages:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## Usage Example

### Populate HS Codes from FBR
```bash
curl -X POST \
  http://localhost:3000/api/system-configs/hs-codes/populate-from-fbr \
  -H 'Authorization: Bearer your-jwt-token' \
  -H 'Content-Type: application/json'
```

### Get All HS Codes
```bash
curl -X GET \
  http://localhost:3000/api/system-configs/hs-codes \
  -H 'Authorization: Bearer your-jwt-token'
```

## Database Schema
The HS Code table has the following structure:
- `id`: Primary key (auto-increment)
- `hsCode`: HS code string (e.g., "8432.1010")
- `description`: Description of the HS code
- `createdAt`: Timestamp when record was created
- `updatedAt`: Timestamp when record was last updated

## Notes
- The FBR API population endpoint should be used carefully as it makes external API calls
- The system handles duplicate HS codes by updating existing entries
- All operations are logged with user information for audit purposes
