The Adyen MCP server uses tools to define specific actions the LLM client can take, such as creating a payment link or refunding a payment. Tools are a way to connect the language in your users' prompts to specific functions. A tool is comprised of its name, description, input arguments, and an invoke function to execute. You can extend the functionality of your Adyen MCP implementation by creating new tools. 

## How it works
To extend your Adyen MCP server:

1.  **[Define the tool's interface](#create-the-tool-file-structure)**. Define constant values that the LLM will use to understand the tool. This includes its `name`, `description`, and the `arguments` the tool's function accepts.
2.  **[Implement the tool's logic](#implement-the-invoke-function)**. Write the tool's functionality and logic inside a function, which is invoked when the you [use the MCP](https://docs.adyen.com/development-resources/mcp-server#use).
3.  **[Register the tool](#register-the-tool)**. Import your new tool object into the main `tools.ts` file and add it to the exported array to make it available to the server.
4.  **[Test the tool](#test-the-tool)**. Compile the new code and run the server to ensure the tool works as expected.

## Create a new tool
To illustrate the process, create an example tool named `get_account_holder` that returns information about an account holder from your Balance Platform.

### 1. Create the tool file structure {#create-the-tool-file-structure}
First, decide on a category for your tool. For this example, we'll use the Configuration category because the the tool will use the Adyen Configuration API.

Create a new directory `Configuration/accountHolders` inside `typescript/src/tools/`. Inside this new directory, create two files: **constants.ts** and **index.ts**.

```text
Configuration/
├─ accountHolders/
│  ├─ constants.ts
│  ├─ index.ts
```

### 2. Define the tool interface {#define-the-tool-interface}
For the LLM to understand what the tool does, what types of values it can accept, and when to use it, write a detailed constants.ts file that exports unique name and description constants. 

In **constants.ts**, add the tool's name and description.

- **Name**: This is the name of the tool that is displayed when your LLM client uses it. It can be used to call a specific tool in a chat, for example. 
- **Description**: This is the description of the tool that describes what it does, which arguments it takes, and what it returns. You can also add notes to the description to give the LLM client more context.


```ts
// typescript/src/tools/Configuration/accountHolders/constants.ts
export const GET_ACCOUNT_HOLDER_NAME = "get_account_holder";
export const GET_ACCOUNT_HOLDER_DESCRIPTION = `Returns an account holder's details and capabilities.

    Args:
        id (str): The unique identifier for the account holder

    Returns:
        str: The raw response from the Adyen API containing the AccountHolder object.

    Notes:
        - The 'id' parameter is the path parameter and is mandatory. If necessary, ask the user to provide this data.

    Examples:
        get_account_holder({id: "AHXXXXXXXXXXXXXXXXXXXXXXXXX"})
        # Returns the raw response from the Adyen API, containing the AccountHolder object.`;
```


Next, define the Typescript schema using Zod in **index.ts**. This ensures that the tool's arguments are strictly typed and validated, and creates a reliable interface for the LLM to interact with. 

This tool requires an `id`, so we use a `z.string()` in its `ZodRawShape`.

```ts
  // typescript/src/tools/Configuration/accountHolders/index.ts
  import { z } from "zod";
  import { Client, BalancePlatformAPI } from "@adyen/api-library";
  import { Tool } from "../../types";
  import { GET_ACCOUNT_HOLDER_NAME, GET_ACCOUNT_HOLDER_DESCRIPTION } from "./constants";

  // Define the arguments schema.
  const getAccountHolderRequestShape: z.ZodRawShape = {
    id: z.string()
  };

  const {hint:The final Zod object that is used later when you register the tool}getAccountHolderObject{/hint} = z.object(getAccountHolderRequestShape);
``` 

### 3. Implement the invoke function {#implement-the-invoke-function}
The `invoke` function contains the logic of the tool. It receives the Adyen client and the parsed arguments. For this tool, it will use the `BalancePlatformAPI`.

Add the following to **index.ts** after the schema definition:

```ts
  // ... (imports and schema from previous step)

  const getAccountHolder = async (
    client: Client,
    getAccountHolderRequest: z.infer<typeof getAccountHolderObject>
  ) => {
    const {id} = getAccountHolderRequest;
    const balancePlatformApi = new BalancePlatformAPI(client)
    try {
      return await balancePlatformApi.AccountHoldersApi.getAccountHolder(id)
    } catch (e) {
      return "Failed to get account holder. Error: " + JSON.stringify(e);
    }
  }
```

### 4. Create the tool object {#create-the-tool-object}
Assemble all parts into a `Tool` object that conforms to the `Tool` interface from `types.ts`.

Add the following to **index.ts** after the function:

```ts
  // ... (imports, schema, and invoke function from previous steps)

  export const getAccountHolderTool: Tool = {
    name: GET_ACCOUNT_HOLDER_NAME,
    description: GET_ACCOUNT_HOLDER_DESCRIPTION,
    arguments: getAccountHolderObject,
    invoke: getAccountHolder,
  };
```

### 5. Register the tool {#register-the-tool}
Make the MCP server aware of the new tool.

Open `typescript/src/tools/tools.ts` and add the new tool to the `tools` array:

```ts
// typescript/src/tools/tools.ts

import { createPaymentLinkTool, getPaymentLinkTool, updatePaymentLinkTool } from "./paymentLinks";
import { Tool } from "./types";
import { cancelPaymentTool, refundPaymentTool } from "./modifications";
import { createPaymentSessionTool, getPaymentMethodsTool, getPaymentSessionTool } from "./payments";
import { getMerchantAccountsTool, listMerchantAccountsTool } from "./management";
import { getAccountHolderTool } from "./Configuration/accountHolders"; // 1. Import your new tool

export const tools: Tool[] = [
  createPaymentLinkTool,
  getPaymentLinkTool,
  refundPaymentTool,
  createPaymentSessionTool,
  updatePaymentLinkTool,
  getPaymentSessionTool,
  getPaymentMethodsTool,
  listMerchantAccountsTool,
  getMerchantAccountsTool,
  cancelPaymentTool,
  getAccountHolderTool, // 2. Add your new tool to the array
];
```

## Test the new tool {#test-the-tool}
To see the new tool in action, compile the TypeScript code and run the server.

1.  Build the code:
    ```bash
    npm run build
    ```

2.  Start the server:
    ```bash
    npm run start
    ```

The server starts with the new `get_account_holder` tool available.
