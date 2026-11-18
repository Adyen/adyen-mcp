import { z } from 'zod';
import { ManagementAPI } from '@adyen/api-library';
import { TerminalOrderRequest } from '@adyen/api-library/lib/src/typings/management/terminalOrderRequest.js';
import { ShippingLocation } from '@adyen/api-library/lib/src/typings/management/shippingLocation.js';
import { createTool } from '../terminals/toolFactory.js';
import * as constants from './constants.js';
import * as schemas from './schemas.js';

// =================================================================
//  Helper Functions
// =================================================================

/**
 * Intelligently resolves a companyId. If the provided ID is a merchantId,
 * it fetches the corresponding companyId. Otherwise, it returns the original ID.
 */
async function resolveCompanyId(
  api: ManagementAPI,
  id: string,
): Promise<string> {
  try {
    const merchantAccount =
      await api.AccountMerchantLevelApi.getMerchantAccount(id);
    return merchantAccount?.companyId || id;
  } catch (_e) {
    return id;
  }
}

// =================================================================
//  Tool Definitions
// =================================================================

const listTerminalModelsTool = createTool({
  name: constants.LIST_TERMINAL_MODELS_NAME,
  description: constants.LIST_TERMINAL_MODELS_DESCRIPTION,
  schema: {
    companyId: z
      .string()
      .describe(
        'The unique identifier of the company account (a merchant ID is also accepted and auto-resolved).',
      ),
  },
  apiCall: async (api, args) => {
    const companyId = await resolveCompanyId(api, args.companyId);
    return api.TerminalOrdersCompanyLevelApi.listTerminalModels(companyId);
  },
});

const listTerminalProductsTool = createTool({
  name: constants.LIST_TERMINAL_PRODUCTS_NAME,
  description: constants.LIST_TERMINAL_PRODUCTS_DESCRIPTION,
  schema: {
    companyId: z
      .string()
      .describe(
        'The unique identifier of the company account (a merchant ID is also accepted and auto-resolved).',
      ),
    country: z
      .string()
      .describe(
        'Required. Two-letter ISO 3166-1 alpha-2 country code. Terminals are region-locked.',
      ),
    terminalModelId: z
      .string()
      .optional()
      .describe('The terminal model to filter products by.'),
    offset: z
      .number()
      .int()
      .optional()
      .describe('The number of products to skip.'),
    limit: z
      .number()
      .int()
      .optional()
      .describe('The number of products to return.'),
  },
  apiCall: async (api, args) => {
    const companyId = await resolveCompanyId(api, args.companyId);
    return api.TerminalOrdersCompanyLevelApi.listTerminalProducts(
      companyId,
      args.country,
      args.terminalModelId,
      args.offset,
      args.limit,
    );
  },
});

const listBillingEntitiesTool = createTool({
  name: constants.LIST_BILLING_ENTITIES_NAME,
  description: constants.LIST_BILLING_ENTITIES_DESCRIPTION,
  schema: {
    companyId: z
      .string()
      .describe(
        'The unique identifier of the company account (a merchant ID is also accepted and auto-resolved).',
      ),
    name: z
      .string()
      .optional()
      .describe('The name of the billing entity to filter by.'),
  },
  apiCall: async (api, args) => {
    const companyId = await resolveCompanyId(api, args.companyId);
    return api.TerminalOrdersCompanyLevelApi.listBillingEntities(
      companyId,
      args.name,
    );
  },
});

const listShippingLocationsTool = createTool({
  name: constants.LIST_SHIPPING_LOCATIONS_NAME,
  description: constants.LIST_SHIPPING_LOCATIONS_DESCRIPTION,
  schema: {
    companyId: z
      .string()
      .describe(
        'The unique identifier of the company account (a merchant ID is also accepted and auto-resolved).',
      ),
    name: z
      .string()
      .optional()
      .describe('The name of the shipping location to filter by.'),
    offset: z
      .number()
      .int()
      .optional()
      .describe('The number of locations to skip.'),
    limit: z
      .number()
      .int()
      .optional()
      .describe('The number of locations to return.'),
  },
  apiCall: async (api, args) => {
    const companyId = await resolveCompanyId(api, args.companyId);
    return api.TerminalOrdersCompanyLevelApi.listShippingLocations(
      companyId,
      args.name,
      args.offset,
      args.limit,
    );
  },
});

const createShippingLocationTool = createTool({
  name: constants.CREATE_SHIPPING_LOCATION_NAME,
  description: constants.CREATE_SHIPPING_LOCATION_DESCRIPTION,
  schema: {
    companyId: z
      .string()
      .describe(
        'The unique identifier of the company account (a merchant ID is also accepted and auto-resolved).',
      ),
    ...schemas.shippingLocationSchema.shape,
  },
  apiCall: async (api, args) => {
    const companyId = await resolveCompanyId(api, args.companyId);
    const { companyId: _companyId, ...shippingLocation } = args;
    return api.TerminalOrdersCompanyLevelApi.createShippingLocation(
      companyId,
      shippingLocation as ShippingLocation,
    );
  },
});

const createTerminalOrderTool = createTool({
  name: constants.CREATE_TERMINAL_ORDER_NAME,
  description: constants.CREATE_TERMINAL_ORDER_DESCRIPTION,
  schema: {
    companyId: z
      .string()
      .describe(
        'The unique identifier of the company account (a merchant ID is also accepted and auto-resolved).',
      ),
    ...schemas.terminalOrderRequestSchema.shape,
  },
  apiCall: async (api, args) => {
    const companyId = await resolveCompanyId(api, args.companyId);
    const { companyId: _companyId, ...terminalOrderRequest } = args;
    return api.TerminalOrdersCompanyLevelApi.createOrder(
      companyId,
      terminalOrderRequest as TerminalOrderRequest,
    );
  },
});

const listTerminalOrdersTool = createTool({
  name: constants.LIST_TERMINAL_ORDERS_NAME,
  description: constants.LIST_TERMINAL_ORDERS_DESCRIPTION,
  schema: {
    companyId: z
      .string()
      .describe(
        'The unique identifier of the company account (a merchant ID is also accepted and auto-resolved).',
      ),
    customerOrderReference: z
      .string()
      .optional()
      .describe('Your reference for the order.'),
    status: z
      .enum(['Placed', 'Confirmed', 'Cancelled', 'Shipped', 'Delivered'])
      .optional()
      .describe('The status of the order(s) to filter by.'),
    offset: z
      .number()
      .int()
      .optional()
      .describe('The number of orders to skip.'),
    limit: z
      .number()
      .int()
      .optional()
      .describe('The number of orders to return.'),
  },
  apiCall: async (api, args) => {
    const companyId = await resolveCompanyId(api, args.companyId);
    return api.TerminalOrdersCompanyLevelApi.listOrders(
      companyId,
      args.customerOrderReference,
      args.status,
      args.offset,
      args.limit,
    );
  },
});

const getTerminalOrderTool = createTool({
  name: constants.GET_TERMINAL_ORDER_NAME,
  description: constants.GET_TERMINAL_ORDER_DESCRIPTION,
  schema: {
    companyId: z
      .string()
      .describe(
        'The unique identifier of the company account (a merchant ID is also accepted and auto-resolved).',
      ),
    orderId: z
      .string()
      .describe('The unique identifier of the terminal order.'),
  },
  apiCall: async (api, args) => {
    const companyId = await resolveCompanyId(api, args.companyId);
    return api.TerminalOrdersCompanyLevelApi.getOrder(companyId, args.orderId);
  },
});

const updateTerminalOrderTool = createTool({
  name: constants.UPDATE_TERMINAL_ORDER_NAME,
  description: constants.UPDATE_TERMINAL_ORDER_DESCRIPTION,
  schema: {
    companyId: z
      .string()
      .describe(
        'The unique identifier of the company account (a merchant ID is also accepted and auto-resolved).',
      ),
    orderId: z
      .string()
      .describe('The unique identifier of the terminal order.'),
    ...schemas.terminalOrderRequestSchema.partial().shape,
  },
  apiCall: async (api, args) => {
    const companyId = await resolveCompanyId(api, args.companyId);
    const { companyId: _companyId, orderId, ...terminalOrderRequest } = args;
    return api.TerminalOrdersCompanyLevelApi.updateOrder(
      companyId,
      orderId,
      terminalOrderRequest as TerminalOrderRequest,
    );
  },
});

const cancelTerminalOrderTool = createTool({
  name: constants.CANCEL_TERMINAL_ORDER_NAME,
  description: constants.CANCEL_TERMINAL_ORDER_DESCRIPTION,
  schema: {
    companyId: z
      .string()
      .describe(
        'The unique identifier of the company account (a merchant ID is also accepted and auto-resolved).',
      ),
    orderId: z
      .string()
      .describe('The unique identifier of the terminal order.'),
  },
  apiCall: async (api, args) => {
    const companyId = await resolveCompanyId(api, args.companyId);
    return api.TerminalOrdersCompanyLevelApi.cancelOrder(
      companyId,
      args.orderId,
    );
  },
});

export const terminalOrderTools = [
  listTerminalModelsTool,
  listTerminalProductsTool,
  listBillingEntitiesTool,
  listShippingLocationsTool,
  createShippingLocationTool,
  createTerminalOrderTool,
  listTerminalOrdersTool,
  getTerminalOrderTool,
  updateTerminalOrderTool,
  cancelTerminalOrderTool,
];
