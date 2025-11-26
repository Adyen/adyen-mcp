import {
  createPaymentLinkTool,
  getPaymentLinkTool,
  updatePaymentLinkTool,
} from './checkout/paymentLinks/index.js';
import { Tool } from './types.js';
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
