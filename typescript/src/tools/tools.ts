import { createPaymentLinkTool, getPaymentLinkTool, updatePaymentLinkTool } from "./paymentLinks";
import { Tool } from "./types";
import {cancelPaymentTool, refundPaymentTool} from "./modifications";
import {createPaymentSessionTool, getPaymentMethodsTool, getPaymentSessionTool} from "./payments";
import {getMerchantAccountsTool, listMerchantAccountsTool} from "./management";
import * as terminals from "./terminals";

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
  ...Object.values(terminals),
];
