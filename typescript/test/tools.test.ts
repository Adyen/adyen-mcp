import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  MockInstance,
} from 'vitest';
import { AdyenConfig } from '../src/configurations/configurations.js';
import { getActiveTools, tools } from '../src/tools/tools';

const expectedToolAnnotations: Record<
  string,
  { readOnlyHint: boolean; destructiveHint: boolean }
> = {
  create_payment_links: {
    readOnlyHint: false,
    destructiveHint: false,
  },
  get_payment_link: { readOnlyHint: true, destructiveHint: false },
  update_payment_link: { readOnlyHint: false, destructiveHint: true },
  refund_payment: { readOnlyHint: false, destructiveHint: true },
  create_payment_session: {
    readOnlyHint: false,
    destructiveHint: false,
  },
  get_payment_session: { readOnlyHint: true, destructiveHint: false },
  get_payment_methods: { readOnlyHint: true, destructiveHint: false },
  list_merchant_accounts: { readOnlyHint: true, destructiveHint: false },
  get_merchant_account: { readOnlyHint: true, destructiveHint: false },
  cancel_payment: { readOnlyHint: false, destructiveHint: true },
  create_terminal_action: { readOnlyHint: false, destructiveHint: true },
  get_android_app: { readOnlyHint: true, destructiveHint: false },
  get_terminal_settings: { readOnlyHint: true, destructiveHint: false },
  list_android_apps: { readOnlyHint: true, destructiveHint: false },
  list_android_certificates: { readOnlyHint: true, destructiveHint: false },
  list_terminals: { readOnlyHint: true, destructiveHint: false },
  list_terminal_actions: { readOnlyHint: true, destructiveHint: false },
  reassign_terminal: { readOnlyHint: false, destructiveHint: true },
  update_terminal_settings: { readOnlyHint: false, destructiveHint: true },
  create_hosted_onboarding_link: {
    readOnlyHint: false,
    destructiveHint: false,
  },
  get_legal_entity: { readOnlyHint: true, destructiveHint: false },
  get_account_holder: { readOnlyHint: true, destructiveHint: false },
  list_all_company_webhooks: { readOnlyHint: true, destructiveHint: false },
  get_company_webhook: { readOnlyHint: true, destructiveHint: false },
  test_company_webhook: { readOnlyHint: false, destructiveHint: false },
  list_all_merchant_webhooks: { readOnlyHint: true, destructiveHint: false },
  get_merchant_webhook: { readOnlyHint: true, destructiveHint: false },
  test_merchant_webhook: { readOnlyHint: false, destructiveHint: false },
  list_company_users: { readOnlyHint: true, destructiveHint: false },
  get_company_user_details: { readOnlyHint: true, destructiveHint: false },
  list_merchant_users: { readOnlyHint: true, destructiveHint: false },
  get_merchant_user_details: { readOnlyHint: true, destructiveHint: false },
  list_all_payment_methods_merchant: {
    readOnlyHint: true,
    destructiveHint: false,
  },
  get_payment_methods_details_merchant: {
    readOnlyHint: true,
    destructiveHint: false,
  },
  list_all_company_api_credentials: {
    readOnlyHint: true,
    destructiveHint: false,
  },
  list_all_merchant_api_credentials: {
    readOnlyHint: true,
    destructiveHint: false,
  },
  list_all_company_allowed_origins: {
    readOnlyHint: true,
    destructiveHint: false,
  },
  list_all_merchant_allowed_origins: {
    readOnlyHint: true,
    destructiveHint: false,
  },
};

describe('tools', () => {
  it('classifies every exposed tool with MCP annotations', () => {
    const toolNames = tools.map((tool) => tool.name);

    expect(toolNames).toHaveLength(Object.keys(expectedToolAnnotations).length);
    expect(new Set(toolNames).size).toBe(toolNames.length);
    expect(new Set(toolNames)).toEqual(
      new Set(Object.keys(expectedToolAnnotations)),
    );

    for (const tool of tools) {
      expect(tool.annotations.title).toEqual(expect.any(String));
      expect(tool.annotations.title).not.toHaveLength(0);
      expect(tool.annotations).toMatchObject({
        ...expectedToolAnnotations[tool.name],
        idempotentHint: tool.annotations.readOnlyHint,
        openWorldHint: true,
      });
      expect(
        tool.annotations.readOnlyHint && tool.annotations.destructiveHint,
      ).toBe(false);
    }
  });

  describe('getActiveTools', () => {
    const totalToolsCount = tools.length;
    const createConfig = (
      overrides: Partial<AdyenConfig> = {},
    ): AdyenConfig => ({
      adyenApiKey: 'test-key',
      env: 'TEST',
      ...overrides,
    });

    describe('default behavior', () => {
      it('should return ALL tools when no filters are provided', () => {
        const config = createConfig({});
        const result = getActiveTools(config);

        expect(result.size).toBe(totalToolsCount);
      });

      it('should return ALL tools when filter arrays are empty', () => {
        const config = createConfig({
          tools: [],
        });
        const result = getActiveTools(config);

        expect(result.size).toBe(totalToolsCount);
      });
    });
    describe('filtering by Tool Names', () => {
      it('should return specific tools when requested by name', () => {
        const config = createConfig({
          tools: ['create_payment_links', 'get_merchant_account'],
        });
        const result = getActiveTools(config);

        expect(result.size).toBe(2);

        const names = Array.from(result).map((t) => t.name);
        expect(names).toContain('create_payment_links');
        expect(names).toContain('get_merchant_account');
      });
    });

    describe('combined filtering & deduplication', () => {
      it('should handle overlapping combinations of tools', () => {
        const config = createConfig({
          tools: [
            'list_merchant_accounts',
            'list_merchant_accounts',
            'list_merchant_accounts',
          ],
        });
        const result = getActiveTools(config);

        expect(result.size).toBe(1);
      });
    });

    describe('error handling and logging', () => {
      let consoleSpy: MockInstance;

      beforeEach(() => {
        consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      });

      afterEach(() => {
        consoleSpy.mockRestore();
      });

      it('should log error for invalid tool names', () => {
        const config = createConfig({
          tools: ['typoToolName', 'create_payment_links'],
        });

        const result = getActiveTools(config);

        expect(result.size).toBe(1); // Should still get createPaymentLink
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringMatching(/Tool 'typoToolName' not found/i),
        );
      });

      it('should throw Error if NO valid tools are selected (activeTools is empty)', () => {
        const config = createConfig({
          tools: ['invalidTool', 'anotherInvalidTool'],
        });

        // The function is designed to throw if the final Set is empty
        expect(() => getActiveTools(config)).toThrow(
          /No valid tools were selected/i,
        );

        // Also verify the console errors were logged
        expect(consoleSpy).toHaveBeenCalledTimes(2);
      });
    });
  });
});
