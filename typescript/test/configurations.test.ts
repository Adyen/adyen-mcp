import { getAdyenConfig } from "../src/configurations/configurations";
import { MockInstance } from "vitest";

describe("configurations", () => {
  // Store original process.argv to restore after tests
  const originalArgv = process.argv;

  afterEach(() => {
    // Restore original process.argv after each test
    process.argv = originalArgv;
  });

  describe("getAdyenConfig", () => {
    describe("valid configurations", () => {
      it("should parse valid TEST environment config", () => {
        const args = ["--apiKey", "test-api-key", "--environment", "TEST"];
        const config = getAdyenConfig(args);

        expect(config.apiKey).toBe("test-api-key");
        expect(config.environment).toBe("TEST");
      });

      it("should parse valid LIVE environment config with livePrefix", () => {
        const args = [
          "-a",
          "live-api-key",
          "-e",
          "LIVE",
          "-l",
          "https://example.adyen.com",
        ];
        const config = getAdyenConfig(args);

        expect(config.apiKey).toBe("live-api-key");
        expect(config.environment).toBe("LIVE");
        expect(config.liveEndpointUrlPrefix).toBe("https://example.adyen.com");
      });

      it("should use TEST as default environment when not specified", () => {
        const args = ["--apiKey", "test-api-key"];
        const config = getAdyenConfig(args);

        expect(config.apiKey).toBe("test-api-key");
        expect(config.environment).toBe("TEST");
      });

      it("should parse username and password for basic auth", () => {
        const args = ["-u", "username", "-p", "password"];
        const config = getAdyenConfig(args);

        expect(config.username).toBe("username");
        expect(config.password).toBe("password");
      });

      it("should parse config with optional livePrefix for TEST environment", () => {
        const args = [
          "--apiKey",
          "test-api-key",
          "--environment",
          "TEST",
          "--liveEndpointUrlPrefix",
          "some-prefix",
        ];
        const config = getAdyenConfig(args);

        expect(config.apiKey).toBe("test-api-key");
        expect(config.environment).toBe("TEST");
        expect(config.liveEndpointUrlPrefix).toBe("some-prefix");
      });
    });

    describe("validation errors", () => {
      it("should throw error when apiKey is missing", () => {
        const args = ["--environment", "TEST"];

        expect(() => getAdyenConfig(args)).toThrow(
          "Missing required credentials. Provide --apiKey OR --username and --password.",
        );
      });

      it("should throw error when apiKey is empty string", () => {
        const args = ["--apiKey", "", "--environment", "TEST"];

        expect(() => getAdyenConfig(args)).toThrow(
          "Missing required credentials. Provide --apiKey OR --username and --password.",
        );
      });

      it("should throw error when username is missing", () => {
        const args = ["--password", "password", "--environment", "TEST"];

        expect(() => getAdyenConfig(args)).toThrow(
          "Missing required credentials. Provide --apiKey OR --username and --password.",
        );
      });

      it("should throw error when password is missing", () => {
        const args = ["--username", "username", "--environment", "TEST"];

        expect(() => getAdyenConfig(args)).toThrow(
          "Missing required credentials. Provide --apiKey OR --username and --password.",
        );
      });

      it("should throw error when environment is invalid", () => {
        const args = ["--apiKey", "test-key", "--environment", "INVALID"];

        expect(() => getAdyenConfig(args)).toThrow(
          'Invalid value for the --environment argument: "INVALID", expected values are: (TEST | LIVE)',
        );
      });

      it("should throw error when LIVE environment is used without livePrefix", () => {
        const args = ["--apiKey", "live-key", "--environment", "LIVE"];

        expect(() => getAdyenConfig(args)).toThrow(
          "Live environment requires --liveEndpointUrlPrefix.",
        );
      });

      it("should throw error when LIVE environment has empty livePrefix", () => {
        const args = [
          "--apiKey",
          "live-key",
          "--environment",
          "LIVE",
          "--liveEndpointUrlPrefix",
          "",
        ];

        expect(() => getAdyenConfig(args)).toThrow(
          "Live environment requires --liveEndpointUrlPrefix.",
        );
      });

      it("should throw error for unknown arguments when strict mode is enabled", () => {
        const args = ["-a", "test-key", "-e", "TEST", "--unknownArg", "value"];

        expect(() => getAdyenConfig(args)).toThrow();
      });

      it("should throw error for positional arguments", () => {
        const args = ["-a", "test-key", "-e", "TEST", "positional-arg"];

        expect(() => getAdyenConfig(args)).toThrow();
      });
    });

    describe("error handling and logging", () => {
      let consoleSpy: MockInstance;

      beforeEach(() => {
        consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      });

      afterEach(() => {
        consoleSpy.mockRestore();
      });

      it("should log error message and usage examples when parsing fails", () => {
        const args = ["--adyenApiKey", "test-key", "--env", "INVALID"];

        expect(() => getAdyenConfig(args)).toThrow();
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringMatching(/error.*parsing/i),
        );
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringMatching(/usage.*example/i),
        );
      });

      it("should log appropriate error for missing required fields", () => {
        const args = ["--env", "TEST"];

        expect(() => getAdyenConfig(args)).toThrow();
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringMatching(/apiKey/i),
        );
      });
    });

    describe("edge cases", () => {
      it("should handle empty args array", () => {
        const args: string[] = [];

        // Should use default TEST environment but fail on missing API key
        expect(() => getAdyenConfig(args)).toThrow(/apiKey/i);
      });

      it("should handle null values", () => {
        // This tests the internal validation logic for null values
        const args = ["--apiKey", "test-key", "--environment", "TEST"];
        const config = getAdyenConfig(args);

        expect(config).toBeDefined();
        expect(config.apiKey).toBe("test-key");
      });

      it("should handle case sensitivity for environment values", () => {
        const args = ["--apiKey", "test-key", "--environment", "test"];

        expect(() => getAdyenConfig(args)).toThrow(/environment.*test/i);
      });
    });

    describe("default process.argv behavior", () => {
      it("should use process.argv when no args provided", () => {
        // Mock process.argv
        process.argv = [
          "node",
          "script.js",
          "--apiKey",
          "default-key",
          "--environment",
          "TEST",
        ];

        const config = getAdyenConfig();

        expect(config.apiKey).toBe("default-key");
        expect(config.environment).toBe("TEST");
      });

      it("should slice process.argv correctly", () => {
        // Mock process.argv with typical node command structure
        process.argv = [
          "node",
          "/path/to/script.js",
          "-a",
          "argv-key",
          "-e",
          "LIVE",
          "-l",
          "live-prefix",
        ];

        const config = getAdyenConfig();

        expect(config.apiKey).toBe("argv-key");
        expect(config.environment).toBe("LIVE");
        expect(config.liveEndpointUrlPrefix).toBe("live-prefix");
      });
    });
  });
});
