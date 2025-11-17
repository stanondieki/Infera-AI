# Azure Support Request Template

**Issue Type**: Subscription Management / Policy Exception Request
**Severity**: Medium
**Subscription ID**: c207b190-28ed-43a4-ae5b-735df021e6ba

## Subject
RequestDisallowedByAzure Error - Unable to Create App Service Plan (B1) for Production Deployment

## Description

I am unable to create Azure App Service resources for a production Node.js application deployment due to policy restrictions. I have upgraded from Azure for Students to a paid subscription and need to deploy a B1 (Basic) App Service Plan, but I'm getting RequestDisallowedByAzure errors in multiple regions.

**What I'm trying to create:**
- Resource Group: InferaAI-Production-RG  
- App Service Plan: B1 Basic tier (~$13/month)
- Web App: Node.js 18 LTS application
- Region: West Europe (or any supported region)

**Business Need:**
This is for a production AI training platform (Infera AI) that requires a reliable backend API. I need the B1 tier for performance and SSL support for a live application with real users.

## Error Details

**Deployment Name**: Microsoft.Web-WebApp-Portal-e79c0524-a790
**Location Attempted**: East US (also tried West Europe via CLI)
**Timestamp**: 2025-11-17T12:19:36.092Z

**Full Error JSON:**
```json
{
  "deploymentStatusCode": -1,
  "stage": 6,
  "expected": true,
  "error": {
    "code": "InvalidTemplateDeployment",
    "details": [
      {
        "code": "RequestDisallowedByAzure",
        "target": "inferaai-backend",
        "message": "Resource 'inferaai-backend' was disallowed by Azure: This policy maintains a set of best available regions where your subscription can deploy resources. The objective of this policy is to ensure that your subscription has full access to Azure services with optimal performance. Should you need additional or different regions, contact support.."
      },
      {
        "code": "RequestDisallowedByAzure",
        "target": "ASP-InferaAIProductionRG-a86d",
        "message": "Resource 'ASP-InferaAIProductionRG-a86d' was disallowed by Azure: This policy maintains a set of best available regions where your subscription can deploy resources. The objective of this policy is to ensure that your subscription has full access to Azure services with optimal performance. Should you need additional or different regions, contact support.."
      },
      {
        "code": "RequestDisallowedByAzure",
        "target": "DefaultWorkspace-c207b190-28ed-43a4-ae5b-735df021e6ba-WEU",
        "message": "Resource 'DefaultWorkspace-c207b190-28ed-43a4-ae5b-735df021e6ba-WEU' was disallowed by Azure: This policy maintains a set of best available regions where your subscription can deploy resources. The objective of this policy is to ensure that your subscription has full access to Azure services with optimal performance. Should you need additional or different regions, contact support.."
      }
    ],
    "message": "The template deployment failed with multiple errors. Please see details for more information."
  },
  "subscriptionId": "c207b190-28ed-43a4-ae5b-735df021e6ba",
  "resourceGroupName": "InferaAI-Production-RG",
  "location": "eastus"
}
```

## Regions Tested
I have confirmed that I can create Resource Groups successfully in these regions:
- West Europe ✅
- North Europe ✅  
- Canada Central ✅
- Southeast Asia ✅
- East Asia ✅
- Australia East ✅
- UK South ✅
- Brazil South ✅
- Central India ✅
- Japan East ✅

However, App Service Plans fail in all regions tested.

## What I Need

Please provide one of the following solutions:

1. **Policy Exception**: Grant permission to create App Service Plans (B1 tier) in West Europe or another recommended region for my subscription
2. **Alternative Guidance**: Recommend specific regions or subscription modifications that would allow B1 App Service creation
3. **Escalation**: If this requires subscription-level changes, please escalate to the appropriate team

## Additional Information
- I have a payment method configured and am willing to pay for B1 resources
- This is for a legitimate business application, not testing
- GitHub repository: https://github.com/stanondieki/Infera-AI
- I need this resolved to deploy a production backend API

Thank you for your assistance. Please let me know if you need any additional information.