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

describe('tools', () => {
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
