# HS Code API Test Examples with Bearer Token (PowerShell)
# Bearer Token: 5b0891e4-8216-3f78-be52-9e70b054393a

$BaseUrl = "http://localhost:3001/api/v1/system-configs"
$Token = "5b0891e4-8216-3f78-be52-9e70b054393a"
$Headers = @{
    "Authorization" = "Bearer $Token"
    "Content-Type" = "application/json"
}

Write-Host "🚀 HS Code API Test Examples" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""

# 1. Populate HS Codes from FBR API
Write-Host "1️⃣ Populating HS Codes from FBR API..." -ForegroundColor Yellow
try {
    $Response = Invoke-RestMethod -Uri "$BaseUrl/hs-codes/populate-from-fbr" -Method POST -Headers $Headers
    $Response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 2. Get All HS Codes
Write-Host "2️⃣ Getting All HS Codes..." -ForegroundColor Yellow
try {
    $Response = Invoke-RestMethod -Uri "$BaseUrl/hs-codes" -Method GET -Headers $Headers
    Write-Host "Total HS Codes: $($Response.data.Count)" -ForegroundColor Cyan
    if ($Response.data.Count -gt 0) {
        Write-Host "First 3 HS Codes:" -ForegroundColor Cyan
        $Response.data | Select-Object -First 3 | ForEach-Object {
            Write-Host "  $($_.hsCode) - $($_.description.Substring(0, [Math]::Min(50, $_.description.Length)))..." -ForegroundColor White
        }
    }
    $Response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 3. Get HS Code by ID (replace 1 with actual ID)
Write-Host "3️⃣ Getting HS Code by ID (replace 1 with actual ID)..." -ForegroundColor Yellow
try {
    $Response = Invoke-RestMethod -Uri "$BaseUrl/hs-codes/1" -Method GET -Headers $Headers
    $Response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 4. Create New HS Code
Write-Host "4️⃣ Creating New HS Code..." -ForegroundColor Yellow
$NewHsCode = @{
    hsCode = "9999.9999"
    description = "TEST HS CODE - FOR TESTING PURPOSES ONLY"
} | ConvertTo-Json

try {
    $Response = Invoke-RestMethod -Uri "$BaseUrl/hs-codes" -Method POST -Headers $Headers -Body $NewHsCode
    $Response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 5. Update HS Code (replace 1 with actual ID)
Write-Host "5️⃣ Updating HS Code (replace 1 with actual ID)..." -ForegroundColor Yellow
$UpdateData = @{
    hsCode = "9999.9999"
    description = "UPDATED TEST HS CODE - FOR TESTING PURPOSES ONLY"
} | ConvertTo-Json

try {
    $Response = Invoke-RestMethod -Uri "$BaseUrl/hs-codes/1" -Method PUT -Headers $Headers -Body $UpdateData
    $Response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 6. Delete HS Code (replace 1 with actual ID)
Write-Host "6️⃣ Deleting HS Code (replace 1 with actual ID)..." -ForegroundColor Yellow
try {
    $Response = Invoke-RestMethod -Uri "$BaseUrl/hs-codes/1" -Method DELETE -Headers $Headers
    $Response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "🎉 All examples completed!" -ForegroundColor Green
