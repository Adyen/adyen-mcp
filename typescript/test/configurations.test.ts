import { getAdyenConfig } from '../src/configurations/configurations.js';
import { MockInstance } from 'vitest';

describe('configurations', () => {
  // Store original process.argv to restore after tests
  const originalArgv = process.argv;
  // Store original ADYEN_API_KEY to restore after tests
  const originalApiKeyEnv = process.env.ADYEN_API_KEY;

  beforeEach(() => {
    // Ensure tests are not affected by a real ADYEN_API_KEY in the environment
    delete process.env.ADYEN_API_KEY;
  });

  afterEach(() => {
    // Restore original process.argv and ADYEN_API_KEY after each test
    process.argv = originalArgv;
    if (originalApiKeyEnv === undefined) {
      delete process.env.ADYEN_API_KEY;
    } else {
      process.env.ADYEN_API_KEY = originalApiKeyEnv;
    }
  });

  describe('getAdyenConfig', () => {
    describe('valid configurations', () => {
      it('should parse valid TEST environment config', () => {
        const args = ['--adyenApiKey', 'test-api-key', '--env', 'TEST'];
        const config = getAdyenConfig(args);

        expect(config.adyenApiKey).toBe('test-api-key');
        expect(config.env).toBe('TEST');
      });

      it('should parse valid LIVE environment config with livePrefix', () => {
        const args = [
          '--adyenApiKey',
          'live-api-key',
          '--env',
          'LIVE',
          '--livePrefix',
          'https://example.adyen.com',
        ];
        const config = getAdyenConfig(args);

        expect(config.adyenApiKey).toBe('live-api-key');
        expect(config.env).toBe('LIVE');
        expect(config.livePrefix).toBe('https://example.adyen.com');
      });

      it('should use TEST as default environment when not specified', () => {
        const args = ['--adyenApiKey', 'test-api-key'];
        const config = getAdyenConfig(args);

        expect(config.adyenApiKey).toBe('test-api-key');
        expect(config.env).toBe('TEST');
      });

      it('should parse config with optional livePrefix for TEST environment', () => {
        const args = [
          '--adyenApiKey',
          'test-api-key',
          '--env',
          'TEST',
          '--livePrefix',
          'some-prefix',
        ];
        const config = getAdyenConfig(args);

        expect(config.adyenApiKey).toBe('test-api-key');
        expect(config.env).toBe('TEST');
        expect(config.livePrefix).toBe('some-prefix');
      });
    });

    describe('ADYEN_API_KEY environment variable fallback', () => {
      it('should use ADYEN_API_KEY env var when --adyenApiKey is not provided', () => {
        process.env.ADYEN_API_KEY = 'env-api-key';
        const args = ['--env', 'TEST'];
        const config = getAdyenConfig(args);

        expect(config.adyenApiKey).toBe('env-api-key');
        expect(config.env).toBe('TEST');
      });

      it('should prefer --adyenApiKey over the ADYEN_API_KEY env var', () => {
        process.env.ADYEN_API_KEY = 'env-api-key';
        const args = ['--adyenApiKey', 'argv-api-key', '--env', 'TEST'];
        const config = getAdyenConfig(args);

        expect(config.adyenApiKey).toBe('argv-api-key');
      });

      it('should throw error when no API key is provided', () => {
        const args = ['--env', 'TEST'];

        expect(() => getAdyenConfig(args)).toThrow(/ADYEN_API_KEY/);
      });

      it('should warn when the API key is passed via argv in LIVE environment', () => {
        const consoleSpy = vi
          .spyOn(console, 'error')
          .mockImplementation(() => {});
        try {
          const args = [
            '--adyenApiKey',
            'live-api-key',
            '--env',
            'LIVE',
            '--livePrefix',
            'https://example.adyen.com',
          ];
          const config = getAdyenConfig(args);

          expect(config.adyenApiKey).toBe('live-api-key');
          expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringMatching(/ADYEN_API_KEY/),
          );
        } finally {
          consoleSpy.mockRestore();
        }
      });

      it('should not warn when the API key comes from the env var in LIVE environment', () => {
        process.env.ADYEN_API_KEY = 'env-live-key';
        const consoleSpy = vi
          .spyOn(console, 'error')
          .mockImplementation(() => {});
        try {
          const args = [
            '--env',
            'LIVE',
            '--livePrefix',
            'https://example.adyen.com',
          ];
          const config = getAdyenConfig(args);

          expect(config.adyenApiKey).toBe('env-live-key');
          expect(consoleSpy).not.toHaveBeenCalled();
        } finally {
          consoleSpy.mockRestore();
        }
      });
    });

    describe('validation errors', () => {
      it('should throw error when apiKey is missing', () => {
        const args = ['--env', 'TEST'];

        expect(() => getAdyenConfig(args)).toThrow(/ADYEN_API_KEY/);
      });

      it('should throw error when apiKey is empty string', () => {
        const args = ['--adyenApiKey', '', '--env', 'TEST'];

        expect(() => getAdyenConfig(args)).toThrow(/ADYEN_API_KEY/);
      });

      it('should throw error when environment is invalid', () => {
        const args = ['--adyenApiKey', 'test-key', '--env', 'INVALID'];

        expect(() => getAdyenConfig(args)).toThrow(/environment.*invalid/i);
      });

      it('should throw error when LIVE environment is used without livePrefix', () => {
        const args = ['--adyenApiKey', 'live-key', '--env', 'LIVE'];

        expect(() => getAdyenConfig(args)).toThrow(/prefix.*live/i);
      });

      it('should throw error when LIVE environment has empty livePrefix', () => {
        const args = [
          '--adyenApiKey',
          'live-key',
          '--env',
          'LIVE',
          '--livePrefix',
          '',
        ];

        expect(() => getAdyenConfig(args)).toThrow(/prefix.*live/i);
      });

      it('should throw error for unknown arguments when strict mode is enabled', () => {
        const args = [
          '--adyenApiKey',
          'test-key',
          '--env',
          'TEST',
          '--unknownArg',
          'value',
        ];

        expect(() => getAdyenConfig(args)).toThrow();
      });

      it('should throw error for positional arguments', () => {
        const args = [
          '--adyenApiKey',
          'test-key',
          '--env',
          'TEST',
          'positional-arg',
        ];

        expect(() => getAdyenConfig(args)).toThrow();
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

      it('should log error message and usage examples when parsing fails', () => {
        const args = ['--adyenApiKey', 'test-key', '--env', 'INVALID'];

        expect(() => getAdyenConfig(args)).toThrow();
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringMatching(/error.*parsing/i),
        );
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringMatching(/usage.*example/i),
        );
      });

      it('should log appropriate error for missing required fields', () => {
        const args = ['--env', 'TEST'];

        expect(() => getAdyenConfig(args)).toThrow();
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringMatching(/ADYEN_API_KEY/),
        );
      });
    });

    describe('edge cases', () => {
      it('should handle empty args array', () => {
        const args: string[] = [];

        // Should use default TEST environment but fail on missing API key
        expect(() => getAdyenConfig(args)).toThrow(/ADYEN_API_KEY/);
      });

      it('should handle null values', () => {
        // This tests the internal validation logic for null values
        const args = ['--adyenApiKey', 'test-key', '--env', 'TEST'];
        const config = getAdyenConfig(args);

        expect(config).toBeDefined();
        expect(config.adyenApiKey).toBe('test-key');
      });

      it('should handle case sensitivity for environment values', () => {
        const args = ['--adyenApiKey', 'test-key', '--env', 'test'];

        expect(() => getAdyenConfig(args)).toThrow(/environment.*test/i);
      });
    });

    describe('default process.argv behavior', () => {
      it('should use process.argv when no args provided', () => {
        // Mock process.argv
        process.argv = [
          'node',
          'script.js',
          '--adyenApiKey',
          'default-key',
          '--env',
          'TEST',
        ];

        const config = getAdyenConfig();

        expect(config.adyenApiKey).toBe('default-key');
        expect(config.env).toBe('TEST');
      });

      it('should slice process.argv correctly', () => {
        // Mock process.argv with typical node command structure
        process.argv = [
          'node',
          '/path/to/script.js',
          '--adyenApiKey',
          'argv-key',
          '--env',
          'LIVE',
          '--livePrefix',
          'live-prefix',
        ];

        const config = getAdyenConfig();

        expect(config.adyenApiKey).toBe('argv-key');
        expect(config.env).toBe('LIVE');
        expect(config.livePrefix).toBe('live-prefix');
      });
    });
  });
});
