# Reports & Analytics API Documentation

## Overview
The Reports & Analytics API provides comprehensive insights into the digital invoicing platform performance. The API returns different data based on user role - Admin users get platform-wide analytics including top performing sellers, while Seller users get their own analytics with top performing products.

## Endpoint

### GET /api/v1/invoices/reports/analytics

Retrieves comprehensive reports and analytics data based on user role.

#### Headers
- `Authorization: Bearer <token>` (required)

#### Response

### Admin User Response (200 OK)
```json
{
  "success": true,
  "message": "Reports and analytics data retrieved successfully",
  "data": {
    "totalInvoices": {
      "value": 1247,
      "trend": "+12% from last month"
    },
    "totalRevenue": {
      "value": 1542000,
      "trend": "+8% from last month"
    },
    "fbrSuccessRate": {
      "value": 95.3,
      "detail": "1189 of 1247 successful"
    },
    "activeSellers": {
      "value": 5,
      "detail": "+2 new this month"
    },
    "monthlyInvoiceVolume": {
      "subtitle": "Invoice count and revenue trends over the last 6 months",
      "data": [
        {
          "month": "Jan",
          "invoices": 120,
          "revenue": 180000
        },
        {
          "month": "Feb",
          "invoices": 135,
          "revenue": 202500
        },
        {
          "month": "Mar",
          "invoices": 110,
          "revenue": 165000
        },
        {
          "month": "Apr",
          "invoices": 145,
          "revenue": 217500
        },
        {
          "month": "May",
          "invoices": 160,
          "revenue": 240000
        },
        {
          "month": "Jun",
          "invoices": 175,
          "revenue": 262500
        }
      ]
    },
    "topPerformers": {
      "subtitle": "Sellers with highest invoice volume and revenue",
      "data": [
        {
          "name": "ABC Company",
          "invoices": 245,
          "revenue": 367500,
          "successRate": 96
        },
        {
          "name": "XYZ Trading",
          "invoices": 189,
          "revenue": 283500,
          "successRate": 94
        },
        {
          "name": "Tech Solutions",
          "invoices": 156,
          "revenue": 234000,
          "successRate": 92
        },
        {
          "name": "Global Imports",
          "invoices": 134,
          "revenue": 201000,
          "successRate": 89
        },
        {
          "name": "Local Retail",
          "invoices": 98,
          "revenue": 147000,
          "successRate": 91
        }
      ]
    }
  },
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

### Seller User Response (200 OK)
```json
{
  "success": true,
  "message": "Reports and analytics data retrieved successfully",
  "data": {
    "totalInvoices": {
      "value": 245,
      "trend": "+15% from last month"
    },
    "totalRevenue": {
      "value": 367500,
      "trend": "+12% from last month"
    },
    "fbrSuccessRate": {
      "value": 96.0,
      "detail": "235 of 245 successful"
    },
    "activeSellers": null,
    "monthlyInvoiceVolume": {
      "subtitle": "Invoice count and revenue trends over the last 6 months",
      "data": [
        {
          "month": "Jan",
          "invoices": 35,
          "revenue": 52500
        },
        {
          "month": "Feb",
          "invoices": 42,
          "revenue": 63000
        },
        {
          "month": "Mar",
          "invoices": 38,
          "revenue": 57000
        },
        {
          "month": "Apr",
          "invoices": 45,
          "revenue": 67500
        },
        {
          "month": "May",
          "invoices": 52,
          "revenue": 78000
        },
        {
          "month": "Jun",
          "invoices": 58,
          "revenue": 87000
        }
      ]
    },
    "topPerformers": {
      "subtitle": "Products with highest sales volume and revenue",
      "data": [
        {
          "name": "Laptop Computer",
          "quantity": 45,
          "revenue": 135000
        },
        {
          "name": "Office Chair",
          "quantity": 32,
          "revenue": 48000
        },
        {
          "name": "Wireless Mouse",
          "quantity": 28,
          "revenue": 14000
        },
        {
          "name": "Monitor Stand",
          "quantity": 25,
          "revenue": 12500
        },
        {
          "name": "USB Cable",
          "quantity": 22,
          "revenue": 2200
        }
      ]
    }
  },
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Failed to retrieve reports and analytics data. Please try again later.",
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

## Data Structure Details

### Key Performance Indicators (KPIs)

#### Total Invoices
- **Admin**: Total invoices across all sellers
- **Seller**: Total invoices for the specific seller
- **Trend**: Percentage change from previous month

#### Total Revenue
- **Admin**: Total revenue across all sellers (from submitted invoices)
- **Seller**: Total revenue for the specific seller (from submitted invoices)
- **Trend**: Percentage change from previous month

#### FBR Success Rate
- **Admin**: Overall platform success rate for FBR submissions
- **Seller**: Seller-specific success rate for FBR submissions
- **Detail**: Shows successful vs total processed invoices

#### Active Sellers (Admin Only)
- **Value**: Total number of active sellers on the platform
- **Detail**: Number of new sellers added this month

### Monthly Invoice Volume
- **Period**: Last 6 months of data
- **Data Points**: Invoice count and revenue for each month
- **Format**: Month abbreviation (Jan, Feb, etc.)

### Top Performers

#### For Admin Users
- **Type**: Top performing sellers
- **Metrics**: Invoice count, revenue, and success rate
- **Sorting**: By invoice volume (highest first)
- **Limit**: Top 5 sellers

#### For Seller Users
- **Type**: Top performing products
- **Metrics**: Quantity sold and revenue generated
- **Sorting**: By quantity sold (highest first)
- **Limit**: Top 5 products

## Role-Based Data Filtering

### Admin Users
- Access to platform-wide data
- Can see all sellers and their performance
- Gets aggregated metrics across all sellers
- Includes active sellers count and new sellers this month

### Seller Users
- Access only to their own data
- Cannot see other sellers' information
- Gets product-level analytics instead of seller analytics
- All metrics filtered by their seller ID

## Usage Examples

### cURL
```bash
curl -X GET "http://localhost:3001/api/v1/invoices/reports/analytics" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JavaScript (Fetch)
```javascript
const response = await fetch('/api/v1/invoices/reports/analytics', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});

const data = await response.json();
if (data.success) {
  console.log('Total Invoices:', data.data.totalInvoices.value);
  console.log('Total Revenue:', data.data.totalRevenue.value);
  console.log('FBR Success Rate:', data.data.fbrSuccessRate.value);
  
  // Check if user is admin or seller
  if (data.data.activeSellers) {
    console.log('Active Sellers:', data.data.activeSellers.value);
    console.log('Top Sellers:', data.data.topPerformers.data);
  } else {
    console.log('Top Products:', data.data.topPerformers.data);
  }
}
```

### Frontend Integration Example
```javascript
// React component example
const ReportsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/v1/invoices/reports/analytics', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setAnalytics(data.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="reports-dashboard">
      <h1>Reports & Analytics</h1>
      
      {/* KPI Cards */}
      <div className="kpi-cards">
        <div className="kpi-card">
          <h3>Total Invoices</h3>
          <div className="value">{analytics.totalInvoices.value}</div>
          <div className="trend">{analytics.totalInvoices.trend}</div>
        </div>
        
        <div className="kpi-card">
          <h3>Total Revenue</h3>
          <div className="value">Rs {analytics.totalRevenue.value.toLocaleString()}</div>
          <div className="trend">{analytics.totalRevenue.trend}</div>
        </div>
        
        <div className="kpi-card">
          <h3>FBR Success Rate</h3>
          <div className="value">{analytics.fbrSuccessRate.value}%</div>
          <div className="detail">{analytics.fbrSuccessRate.detail}</div>
        </div>
        
        {analytics.activeSellers && (
          <div className="kpi-card">
            <h3>Active Sellers</h3>
            <div className="value">{analytics.activeSellers.value}</div>
            <div className="detail">{analytics.activeSellers.detail}</div>
          </div>
        )}
      </div>

      {/* Monthly Volume */}
      <div className="monthly-volume">
        <h3>{analytics.monthlyInvoiceVolume.subtitle}</h3>
        {analytics.monthlyInvoiceVolume.data.map(month => (
          <div key={month.month} className="month-item">
            <span className="month">{month.month}:</span>
            <span>{month.invoices} invoices, Rs {month.revenue.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Top Performers */}
      <div className="top-performers">
        <h3>{analytics.topPerformers.subtitle}</h3>
        {analytics.topPerformers.data.map((item, index) => (
          <div key={index} className="performer-item">
            <span className="rank">{index + 1}.</span>
            <span className="name">{item.name}:</span>
            {item.invoices ? (
              <span>{item.invoices} invoices, Rs {item.revenue.toLocaleString()}, {item.successRate}% success</span>
            ) : (
              <span>{item.quantity} units, Rs {item.revenue.toLocaleString()}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Features

- **Role-Based Access**: Different data for Admin vs Seller users
- **Real-Time Trends**: Month-over-month percentage changes
- **Comprehensive Metrics**: Invoice count, revenue, success rates
- **Historical Data**: 6 months of monthly trends
- **Top Performers**: Sellers (Admin) or Products (Seller)
- **Performance Analytics**: Success rates and detailed breakdowns
- **Responsive Design**: Data structured for easy frontend consumption

## Performance Considerations

- **Optimized Queries**: Uses efficient database queries with proper indexing
- **Caching Ready**: Response structure supports frontend caching
- **Role Filtering**: Database queries filtered by user role for security
- **Aggregated Data**: Pre-calculated metrics to reduce response time

## Security

- **Authentication Required**: All requests must include valid JWT token
- **Role-Based Data**: Users only see data they're authorized to access
- **Data Isolation**: Seller users cannot access other sellers' data
- **Input Validation**: All parameters validated before processing

## Notes

- All monetary values are in Pakistani Rupees (Rs)
- Success rates are calculated based on submitted vs invalid invoices
- Monthly trends compare current month with previous month
- Top performers are limited to 5 entries for performance
- The API automatically detects user role from JWT token
- All timestamps are in ISO 8601 format
