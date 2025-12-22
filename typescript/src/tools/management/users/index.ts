import { z } from 'zod';
import { Client, ManagementAPI } from '@adyen/api-library';
import { Tool } from '../../types.js';

const listCompanyUsersRequestObject = z.object({
  companyId: z
    .string()
    .describe('The unique identifier of the company account.'),
  pageSize: z
    .number()
    .optional()
    .describe(
      'The number of items to have on a page. Maximum value is 100. The default is 10 items on a page.',
    ),
  pageNumber: z
    .number()
    .optional()
    .describe('The number of the page to return.'),
  userName: z
    .string()
    .optional()
    .describe(
      'The partial or complete username to select all users that match.',
    ),
});

const listCompanyUsers = async (
  client: Client,
  req: z.infer<typeof listCompanyUsersRequestObject>,
) => {
  const { companyId, pageNumber, pageSize, userName } = req;

  const managementAPI = new ManagementAPI(client);
  try {
    return await managementAPI.UsersCompanyLevelApi.listUsers(
      companyId,
      pageNumber,
      pageSize,
      userName,
    );
  } catch (e) {
    return 'Failed to list company users. Error: ' + JSON.stringify(e);
  }
};

export const listCompanyUsersTool: Tool = {
  name: 'list_company_users',
  description:
    'Returns the list of users for the companyId identified in the path.',
  arguments: listCompanyUsersRequestObject,
  invoke: listCompanyUsers,
};

const getCompanyUserDetailsRequestObject = z.object({
  companyId: z
    .string()
    .describe('The unique identifier of the company account.'),
  userId: z.string().describe('The unique identifier of the user.'),
});

const getCompanyUserDetails = async (
  client: Client,
  req: z.infer<typeof getCompanyUserDetailsRequestObject>,
) => {
  const { companyId, userId } = req;

  const managementAPI = new ManagementAPI(client);
  try {
    return await managementAPI.UsersCompanyLevelApi.getUserDetails(
      companyId,
      userId,
    );
  } catch (e) {
    return 'Failed to get company user details. Error: ' + JSON.stringify(e);
  }
};

export const getCompanyUserDetailsTool: Tool = {
  name: 'get_company_user_details',
  description:
    'Returns user details for the userId and the companyId identified in the path.',
  arguments: getCompanyUserDetailsRequestObject,
  invoke: getCompanyUserDetails,
};

const listMerchantUsersRequestObject = z.object({
  merchantId: z.string().describe('Unique identifier of the merchant.'),
  pageSize: z
    .number()
    .optional()
    .describe(
      'The number of items to have on a page. Maximum value is 100. The default is 10 items on a page.',
    ),
  pageNumber: z
    .number()
    .optional()
    .describe('The number of the page to return.'),
  userName: z
    .string()
    .optional()
    .describe(
      'The partial or complete username to select all users that match.',
    ),
});

const listMerchantUsers = async (
  client: Client,
  req: z.infer<typeof listMerchantUsersRequestObject>,
) => {
  const { merchantId, pageNumber, pageSize, userName } = req;

  const managementAPI = new ManagementAPI(client);
  try {
    return await managementAPI.UsersMerchantLevelApi.listUsers(
      merchantId,
      pageNumber,
      pageSize,
      userName,
    );
  } catch (e) {
    return 'Failed to list merchant users. Error: ' + JSON.stringify(e);
  }
};

export const listMerchantUsersTool: Tool = {
  name: 'list_merchant_users',
  description:
    'Returns a list of users associated with the merchantId specified in the path.',
  arguments: listMerchantUsersRequestObject,
  invoke: listMerchantUsers,
};

const getMerchantUserDetailsRequestObject = z.object({
  merchantId: z.string().describe('Unique identifier of the merchant.'),
  userId: z.string().describe('The unique identifier of the user.'),
});

const getMerchantUserDetails = async (
  client: Client,
  req: z.infer<typeof getMerchantUserDetailsRequestObject>,
) => {
  const { merchantId, userId } = req;

  const managementAPI = new ManagementAPI(client);
  try {
    return await managementAPI.UsersMerchantLevelApi.getUserDetails(
      merchantId,
      userId,
    );
  } catch (e) {
    return 'Failed to get merchant user details. Error: ' + JSON.stringify(e);
  }
};

export const getMerchantUserDetailsTool: Tool = {
  name: 'get_merchant_user_details',
  description:
    'Returns user details for the userId and the merchantId specified in the path.',
  arguments: getMerchantUserDetailsRequestObject,
  invoke: getMerchantUserDetails,
};
