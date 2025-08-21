import { z } from "zod";
import { Client, ManagementAPI } from "@adyen/api-library";
import { Tool } from "../types"; // Adjust path to your Tool type definition

// The generic factory function to create any tool using ManagementAPI
export function createTool<T extends z.ZodRawShape>(config: {
  name: string;
  description: string;
  schema: T;
  // This function contains the unique API call for the tool
  apiCall: (api: ManagementAPI, args: z.infer<z.ZodObject<T>>) => Promise<any>;
  // Optional: A custom success message
  successMessage?: (result: any, args: z.infer<z.ZodObject<T>>) => string;
}): Tool {
  const argumentSchema = z.object(config.schema);

  const invoke = async (client: Client, args: z.infer<typeof argumentSchema>) => {
    const managementAPI = new ManagementAPI(client);
    try {
      const result = await config.apiCall(managementAPI, args);

      if (config.successMessage) {
        return config.successMessage(result, args);
      }
      return result;
    } catch (e: any) {
      const errorMessage = e.message || JSON.stringify(e);
      return `Failed to execute tool '${config.name}'. Error: ${errorMessage}`;
    }
  };

  return {
    name: config.name,
    description: config.description,
    arguments: argumentSchema,
    invoke: invoke as (client: Client, args: any) => Promise<any>,
  };
}