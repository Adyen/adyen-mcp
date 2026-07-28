import { z } from 'zod';
import { Client } from '@adyen/api-library';
import { ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';

export interface Tool {
  /**
   * The name of the tool as observed by the LLM. Note that clients may attempt to
   * instantiate objects or functions with this name in runtime.
   */
  name: string;
  description: string;
  annotations: ToolAnnotations;
  arguments: z.ZodObject<z.ZodRawShape>;
  invoke: (adyenClient: Client, args: any) => Promise<any>;
}
