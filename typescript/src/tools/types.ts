import { z } from 'zod';
import { Client } from '@adyen/api-library';

export interface Tool {
  /**
   * The name of the tool as observed by the LLM. Note that clients may attempt to
   * instantiate objects or functions with this name in runtime.
   */
  name: string;
  description: string;
  arguments: z.ZodObject<z.ZodRawShape>;
  invoke: (adyenClient: Client, args: any) => Promise<any>;
}
