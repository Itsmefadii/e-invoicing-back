#!/bin/bash

# HS Code API Test Examples with Bearer Token
# Bearer Token: 5b0891e4-8216-3f78-be52-9e70b054393a

BASE_URL="http://localhost:3001/api/v1/system-configs"
TOKEN="5b0891e4-8216-3f78-be52-9e70b054393a"

echo "🚀 HS Code API Test Examples"
echo "=============================="
echo ""

# 1. Populate HS Codes from FBR API
echo "1️⃣ Populating HS Codes from FBR API..."
curl -X POST \
  "$BASE_URL/hs-codes/populate-from-fbr" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || cat

echo ""
echo ""

# 2. Get All HS Codes
echo "2️⃣ Getting All HS Codes..."
curl -X GET \
  "$BASE_URL/hs-codes" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || cat

echo ""
echo ""

# 3. Get HS Code by ID (replace 1 with actual ID)
echo "3️⃣ Getting HS Code by ID (replace 1 with actual ID)..."
curl -X GET \
  "$BASE_URL/hs-codes/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || cat

echo ""
echo ""

# 4. Create New HS Code
echo "4️⃣ Creating New HS Code..."
curl -X POST \
  "$BASE_URL/hs-codes" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hsCode": "9999.9999",
    "description": "TEST HS CODE - FOR TESTING PURPOSES ONLY"
  }' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || cat

echo ""
echo ""

# 5. Update HS Code (replace 1 with actual ID)
echo "5️⃣ Updating HS Code (replace 1 with actual ID)..."
curl -X PUT \
  "$BASE_URL/hs-codes/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hsCode": "9999.9999",
    "description": "UPDATED TEST HS CODE - FOR TESTING PURPOSES ONLY"
  }' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || cat

echo ""
echo ""

# 6. Delete HS Code (replace 1 with actual ID)
echo "6️⃣ Deleting HS Code (replace 1 with actual ID)..."
curl -X DELETE \
  "$BASE_URL/hs-codes/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || cat

echo ""
echo "🎉 All examples completed!"
