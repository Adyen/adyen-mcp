## Adyen MCP Server

The Adyen Model Context Protocol server allows you to integrate with Adyen APIs through LLMs function calling utilizing various Clients.

### Pilot
Navigate to 



### Contributing

We strongly encourage you to contribute to our repository. Find out more in our contribution guidelines

### Usage
To run to the MCP server via `npx` you can execute:

```
npx -y @adyen/mcp --tools=all --adyenApiKey=<YOUR-ADYEN-API-KEY> --env=TEST
```

Optionally, if the environment is LIVE then you must also provide your Merchant URL, for example:

```
npx -y @adyen/mcp --adyenApiKey=<YOUR-ADYEN-API-KEY> --env=LIVE --prefixurl=<YOUR-PREFIX-URL>
```

To run the server, you need a webservice user with the following roles: 
* Management API - Accounts Read
* Management API - Payment methods Read
* Checkout Webservice Role
* Merchant PAL Webservice Role

Adyen recommends creating a new webservice user and generating a new API key for the purposes of this application.
Only use the new user’s API key for the MCP application and limit the roles to match the tools you will be using. 


### License
MIT license. For more information, see the LICENSE file.
