import { createPaymentLinkTool, getPaymentLinkTool, updatePaymentLinkTool } from "./paymentLinks";
import { Tool } from "./types";
import {cancelPaymentTool, refundPaymentTool} from "./modifications";
import {createPaymentSessionTool, getPaymentMethodsTool, getPaymentSessionTool} from "./payments";
import {getMerchantAccountsTool, listMerchantAccountsTool} from "./management";
import { terminalTools } from "./terminals";
import { createHostedOnboardingLinkTool } from "./legalEntityManagement/onboardingLinks";
import { getLegalEntityTool } from "./legalEntityManagement/legalEntities";
import { getAccountHolderTool } from "./configuration/accountHolders";

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
  getAccountHolderTool
];
