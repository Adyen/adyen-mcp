import { z } from 'zod';
import { Client, ManagementAPI } from '@adyen/api-library';
import { Tool } from '../../types.js';
import {
  GET_COMPANY_WEBHOOK,
  GET_COMPANY_WEBHOOK_DESCRIPTION,
  GET_MERCHANT_WEBHOOK,
  GET_MERCHANT_WEBHOOK_DESCRIPTION,
  LIST_ALL_COMPANY_WEBHOOKS,
  LIST_ALL_COMPANY_WEBHOOKS_DESCRIPTION,
  LIST_ALL_MERCHANT_WEBHOOKS,
  LIST_ALL_MERCHANT_WEBHOOKS_DESCRIPTION,
  TEST_COMPANY_WEBHOOK,
  TEST_COMPANY_WEBHOOK_DESCRIPTION,
  TEST_MERCHANT_WEBHOOK,
  TEST_MERCHANT_WEBHOOK_DESCRIPTION,
} from './constants.js';

const listAllMerchantWebhooksRequestObject = z.object({
  merchantId: z.string(),
  pageSize: z.number(),
  pageNumber: z.number(),
});

const listAllMerchantWebhooks = async (
  client: Client,
  req: z.infer<typeof listAllMerchantWebhooksRequestObject>,
) => {
  const { merchantId, pageSize, pageNumber } = req;

  const managementAPI = new ManagementAPI(client);
  try {
    return await managementAPI.WebhooksMerchantLevelApi.listAllWebhooks(
      merchantId,
      pageNumber,
      pageSize,
    );
  } catch (e) {
    return (
      'Failed to list all webhook configurations on merchant account. Error: ' +
      JSON.stringify(e)
    );
  }
};

export const listAllMerchantWebhooksTool: Tool = {
  name: LIST_ALL_MERCHANT_WEBHOOKS,
  description: LIST_ALL_MERCHANT_WEBHOOKS_DESCRIPTION,
  arguments: listAllMerchantWebhooksRequestObject,
  invoke: listAllMerchantWebhooks,
};

const getMerchantWebhookShape: z.ZodRawShape = {
  merchantId: z.string(),
  webhookId: z.string(),
};

const getMerchantWebhookRequestObject = z.object(getMerchantWebhookShape);

const getMerchantWebhook = async (
  client: Client,
  req: z.infer<typeof getMerchantWebhookRequestObject>,
) => {
  const { merchantId, webhookId } = req;

  const managementAPI = new ManagementAPI(client);
  try {
    return await managementAPI.WebhooksMerchantLevelApi.getWebhook(
      merchantId,
      webhookId,
    );
  } catch (e) {
    return (
      'Failed to get merchant webhook configuration. Error: ' +
      JSON.stringify(e)
    );
  }
};

export const getMerchantWebhookTool: Tool = {
  name: GET_MERCHANT_WEBHOOK,
  description: GET_MERCHANT_WEBHOOK_DESCRIPTION,
  arguments: getMerchantWebhookRequestObject,
  invoke: getMerchantWebhook,
};

const listAllCompanyWebhooksRequestObject = z.object({
  companyId: z.string(),
  pageSize: z.number(),
  pageNumber: z.number(),
});

const listAllCompanyWebhooks = async (
  client: Client,
  req: z.infer<typeof listAllCompanyWebhooksRequestObject>,
) => {
  const { companyId, pageSize, pageNumber } = req;

  const managementAPI = new ManagementAPI(client);
  try {
    return await managementAPI.WebhooksCompanyLevelApi.listAllWebhooks(
      companyId,
      pageNumber,
      pageSize,
    );
  } catch (e) {
    return (
      'Failed to list all webhook configurations on company account. Error: ' +
      JSON.stringify(e)
    );
  }
};

export const listAllCompanyWebhooksTool: Tool = {
  name: LIST_ALL_COMPANY_WEBHOOKS,
  description: LIST_ALL_COMPANY_WEBHOOKS_DESCRIPTION,
  arguments: listAllCompanyWebhooksRequestObject,
  invoke: listAllCompanyWebhooks,
};

const getCompanyWebhookRequestObject = z.object({
  companyId: z.string(),
  webhookId: z.string(),
});

const getCompanyWebhook = async (
  client: Client,
  req: z.infer<typeof getCompanyWebhookRequestObject>,
) => {
  const { companyId, webhookId } = req;

  const managementAPI = new ManagementAPI(client);
  try {
    return await managementAPI.WebhooksCompanyLevelApi.getWebhook(
      companyId,
      webhookId,
    );
  } catch (e) {
    return (
      'Failed to get company webhook configuration. Error: ' + JSON.stringify(e)
    );
  }
};

export const getCompanyWebhookTool: Tool = {
  name: GET_COMPANY_WEBHOOK,
  description: GET_COMPANY_WEBHOOK_DESCRIPTION,
  arguments: getCompanyWebhookRequestObject,
  invoke: getCompanyWebhook,
};

const testMerchantWebhookRequestObject = z.object({
  merchantId: z.string(),
  webhookId: z.string(),
  types: z.array(z.string()),
});

const testMerchantWebhook = async (
  client: Client,
  req: z.infer<typeof testMerchantWebhookRequestObject>,
) => {
  const { merchantId, webhookId, types } = req;

  const managementAPI = new ManagementAPI(client);
  try {
    return await managementAPI.WebhooksMerchantLevelApi.testWebhook(
      merchantId,
      webhookId,
      { types: types },
    );
  } catch (e) {
    return (
      'Failed to test merchant webhook configuration. Error: ' +
      JSON.stringify(e)
    );
  }
};

export const testMerchantWebhookTool: Tool = {
  name: TEST_MERCHANT_WEBHOOK,
  description: TEST_MERCHANT_WEBHOOK_DESCRIPTION,
  arguments: testMerchantWebhookRequestObject,
  invoke: testMerchantWebhook,
};

const testCompanyWebhookRequestObject = z.object({
  companyId: z.string(),
  webhookId: z.string(),
  types: z.array(z.string()).optional(),
  merchantIds: z.array(z.string()).optional(),
});

const testCompanyWebhook = async (
  client: Client,
  req: z.infer<typeof testCompanyWebhookRequestObject>,
) => {
  const { companyId, webhookId, types, merchantIds } = req;

  const managementAPI = new ManagementAPI(client);
  try {
    return await managementAPI.WebhooksCompanyLevelApi.testWebhook(
      companyId,
      webhookId,
      { types: types, merchantIds: merchantIds },
    );
  } catch (e) {
    return (
      'Failed to test company webhook configuration. Error: ' +
      JSON.stringify(e)
    );
  }
};

export const testCompanyWebhookTool: Tool = {
  name: TEST_COMPANY_WEBHOOK,
  description: TEST_COMPANY_WEBHOOK_DESCRIPTION,
  arguments: testCompanyWebhookRequestObject,
  invoke: testCompanyWebhook,
};
