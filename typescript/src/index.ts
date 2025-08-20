#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Client } from "@adyen/api-library";
import { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { tools } from "./tools/tools.js";
import { Environment, getAdyenConfig } from "./configurations/configurations";

const APPLICATION_NAME = "adyen-mcp-server";
const APP_NAME = "Adyen MCP";
const APP_VERSION = "0.2.2";

async function main() {
  const adyenConfig = getAdyenConfig();

  const options = {
    apiKey: adyenConfig.adyenApiKey,
    environment: adyenConfig.env as Environment
  };

  const adyenClient = new Client(options);
  adyenClient.setApplicationName(APPLICATION_NAME + " " + APP_VERSION);
  
  if (options.environment === Environment.LIVE) {
    const livePrefix = adyenConfig.livePrefix;
    adyenClient.setEnvironment(options.environment, livePrefix);
  }

  const server = new McpServer({
    name: APP_NAME,
    version: APP_VERSION,
  });

  for (const tool of tools) {
    server.tool(
      tool.name,
      tool.description,
      tool.arguments.shape,
      async (args: any, _extra: RequestHandlerExtra <any, any>) => {
        const result = await tool.invoke(adyenClient, args);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result),
            },
          ],
        };
      }
    );
  }
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

try {
  main();
} catch (e) {
  console.error("An error occurred during main execution of Adyen MCP:", e);
  process.exit(1);
}
