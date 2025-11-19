## Adyen MCP Server

The Adyen Model Context Protocol server allows you to integrate with Adyen APIs through LLMs function calling utilizing various Clients. It currently supports the following tools:

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
5. Management API - Accounts
   - Gets a list of merchant accounts for your company account
6. Management API - Terminals
   - Get a list of terminals
   - Reassign a terminal
   - Get Android app details
   - Get a list of Android apps
   - Get a list of Android certificates
   - Create a terminal action
   - Get a list of terminal actions
   - Get terminal settings
   - Update terminal settings
7. Configuration API - Account Holders
   - Get account holder details and its capability settings.
8. Legal entity management API - Legal entities and onboarding links
   - Get legal entity details and its KYC information. 
   - Create an onboarding link for a legal entity. 


### Usage
To run to the MCP server via `npx` you can execute:

```
npx -y @adyen/mcp --adyenApiKey=YOUR_ADYEN_API_KEY --env=TEST
```

Optionally, if the environment is LIVE then you must also provide your Merchant URL, for example:

```
npx -y @adyen/mcp --adyenApiKey=YOUR_ADYEN_API_KEY --env=LIVE --livePrefix=YOUR_PREFIX_URL
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

Adyen recommends creating a new webservice user and generating a new API key for the purpose of this application.
Only use the new user’s API key for the MCP application and limit the roles to match the tools you'll be using. 

### License
MIT license. For more information, see the LICENSE file.


### Contributing
We strongly encourage you to contribute to our repository. Find out more in our contribution guidelines


### Support
If you have a feature request, or spotted a bug or a technical problem, create a GitHub issue. For other questions, contact: devrel@adyen.com
