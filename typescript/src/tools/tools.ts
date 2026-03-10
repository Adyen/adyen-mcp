import {
  createPaymentLinkTool,
  getPaymentLinkTool,
  updatePaymentLinkTool,
} from './checkout/paymentLinks/index.js';
import {
  cancelPaymentTool,
  refundPaymentTool,
} from './checkout/modifications/index.js';
import {
  createPaymentSessionTool,
  getPaymentMethodsTool,
  getPaymentSessionTool,
} from './checkout/payments/index.js';
import {
  getMerchantAccountsTool,
  listMerchantAccountsTool,
} from './management/accounts/index.js';
import { terminalTools } from './management/terminals/index.js';
import { createHostedOnboardingLinkTool } from './legalEntityManagement/onboardingLinks/index.js';
import { getLegalEntityTool } from './legalEntityManagement/legalEntities/index.js';
import { getAccountHolderTool } from './configuration/accountHolders/index.js';
import {
  getCompanyWebhookTool,
  getMerchantWebhookTool,
  listAllCompanyWebhooksTool,
  listAllMerchantWebhooksTool,
} from './management/webhooks/index.js';
import { AdyenConfig } from '../configurations/configurations';
import { Tool } from './types';

export const tools: Tool[] = [
  createPaymentLinkTool,
  getPaymentLinkTool,
  refundPaymentTool,
  createPaymentSessionTool,
  updatePaymentLinkTool,
  getPaymentSessionTool,
  getPaymentMethodsTool,
  listMerchantAccountsTool,
  getMerchantAccountsTool,
  cancelPaymentTool,
  ...terminalTools,
  createHostedOnboardingLinkTool,
  getLegalEntityTool,
  getAccountHolderTool,
  listAllCompanyWebhooksTool,
  getCompanyWebhookTool,
  listAllMerchantWebhooksTool,
  getMerchantWebhookTool,
];

const availableToolNames = tools.map((i) => `'${i.name}'`).join(', ');

export function getActiveTools(adyenConfig: AdyenConfig): Set<Tool> {
  const configuredTools = adyenConfig.tools;
  if (!configuredTools || configuredTools.length < 1) {
    return new Set<Tool>(tools);
  }

  const activeTools = new Set<Tool>();
  configuredTools.forEach((toolName) => {
    const tool = tools.find((t) => t.name === toolName);
    if (tool) {
      activeTools.add(tool);
    } else {
      console.error(
        `❌ Error: Tool '${toolName}' not found.\n` +
          `   👉 All available tools: ${availableToolNames}`,
      );
    }
  });

  if (activeTools.size < 1) {
    throw new Error(
      '⛔ No valid tools were selected based on your configuration.\n' +
        '   Please check your --tools arguments.',
    );
  }
  return activeTools;
}
