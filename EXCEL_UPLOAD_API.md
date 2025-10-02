# Excel Upload API for Invoice Data

## Overview
This API allows sellers to upload Excel/CSV files containing invoice data. The system automatically parses the data, groups items by invoice, and saves them to the database.

## API Endpoints

### 1. Upload Excel File
**POST** `/invoice/upload-excel`

Upload an Excel (.xlsx, .xls) or CSV file with invoice data.

**Headers:**
- `Authorization: Bearer <jwt_token>`
- `Content-Type: multipart/form-data`

**Request Body:**
- `file`: Excel/CSV file (max 10MB)

**Response (201):**
```json
{
  "success": true,
  "message": "Successfully processed 3 invoices with 5 items",
  "data": {
    "invoices": [...],
    "items": [...],
    "summary": {
      "totalInvoices": 3,
      "totalItems": 5,
      "totalAmount": 9250.00
    }
  }
}
```

### 2. Get Upload Template
**GET** `/invoice/upload-template`

Get template information and field descriptions for Excel upload.

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Upload template information retrieved successfully",
  "data": {
    "requiredHeaders": [...],
    "fieldDescriptions": {...},
    "sampleData": {...},
    "notes": [...]
  }
}
```

## Excel File Format

### Required Headers
The Excel file must contain these exact column headers:

**Master Data Fields (same for all items in an invoice):**
- `invoiceType` - Type of invoice (e.g., SALES, PURCHASE)
- `invoiceDate` - Date of invoice (YYYY-MM-DD format)
- `buyerNTNCNIC` - Buyer NTN or CNIC number
- `buyerBusinessName` - Buyer business name
- `buyerProvince` - Buyer province/state
- `buyerAddress` - Buyer complete address
- `buyerRegistrationType` - REGISTERED or UNREGISTERED
- `invoiceRefNo` - Unique invoice reference number
- `scenarioId` - Scenario ID (numeric)

**Item Details Fields (can vary for each item):**
- `hsCode` - HS Code for the product
- `productDescription` - Description of the product
- `rate` - Unit rate/price (numeric)
- `uoM` - Unit of measurement (PCS, KG, L, etc.)
- `quantity` - Quantity (numeric)
- `totalValues` - Total value (rate × quantity)
- `valueSalesExcludingST` - Sales value excluding sales tax
- `fixedNotifiedValueOrRetailPrice` - Fixed notified value or retail price
- `salesTaxApplicable` - Yes or No
- `salesTaxWithheldAtSource` - Sales tax withheld at source (numeric)
- `extraTax` - Extra tax amount (numeric)
- `furtherTax` - Further tax amount (numeric)
- `sroScheduleNo` - SRO schedule number (numeric)
- `fedPayable` - FED payable amount (numeric)
- `discount` - Discount amount (numeric)
- `saleType` - Type of sale (Retail, Wholesale, Industrial)
- `sroItemSerialNo` - SRO item serial number

### Sample Data
```csv
invoiceType,invoiceDate,buyerNTNCNIC,buyerBusinessName,buyerProvince,buyerAddress,buyerRegistrationType,invoiceRefNo,scenarioId,hsCode,productDescription,rate,uoM,quantity,totalValues,valueSalesExcludingST,fixedNotifiedValueOrRetailPrice,salesTaxApplicable,salesTaxWithheldAtSource,extraTax,furtherTax,sroScheduleNo,fedPayable,discount,saleType,sroItemSerialNo
SALES,2024-01-15,1234567890123,ABC Trading Company,Sindh,123 Main Street Karachi,REGISTERED,INV-001,1,1234.56,Office Supplies,150.00,PCS,10,1500.00,1500.00,1500.00,Yes,0.00,0.00,0.00,1,0.00,0.00,Retail,001
SALES,2024-01-15,1234567890123,ABC Trading Company,Sindh,123 Main Street Karachi,REGISTERED,INV-001,1,5678.90,Computer Accessories,250.00,PCS,5,1250.00,1250.00,1250.00,Yes,0.00,0.00,0.00,2,0.00,0.00,Retail,002
```

## Data Processing Logic

### 1. Grouping by Invoice
- Rows with the same `invoiceRefNo` are grouped together
- Master data fields must be identical for all items in the same invoice
- Item fields can vary for each item

### 2. Data Validation
- All required headers must be present
- Date format must be YYYY-MM-DD
- Numeric fields must not contain currency symbols or commas
- Boolean fields must be "Yes" or "No"
- File size limit: 10MB

### 3. Database Storage
- Each invoice group creates one `Invoice` record
- Each item creates one `InvoiceItem` record
- Total amount is calculated as sum of all item values
- All operations are wrapped in a database transaction

## Error Handling

### Common Errors
- **400 Bad Request**: Missing file, invalid file type, file too large
- **403 Forbidden**: User is not a seller
- **500 Internal Server Error**: Processing errors, database errors

### Validation Errors
- Missing required headers
- Invalid data formats
- Empty invoice data
- Database constraint violations

## Security Features

1. **Authentication Required**: Only authenticated users can upload
2. **Seller Only**: Only users with `sellerId` can upload invoice data
3. **File Type Validation**: Only Excel and CSV files allowed
4. **File Size Limit**: Maximum 10MB file size
5. **Transaction Safety**: All database operations are atomic

## Usage Examples

### Using cURL
```bash
# Upload Excel file
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@sample-invoice-data.csv" \
  http://localhost:3001/invoice/upload-excel

# Get template information
curl -X GET \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3001/invoice/upload-template
```

### Using JavaScript/Fetch
```javascript
// Upload file
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/invoice/upload-excel', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const result = await response.json();
console.log(result);
```

## Database Schema

### Invoice Table
- `id` (String, Primary Key)
- `sellerId` (Integer, Foreign Key)
- Master data fields (invoiceType, invoiceDate, etc.)
- `totalAmount` (Decimal)
- `status` (Enum: draft, issued, paid, void)
- Timestamps

### InvoiceItem Table
- `id` (Integer, Primary Key, Auto Increment)
- `invoiceId` (String, Foreign Key)
- Item detail fields (hsCode, productDescription, etc.)
- Timestamps

## Performance Considerations

1. **Batch Processing**: Multiple invoices processed in single transaction
2. **Memory Efficient**: File processed in chunks
3. **Database Optimization**: Proper indexing on foreign keys
4. **Error Recovery**: Transaction rollback on any failure

## Testing

Use the provided `sample-invoice-data.csv` file to test the upload functionality. The sample contains:
- 3 different invoices
- 5 total items
- Various data types and formats
- Proper grouping by invoice reference number
