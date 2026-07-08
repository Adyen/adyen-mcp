import { z } from 'zod';
import { Client, ManagementAPI, Types } from '@adyen/api-library';
import { Tool } from '../../types.js';
import {
  LIST_COMPANY_USERS_NAME,
  LIST_COMPANY_USERS_DESCRIPTION,
  GET_COMPANY_USER_DETAILS_NAME,
  GET_COMPANY_USER_DETAILS_DESCRIPTION,
  LIST_MERCHANT_USERS_NAME,
  LIST_MERCHANT_USERS_DESCRIPTION,
  GET_MERCHANT_USER_DETAILS_NAME,
  GET_MERCHANT_USER_DETAILS_DESCRIPTION,
  UPDATE_COMPANY_USER_NAME,
  UPDATE_COMPANY_USER_DESCRIPTION,
  UPDATE_MERCHANT_USER_NAME,
  UPDATE_MERCHANT_USER_DESCRIPTION,
} from './constants.js';

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
  } catch (e: unknown) {
    return (
      'Failed to list company users. Error: ' +
      (e instanceof Error ? e.message : 'Unknown error')
    );
  }
};

export const listCompanyUsersTool: Tool = {
  name: LIST_COMPANY_USERS_NAME,
  description: LIST_COMPANY_USERS_DESCRIPTION,
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
  } catch (e: unknown) {
    return (
      'Failed to get company user details. Error: ' +
      (e instanceof Error ? e.message : 'Unknown error')
    );
  }
};

export const getCompanyUserDetailsTool: Tool = {
  name: GET_COMPANY_USER_DETAILS_NAME,
  description: GET_COMPANY_USER_DETAILS_DESCRIPTION,
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
  } catch (e: unknown) {
    return (
      'Failed to list merchant users. Error: ' +
      (e instanceof Error ? e.message : 'Unknown error')
    );
  }
};

export const listMerchantUsersTool: Tool = {
  name: LIST_MERCHANT_USERS_NAME,
  description: LIST_MERCHANT_USERS_DESCRIPTION,
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
  } catch (e: unknown) {
    return (
      'Failed to get merchant user details. Error: ' +
      (e instanceof Error ? e.message : 'Unknown error')
    );
  }
};

export const getMerchantUserDetailsTool: Tool = {
  name: GET_MERCHANT_USER_DETAILS_NAME,
  description: GET_MERCHANT_USER_DETAILS_DESCRIPTION,
  arguments: getMerchantUserDetailsRequestObject,
  invoke: getMerchantUserDetails,
};

type ResolvableUser = {
  id: string;
  email: string;
  username: string;
  roles: Array<string>;
};

type UserResolution = { user: ResolvableUser } | { error: string };

const resolveUser = async <T extends ResolvableUser>(
  listPage: (
    pageNumber: number,
    pageSize: number,
    userName?: string,
  ) => Promise<{ data?: Array<T>; pagesTotal?: number }>,
  identifier: { email?: string; username?: string },
): Promise<UserResolution> => {
  const term = identifier.username ?? identifier.email ?? '';
  const pageSize = 100;
  const matches = new Map<string, T>();

  let pageNumber = 1;
  let pagesTotal = 1;
  do {
    const response = await listPage(pageNumber, pageSize, term);
    for (const user of response.data ?? []) {
      const matchesUsername =
        identifier.username !== undefined &&
        user.username?.toLowerCase() === identifier.username.toLowerCase();
      const matchesEmail =
        identifier.email !== undefined &&
        user.email?.toLowerCase() === identifier.email.toLowerCase();
      if (matchesUsername || matchesEmail) {
        matches.set(user.id, user);
      }
    }
    pagesTotal = response.pagesTotal ?? 1;
    pageNumber += 1;
  } while (pageNumber <= pagesTotal);

  const found = Array.from(matches.values());
  if (found.length === 0) {
    return { error: `No user found matching "${term}". No update performed.` };
  }
  if (found.length > 1) {
    return {
      error: `Found ${found.length} users matching "${term}". Provide a more specific identifier. No update performed.`,
    };
  }
  return { user: found[0] };
};

const applyRoleDelta = (
  currentRoles: Array<string>,
  opts: {
    roles?: Array<string>;
    addRoles?: Array<string>;
    removeRoles?: Array<string>;
  },
): Array<string> | undefined => {
  if (
    opts.roles === undefined &&
    opts.addRoles === undefined &&
    opts.removeRoles === undefined
  ) {
    return undefined;
  }
  const next = new Set(opts.roles ?? currentRoles ?? []);
  (opts.addRoles ?? []).forEach((role) => next.add(role));
  (opts.removeRoles ?? []).forEach((role) => next.delete(role));
  return Array.from(next);
};

const userIdentifierFields = {
  userId: z
    .string()
    .optional()
    .describe(
      'The unique identifier of the user. If omitted, provide email or username to resolve the user.',
    ),
  email: z
    .string()
    .optional()
    .describe(
      'The email address of the user, used to resolve the user when userId is not provided.',
    ),
  username: z
    .string()
    .optional()
    .describe(
      'The username of the user, used to resolve the user when userId is not provided.',
    ),
  active: z
    .boolean()
    .optional()
    .describe(
      'Set to false to deactivate the user, or true to reactivate the user.',
    ),
  roles: z
    .array(z.string())
    .optional()
    .describe(
      'The complete list of roles for this user. This replaces all existing roles. Prefer addRoles/removeRoles to change roles without overwriting.',
    ),
  addRoles: z
    .array(z.string())
    .optional()
    .describe('Roles to add to the user without removing existing roles.'),
  removeRoles: z
    .array(z.string())
    .optional()
    .describe('Roles to remove from the user, keeping the remaining roles.'),
};

const updateCompanyUserRequestObject = z.object({
  companyId: z
    .string()
    .describe('The unique identifier of the company account.'),
  ...userIdentifierFields,
  associatedMerchantAccounts: z
    .array(z.string())
    .optional()
    .describe('The list of merchant accounts to associate the user with.'),
});

const updateCompanyUser = async (
  client: Client,
  req: z.infer<typeof updateCompanyUserRequestObject>,
) => {
  const {
    companyId,
    userId,
    email,
    username,
    active,
    roles,
    addRoles,
    removeRoles,
    associatedMerchantAccounts,
  } = req;

  if (!userId && !email && !username) {
    return 'Failed to update company user. Error: provide one of userId, email, or username to identify the user.';
  }

  const managementAPI = new ManagementAPI(client);
  try {
    const needsCurrentRoles =
      addRoles !== undefined || removeRoles !== undefined;
    let resolvedUserId = userId;
    let currentRoles: Array<string> = [];

    if (!resolvedUserId) {
      const resolution = await resolveUser(
        (pageNumber, pageSize, userName) =>
          managementAPI.UsersCompanyLevelApi.listUsers(
            companyId,
            pageNumber,
            pageSize,
            userName,
          ),
        { email, username },
      );
      if ('error' in resolution) {
        return 'Failed to update company user. Error: ' + resolution.error;
      }
      resolvedUserId = resolution.user.id;
      currentRoles = resolution.user.roles ?? [];
    } else if (needsCurrentRoles) {
      const user = await managementAPI.UsersCompanyLevelApi.getUserDetails(
        companyId,
        resolvedUserId,
      );
      currentRoles = user.roles ?? [];
    }

    const request: Types.management.UpdateCompanyUserRequest = {};
    if (active !== undefined) request.active = active;
    if (associatedMerchantAccounts !== undefined) {
      request.associatedMerchantAccounts = associatedMerchantAccounts;
    }
    const nextRoles = applyRoleDelta(currentRoles, {
      roles,
      addRoles,
      removeRoles,
    });
    if (nextRoles !== undefined) request.roles = nextRoles;

    return await managementAPI.UsersCompanyLevelApi.updateUserDetails(
      companyId,
      resolvedUserId,
      request,
    );
  } catch (e: unknown) {
    return (
      'Failed to update company user. Error: ' +
      (e instanceof Error ? e.message : 'Unknown error')
    );
  }
};

export const updateCompanyUserTool: Tool = {
  name: UPDATE_COMPANY_USER_NAME,
  description: UPDATE_COMPANY_USER_DESCRIPTION,
  arguments: updateCompanyUserRequestObject,
  invoke: updateCompanyUser,
};

const updateMerchantUserRequestObject = z.object({
  merchantId: z.string().describe('Unique identifier of the merchant.'),
  ...userIdentifierFields,
});

const updateMerchantUser = async (
  client: Client,
  req: z.infer<typeof updateMerchantUserRequestObject>,
) => {
  const {
    merchantId,
    userId,
    email,
    username,
    active,
    roles,
    addRoles,
    removeRoles,
  } = req;

  if (!userId && !email && !username) {
    return 'Failed to update merchant user. Error: provide one of userId, email, or username to identify the user.';
  }

  const managementAPI = new ManagementAPI(client);
  try {
    const needsCurrentRoles =
      addRoles !== undefined || removeRoles !== undefined;
    let resolvedUserId = userId;
    let currentRoles: Array<string> = [];

    if (!resolvedUserId) {
      const resolution = await resolveUser(
        (pageNumber, pageSize, userName) =>
          managementAPI.UsersMerchantLevelApi.listUsers(
            merchantId,
            pageNumber,
            pageSize,
            userName,
          ),
        { email, username },
      );
      if ('error' in resolution) {
        return 'Failed to update merchant user. Error: ' + resolution.error;
      }
      resolvedUserId = resolution.user.id;
      currentRoles = resolution.user.roles ?? [];
    } else if (needsCurrentRoles) {
      const user = await managementAPI.UsersMerchantLevelApi.getUserDetails(
        merchantId,
        resolvedUserId,
      );
      currentRoles = user.roles ?? [];
    }

    const request: Types.management.UpdateMerchantUserRequest = {};
    if (active !== undefined) request.active = active;
    const nextRoles = applyRoleDelta(currentRoles, {
      roles,
      addRoles,
      removeRoles,
    });
    if (nextRoles !== undefined) request.roles = nextRoles;

    return await managementAPI.UsersMerchantLevelApi.updateUser(
      merchantId,
      resolvedUserId,
      request,
    );
  } catch (e: unknown) {
    return (
      'Failed to update merchant user. Error: ' +
      (e instanceof Error ? e.message : 'Unknown error')
    );
  }
};

export const updateMerchantUserTool: Tool = {
  name: UPDATE_MERCHANT_USER_NAME,
  description: UPDATE_MERCHANT_USER_DESCRIPTION,
  arguments: updateMerchantUserRequestObject,
  invoke: updateMerchantUser,
};
