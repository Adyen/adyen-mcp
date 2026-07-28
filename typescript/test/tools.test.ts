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

type ExpectedToolAnnotations = {
  readOnlyHint: boolean;
  destructiveHint: boolean;
  idempotentHint: boolean;
};

const readOnly: ExpectedToolAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
};

const writes = (
  destructiveHint: boolean,
  idempotentHint = false,
): ExpectedToolAnnotations => ({
  readOnlyHint: false,
  destructiveHint,
  idempotentHint,
});

const expectedToolAnnotations: Record<string, ExpectedToolAnnotations> = {
  create_payment_links: writes(false),
  get_payment_link: readOnly,
  update_payment_link: writes(true, true),
  refund_payment: writes(true),
  create_payment_session: writes(false),
  get_payment_session: readOnly,
  get_payment_methods: readOnly,
  list_merchant_accounts: readOnly,
  get_merchant_account: readOnly,
  cancel_payment: writes(true),
  create_terminal_action: writes(true),
  get_android_app: readOnly,
  get_terminal_settings: readOnly,
  list_android_apps: readOnly,
  list_android_certificates: readOnly,
  list_terminals: readOnly,
  list_terminal_actions: readOnly,
  reassign_terminal: writes(true),
  update_terminal_settings: writes(true, true),
  create_hosted_onboarding_link: writes(false),
  get_legal_entity: readOnly,
  get_account_holder: readOnly,
  list_all_company_webhooks: readOnly,
  get_company_webhook: readOnly,
  test_company_webhook: writes(false),
  list_all_merchant_webhooks: readOnly,
  get_merchant_webhook: readOnly,
  test_merchant_webhook: writes(false),
  list_company_users: readOnly,
  get_company_user_details: readOnly,
  list_merchant_users: readOnly,
  get_merchant_user_details: readOnly,
  list_all_payment_methods_merchant: readOnly,
  get_payment_methods_details_merchant: readOnly,
  list_all_company_api_credentials: readOnly,
  list_all_merchant_api_credentials: readOnly,
  list_all_company_allowed_origins: readOnly,
  list_all_merchant_allowed_origins: readOnly,
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
