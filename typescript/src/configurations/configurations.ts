import { parseArgs } from "node:util";
import { ParseArgsConfig } from "util";
import { Config } from "@adyen/api-library";

export enum AdyenEnvironment {
  LIVE = "LIVE",
  TEST = "TEST",
}

export enum ArgKeys {
  ApiKey = "apiKey",
  Environment = "environment",
  LivePrefix = "liveEndpointUrlPrefix",
  Username = "username",
  Password = "password",
}

const optionsConfig: ParseArgsConfig["options"] = {
  [ArgKeys.ApiKey]: { type: "string" as const, short: "a" },
  [ArgKeys.Username]: { type: "string" as const, short: "u" },
  [ArgKeys.Password]: { type: "string" as const, short: "p" },
  [ArgKeys.Environment]: {
    type: "string" as const,
    short: "e",
    default: AdyenEnvironment.TEST,
  },
  [ArgKeys.LivePrefix]: { type: "string" as const, short: "l" },
};

export function getAdyenConfig(args: string[] = process.argv.slice(2)): Config {
  try {
    const { values } = parseArgs({
      options: optionsConfig,
      args,
      strict: true,
      allowPositionals: false,
    });

    const options = values as { [key: string]: any };

    const environment = options[ArgKeys.Environment];
    if (
      !Object.values(AdyenEnvironment).includes(environment as AdyenEnvironment)
    ) {
      throw new Error(
        `Invalid value for the --${ArgKeys.Environment} argument: "${environment}", expected values are: (TEST | LIVE)`,
      );
    }

    // Check if we have either an API-key or basic-auth
    const hasApiKey = !!options[ArgKeys.ApiKey];
    const hasBasicAuth = !!(
      options[ArgKeys.Username] && options[ArgKeys.Password]
    );
    if (!hasApiKey && !hasBasicAuth) {
      throw new Error(
        `Missing required credentials. Provide --${ArgKeys.ApiKey} OR --${ArgKeys.Username} and --${ArgKeys.Password}.`,
      );
    }

    // Live URL prefix check
    if (
      options[ArgKeys.Environment] === AdyenEnvironment.LIVE &&
      !options[ArgKeys.LivePrefix]
    ) {
      throw new Error(`Live environment requires --${ArgKeys.LivePrefix}.`);
    }

    // Map to adyen node library config object
    return values as Config;
  } catch (error: any) {
    console.error("\nError parsing command-line arguments:");
    console.error(`  ${error.message}`);
    console.error("\nUsage examples:");
    console.error(
      `  npx @adyen/mcp --${ArgKeys.ApiKey} <your-adyen-api-key> --${ArgKeys.Environment} <your-env>`,
    );
    throw error;
  }
}
