import { parseArgs } from 'node:util';
import { ParseArgsConfig } from 'util';

export enum AdyenOptionKeys {
  ApiKey = 'adyenApiKey',
  Environment = 'env',
  LivePrefix = 'livePrefix',
}

export enum Environment {
  LIVE = 'LIVE',
  TEST = 'TEST',
}

const mandatoryFields = [AdyenOptionKeys.ApiKey, AdyenOptionKeys.Environment];

type AdyenConfig = {
  [key in AdyenOptionKeys]: string;
};

const optionsConfig: ParseArgsConfig['options'] = {
  [AdyenOptionKeys.ApiKey]: {
    type: 'string' as const,
  },
  [AdyenOptionKeys.Environment]: {
    type: 'string' as const,
    default: Environment.TEST,
  },
  [AdyenOptionKeys.LivePrefix]: {
    type: 'string' as const,
  },
};

function validateAdyenConfig(options: { [option: string]: any }) {
  for (const key of mandatoryFields) {
    if (
      options[key] === undefined ||
      options[key] === null ||
      options[key] === ''
    ) {
      const errorMessage = `Missing or empty required argument: --${key}`;
      throw new Error(errorMessage);
    }
  }

  const environment = options[AdyenOptionKeys.Environment];
  if (!Object.values(Environment).includes(environment)) {
    throw new Error(
      `Invalid environment: ${environment}. Expected one of:
      ${Object.values(Environment).join(', ')}`,
    );
  }

  if (
    environment === Environment.LIVE &&
    !options[AdyenOptionKeys.LivePrefix]
  ) {
    throw new Error(
      `Invalid prefix: ${
        options[AdyenOptionKeys.LivePrefix]
      } for Live environment, see: https://docs.adyen.com/development-resources/live-endpoints/.
            Example: --${AdyenOptionKeys.LivePrefix} <your-url>`,
    );
  }

  return options as AdyenConfig;
}

export function getAdyenConfig(
  args: string[] = process.argv.slice(2),
): AdyenConfig {
  try {
    const { values: parsedOptions } = parseArgs({
      options: optionsConfig,
      args,
      strict: true,
      allowPositionals: false,
    });
    return validateAdyenConfig(parsedOptions);
  } catch (error: any) {
    console.error('\nError parsing command-line arguments:');
    console.error(`  ${error.message}`);
    console.error('\nUsage examples:');
    console.error(
      `  npx @adyen/mcp --${AdyenOptionKeys.ApiKey} <your-adyen-api-key> --${AdyenOptionKeys.Environment} <your-env>`,
    );
    throw error;
  }
}
