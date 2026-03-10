## Adyen MCP Server - Alpha

The [Adyen Model Context Protocol (MCP) server](https://docs.adyen.com/development-resources/mcp-server/) allows you to integrate with Adyen APIs through LLMs function calling utilizing various clients. It currently supports the following tools. Read more on our [Blog - Part 1](https://www.adyen.com/knowledge-hub/mcp-release).

1. CheckoutAPI - Sessions
   - Creates a /sessions payment request - POST [`/sessions`](https://docs.adyen.com/api-explorer/Checkout/71/post/sessions)
   - Gets the result of a payment session - GET [`/sessions/{sessionId}`](https://docs.adyen.com/api-explorer/Checkout/71/get/sessions/(sessionId))
   - Gets the available payment methods - POST [`/paymentMethods`](https://docs.adyen.com/api-explorer/Checkout/71/post/paymentMethods)
2. CheckoutAPI - Payment Links
   - Creates a payment link - POST [`/paymentLinks`](https://docs.adyen.com/api-explorer/Checkout/71/post/paymentLinks)
   - Gets the status of a payment link - GET [`/paymentLinks/{linkId}`](https://docs.adyen.com/api-explorer/Checkout/71/get/paymentLinks/(linkId))
   - Updates a payment link (force expiry of the link) - PATCH [`/paymentLinks/{linkId}`](https://docs.adyen.com/api-explorer/Checkout/71/patch/paymentLinks/(linkId))
3. Checkout API - Modifications
   - Cancels an authorized payment - POST [`/payments/{paymentPspReference}/cancels`](https://docs.adyen.com/api-explorer/Checkout/latest/post/payments/(paymentPspReference)/cancels)
   - Refunds a captured payment - POST [`/payments/{paymentPspReference}/refunds`](https://docs.adyen.com/api-explorer/Checkout/latest/post/payments/(paymentPspReference)/refunds)
4. Management API - Accounts
   - Gets a list of merchant accounts for your company account - GET [`/merchants`](https://docs.adyen.com/api-explorer/Management/latest/get/merchants)
5. Management API - Terminals
   - Gets a list of terminals - GET [`/terminals`](https://docs.adyen.com/api-explorer/Management/3/get/terminals)
   - Reassigns a terminal - POST [`/terminals/{terminalId}/reassign`](https://docs.adyen.com/api-explorer/Management/3/post/terminals/(terminalId)/reassign)
   - Gets a list of Android apps - GET [`/companies/{companyId}/androidApps`](https://docs.adyen.com/api-explorer/Management/3/get/companies/(companyId)/androidApps)
   - Gets Android app details - GET [`/companies/{companyId}/androidApps/{id}`](https://docs.adyen.com/api-explorer/Management/3/get/companies/(companyId)/androidApps/(id))
   - Gets a list of Android certificates - GET [`/companies/{companyId}/androidCertificates`](https://docs.adyen.com/api-explorer/Management/3/get/companies/(companyId)/androidCertificates)
   - Creates a terminal action - POST [`/terminals/scheduleActions`](https://docs.adyen.com/api-explorer/Management/3/post/terminals/scheduleActions)
   - Gets a list of terminal actions - GET [`/companies/{companyId}/terminalActions`](https://docs.adyen.com/api-explorer/Management/3/get/companies/(companyId)/terminalActions)
   - Gets terminal settings - GET [`/companies/{companyId}/terminalSettings`](https://docs.adyen.com/api-explorer/Management/3/get/companies/(companyId)/terminalSettings)/ GET [`/merchants/{merchantId}/terminalSettings`](https://docs.adyen.com/api-explorer/Management/3/get/merchants/(merchantId)/terminalSettings)/ GET [`/merchants/{merchantId}/stores/{reference}/terminalSettings`](https://docs.adyen.com/api-explorer/Management/3/get/merchants/(merchantId)/stores/(reference)/terminalSettings)/ GET [`/terminals/{terminalId}/terminalSettings`](https://docs.adyen.com/api-explorer/Management/3/get/terminals/(terminalId)/terminalSettings)
   - Updates terminal settings - PATCH [`/companies/{companyId}/terminalSettings`](https://docs.adyen.com/api-explorer/Management/3/patch/companies/(companyId)/terminalSettings)/ PATCH [`/merchants/{merchantId}/terminalSettings`](https://docs.adyen.com/api-explorer/Management/3/patch/merchants/(merchantId)/terminalSettings)/ PATCH [`/merchants/{merchantId}/stores/{reference}/terminalSettings`](https://docs.adyen.com/api-explorer/Management/3/patch/merchants/(merchantId)/stores/(reference)/terminalSettings)/ PATCH [`/terminals/{terminalId}/terminalSettings`](https://docs.adyen.com/api-explorer/Management/3/patch/terminals/(terminalId)/terminalSettings)
6. Management API - Webhooks
   - List all webhooks - GET [`/companies/{companyId}/webhooks`](https://docs.adyen.com/api-explorer/Management/3/get/companies/(companyId)/webhooks)
   - List all webhooks - GET [`/merchants/{merchantId}/webhooks`](https://docs.adyen.com/api-explorer/Management/3/get/merchants/(merchantId)/webhooks)
   - Get a webhook - GET [`/companies/{companyId}/webhooks/{webhookId}`](https://docs.adyen.com/api-explorer/Management/3/get/companies/(companyId)/webhooks/(webhookId))
   - Get a webhook - GET [`/merchants/{merchantId}/webhooks/{webhookId}`](https://docs.adyen.com/api-explorer/Management/3/get/merchants/(merchantId)/webhooks/(webhookId))


### Usage
* Run the MCP server via `npx` with the following command:

```
npx -y @adyen/mcp --adyenApiKey=YOUR_ADYEN_API_KEY --env=TEST
```

If you are using the LIVE environment then you must also provide your [live URL prefix](https://docs.adyen.com/development-resources/live-endpoints/#live-url-prefix), for example:

```
npx -y @adyen/mcp --adyenApiKey=YOUR_ADYEN_API_KEY --env=LIVE --livePrefix=YOUR_PREFIX_URL
```

We advise to only run a subset of tools required for your particular use case:
```
npx -y @adyen/mcp --adyenApiKey=YOUR_ADYEN_API_KEY --env=TEST --tools=list_all_company_webhooks,list_all_merchant_webhooks
```

Example usage in `.vscode`:
```json
{
  "servers": {
    "adyen-mcp-server": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@adyen/mcp", "--adyenApiKey=YOUR_ADYEN_API_KEY", "--env=TEST"],
      "env": {
        "ADYEN_API_KEY": "${ADYEN_API_KEY}"
      }
    }
  }
}
```

**Note:** To run certain functionality (tools) in the mcp-server, you need a webservice user with the following roles: 
* Management API - Accounts Read
* Management API - Payment methods Read
* Checkout Webservice Role
* Merchant PAL Webservice Role
* Management API - Terminals read
* Management API — Assign Terminal
* Management API — Terminal actions read
* Management API — Terminal actions read and write
* Management API — Android files read
* Management API — Terminal settings read
* Management API — Terminal settings read and write
* Management API — Webhooks read

Adyen recommends creating a new webservice user and generating a new API key for the purpose of this application.
Only use the new user’s API key for the MCP application and limit the roles to match the tools you'll be using. 



### License
MIT license. For more information, see the LICENSE file.


### Contributing
We strongly encourage you to contribute to our repository. Find out more in our contribution guidelines. If you'd like to run this in [Codespaces, follow this guide](/CODESPACES_README.md).


### Support
If you have a feature request, or spotted a bug or a technical problem, create a GitHub issue. For other questions, contact: devrel@adyen.com
