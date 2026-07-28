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
  options: { destructive: boolean; idempotent?: boolean },
): ToolAnnotations => ({
  title,
  readOnlyHint: false,
  destructiveHint: options.destructive,
  idempotentHint: options.idempotent ?? false,
  openWorldHint: true,
});
