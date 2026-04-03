import { z } from 'zod';
import { Client, ManagementAPI } from '@adyen/api-library';
import { Tool } from '../../types.js';

const listAllMerchantApiCredentialsRequestObject = z.object({
  merchantId: z
    .string()
    .describe('The unique identifier of the merchant account.'),
  pageSize: z
    .number()
    .optional()
    .describe(
      'The number of items to have on a page, maximum 100. The default is 10 items on a page.',
    ),
  pageNumber: z
    .number()
    .optional()
    .describe('The number of the page to fetch.'),
});

const listAllMerchantApiCredentials = async (
  client: Client,
  {
    merchantId,
    pageSize,
    pageNumber,
  }: z.infer<typeof listAllMerchantApiCredentialsRequestObject>,
) => {
  const managementAPI = new ManagementAPI(client);
  try {
    return await managementAPI.APICredentialsMerchantLevelApi.listApiCredentials(
      merchantId,
      pageNumber,
      pageSize,
    );
  } catch (e) {
    return (
      'Failed to list all api credential configurations on merchant account. Error: ' +
      JSON.stringify(e)
    );
  }
};

export const listAllMerchantApiCredentialsTool: Tool = {
  name: 'list_all_merchant_api_credentials',
  description:
    'Returns the list of API credentials for the merchant account. The list is grouped into pages as defined by the query parameters.',
  arguments: listAllMerchantApiCredentialsRequestObject,
  invoke: listAllMerchantApiCredentials,
};

const listAllCompanyApiCredentialsRequestObject = z.object({
  companyId: z
    .string()
    .describe('The unique identifier of the company account.'),
  pageSize: z
    .number()
    .optional()
    .describe(
      'The number of items to have on a page, maximum 100. The default is 10 items on a page.',
    ),
  pageNumber: z
    .number()
    .optional()
    .describe('The number of the page to fetch.'),
});

const listAllCompanyApiCredentials = async (
  client: Client,
  {
    companyId,
    pageNumber,
    pageSize,
  }: z.infer<typeof listAllCompanyApiCredentialsRequestObject>,
) => {
  const managementAPI = new ManagementAPI(client);
  try {
    return await managementAPI.APICredentialsCompanyLevelApi.listApiCredentials(
      companyId,
      pageNumber,
      pageSize,
    );
  } catch (e) {
    return (
      'Failed to list all api credential configurations on company account. Error: ' +
      JSON.stringify(e)
    );
  }
};

export const listAllCompanyApiCredentialsTool: Tool = {
  name: 'list_all_company_api_credentials',
  description:
    'Returns the list of API credentials for the company account. The list is grouped into pages as defined by the query parameters.',
  arguments: listAllCompanyApiCredentialsRequestObject,
  invoke: listAllCompanyApiCredentials,
};
