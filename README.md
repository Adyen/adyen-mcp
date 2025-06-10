## Adyen MCP Server

The Adyen Model Context Protocol (MCP) server allows you to integrate with Adyen APIs through LLMs function calling utilizing various Clients. It currently supports the following tools.

1. CheckoutAPI - Sessions
   - Create a /sessions payment request
   - Get the result of a payment session
   - Get the available payment methods
2. CheckoutAPI - Payment Links
   - Gets the status of a payment link
   - Create a payment link
   - Updates a payment link (force expiry of the link)
4. Modifications API - Cancel / Refund 
   - Cancels an authorized payment
   - Refunds a captured payment
5. Management API
   - Gets a list of merchant accounts for your company account


### Usage
1. Run to the MCP server via `npx`, command:

```
npx -y @adyen/mcp --adyenApiKey=YOUR_ADYEN_API_KEY --env=TEST
```

_Optionally_, if the environment is LIVE then you must also provide your Merchant URL, for example:

```
npx -y @adyen/mcp --adyenApiKey=YOUR_ADYEN_API_KEY --env=LIVE --livePrefix=YOUR_PREFIX_URL
```

2. Chat with the MCP server (in `Agent` mode) to allow it to perform actions.
   * _Note:_ You'll have to confirm the action after your prompt.


**Note:** To run certain functionality (tools) in the mcp-server, you need a webservice user with the following roles: 
* Management API - Accounts Read
* Management API - Payment methods Read
* Checkout Webservice Role
* Merchant PAL Webservice Role

Adyen recommends creating a new webservice user and generating a new API key for the purpose of this application.
Only use the new user’s API key for the MCP application and limit the roles to match the tools you'll be using. 



### License
MIT license. For more information, see the LICENSE file.


### Contributing
We strongly encourage you to contribute to our repository. Find out more in our contribution guidelines. If you'd like to run this in [Codespaces, follow this guide](/CODESPACES_README.md).


### Support
If you have a feature request, or spotted a bug or a technical problem, create a GitHub issue. For other questions, contact: devrel@adyen.com
