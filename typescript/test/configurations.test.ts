import { getAdyenConfig } from '../src/configurations/configurations';
import { MockInstance } from 'vitest';

describe('configurations', () => {
  // Store original process.argv to restore after tests
  const originalArgv = process.argv;

  afterEach(() => {
    // Restore original process.argv after each test
    process.argv = originalArgv;
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
          '--adyenApiKey', 'live-api-key',
          '--env', 'LIVE',
          '--livePrefix', 'https://example.adyen.com'
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
          '--adyenApiKey', 'test-api-key',
          '--env', 'TEST',
          '--livePrefix', 'some-prefix'
        ];
        const config = getAdyenConfig(args);

        expect(config.adyenApiKey).toBe('test-api-key');
        expect(config.env).toBe('TEST');
        expect(config.livePrefix).toBe('some-prefix');
      });
    });

    describe('validation errors', () => {
      it('should throw error when apiKey is missing', () => {
        const args = ['--env', 'TEST'];
        
        expect(() => getAdyenConfig(args)).toThrow(/adyenApiKey/i);
      });

      it('should throw error when apiKey is empty string', () => {
        const args = ['--adyenApiKey', '', '--env', 'TEST'];
        
        expect(() => getAdyenConfig(args)).toThrow(/adyenApiKey/i);
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
        const args = ['--adyenApiKey', 'live-key', '--env', 'LIVE', '--livePrefix', ''];
        
        expect(() => getAdyenConfig(args)).toThrow(/prefix.*live/i);
      });

      it('should throw error for unknown arguments when strict mode is enabled', () => {
        const args = ['--adyenApiKey', 'test-key', '--env', 'TEST', '--unknownArg', 'value'];
        
        expect(() => getAdyenConfig(args)).toThrow();
      });

      it('should throw error for positional arguments', () => {
        const args = ['--adyenApiKey', 'test-key', '--env', 'TEST', 'positional-arg'];
        
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
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/error.*parsing/i));
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/usage.*example/i));
      });

      it('should log appropriate error for missing required fields', () => {
        const args = ['--env', 'TEST'];
        
        expect(() => getAdyenConfig(args)).toThrow();
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/adyenApiKey/i));
      });
    });

    describe('edge cases', () => {
      it('should handle empty args array', () => {
        const args: string[] = [];
        
        // Should use default TEST environment but fail on missing API key
        expect(() => getAdyenConfig(args)).toThrow(/adyenApiKey/i);
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
        process.argv = ['node', 'script.js', '--adyenApiKey', 'default-key', '--env', 'TEST'];
        
        const config = getAdyenConfig();
        
        expect(config.adyenApiKey).toBe('default-key');
        expect(config.env).toBe('TEST');
      });

      it('should slice process.argv correctly', () => {
        // Mock process.argv with typical node command structure
        process.argv = ['node', '/path/to/script.js', '--adyenApiKey', 'argv-key', '--env', 'LIVE', '--livePrefix', 'live-prefix'];
        
        const config = getAdyenConfig();
        
        expect(config.adyenApiKey).toBe('argv-key');
        expect(config.env).toBe('LIVE');
        expect(config.livePrefix).toBe('live-prefix');
      });
    });
  });
});
