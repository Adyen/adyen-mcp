import { ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';

export const readOnly = (title: string): ToolAnnotations => ({
  title,
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
});

export const writes = (
  title: string,
  destructive: boolean,
): ToolAnnotations => ({
  title,
  readOnlyHint: false,
  destructiveHint: destructive,
  idempotentHint: false,
  openWorldHint: true,
});
