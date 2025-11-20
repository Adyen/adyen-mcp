import {
  createPaymentLinkTool,
  getPaymentLinkTool,
  updatePaymentLinkTool,
} from './paymentLinks/index.js';
import { Tool } from './types.js';
import { cancelPaymentTool, refundPaymentTool } from './modifications/index.js';
import {
  createPaymentSessionTool,
  getPaymentMethodsTool,
  getPaymentSessionTool,
} from './payments/index.js';
import {
  getMerchantAccountsTool,
  listMerchantAccountsTool,
} from './management/index.js';
import { terminalTools } from './terminals/index.js';
import { createHostedOnboardingLinkTool } from './legalEntityManagement/onboardingLinks/index.js';
import { getLegalEntityTool } from './legalEntityManagement/legalEntities/index.js';
import { getAccountHolderTool } from './configuration/accountHolders/index.js';

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
];
