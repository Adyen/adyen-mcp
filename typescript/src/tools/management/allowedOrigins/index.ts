import { z } from 'zod';
import { Client, ManagementAPI } from '@adyen/api-library';
import { Tool } from '../../types.js';

const listAllMerchantAllowedOriginsRequestObject = z.object({
  merchantId: z
    .string()
    .describe('The unique identifier of the merchant account.'),
  apiCredentialId: z
    .string()
    .describe('Unique identifier of the API credential.'),
});

const listAllMerchantAllowedOrigins = async (
  client: Client,
  {
    merchantId,
    apiCredentialId,
  }: z.infer<typeof listAllMerchantAllowedOriginsRequestObject>,
) => {
  const managementAPI = new ManagementAPI(client);
  try {
    return await managementAPI.AllowedOriginsMerchantLevelApi.listAllowedOrigins(
      merchantId,
      apiCredentialId,
    );
  } catch (e) {
    return (
      'Failed to list all api credential configurations on merchant account. Error: ' +
      JSON.stringify(e)
    );
  }
};

export const listAllMerchantAllowedOriginsTool: Tool = {
  name: 'list_all_merchant_allowed_origins',
  description:
    'Returns the list of allowed origins for the API credential identified in the path.',
  arguments: listAllMerchantAllowedOriginsRequestObject,
  invoke: listAllMerchantAllowedOrigins,
};

const listAllCompanyAllowedOriginsRequestObject = z.object({
  companyId: z
    .string()
    .describe('The unique identifier of the company account.'),
  apiCredentialId: z
    .string()
    .describe('Unique identifier of the API credential.'),
});

const listAllCompanyAllowedOrigins = async (
  client: Client,
  {
    companyId,
    apiCredentialId,
  }: z.infer<typeof listAllCompanyAllowedOriginsRequestObject>,
) => {
  const managementAPI = new ManagementAPI(client);
  try {
    return await managementAPI.AllowedOriginsCompanyLevelApi.listAllowedOrigins(
      companyId,
      apiCredentialId,
    );
  } catch (e) {
    return (
      'Failed to list all api credential configurations on company account. Error: ' +
      JSON.stringify(e)
    );
  }
};

export const listAllCompanyAllowedOriginsTool: Tool = {
  name: 'list_all_company_allowed_origins',
  description:
    'Returns the list of allowed origins for the API credential identified in the path.',
  arguments: listAllCompanyAllowedOriginsRequestObject,
  invoke: listAllCompanyAllowedOrigins,
};
