# Azure Region Testing Script
# Run this to find available regions for your subscription

# Test different regions for Azure for Students
$regions = @(
    "West Europe",
    "North Europe", 
    "Canada Central",
    "Southeast Asia",
    "East Asia",
    "Australia East",
    "UK South",
    "Brazil South",
    "Central India",
    "Japan East"
)

Write-Host "Testing Azure regions for your subscription..." -ForegroundColor Green

foreach ($region in $regions) {
    Write-Host "Testing region: $region" -ForegroundColor Yellow
    try {
        # Test if we can create resources in this region
        az group create --name "test-rg-$($region.Replace(' ','').ToLower())" --location $region --only-show-errors 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ SUCCESS: $region is available!" -ForegroundColor Green
            # Clean up test resource group
            az group delete --name "test-rg-$($region.Replace(' ','').ToLower())" --yes --no-wait 2>$null
        }
    } catch {
        Write-Host "❌ FAILED: $region not available" -ForegroundColor Red
    }
}

Write-Host "`nTesting complete. Use any region marked with ✅" -ForegroundColor Cyan