export const LIST_COMPANY_USERS_NAME = 'list_company_users';
export const LIST_COMPANY_USERS_DESCRIPTION =
  'Returns the list of users for the companyId identified in the path.';

export const GET_COMPANY_USER_DETAILS_NAME = 'get_company_user_details';
export const GET_COMPANY_USER_DETAILS_DESCRIPTION =
  'Returns user details for the userId and the companyId identified in the path.';

export const LIST_MERCHANT_USERS_NAME = 'list_merchant_users';
export const LIST_MERCHANT_USERS_DESCRIPTION =
  'Returns a list of users associated with the merchantId specified in the path.';

export const GET_MERCHANT_USER_DETAILS_NAME = 'get_merchant_user_details';
export const GET_MERCHANT_USER_DETAILS_DESCRIPTION =
  'Returns user details for the userId and the merchantId specified in the path.';

export const UPDATE_COMPANY_USER_NAME = 'update_company_user';
export const UPDATE_COMPANY_USER_DESCRIPTION =
  'Updates a company-level user identified by userId, email, or username (resolved to a single user internally). Can activate/deactivate, add or remove roles without overwriting, replace roles, and set associated merchant accounts. Returns an actionable error and makes no change when the identifier matches zero or multiple users. Bulk changes are done by calling this once per user.';

export const UPDATE_MERCHANT_USER_NAME = 'update_merchant_user';
export const UPDATE_MERCHANT_USER_DESCRIPTION =
  'Updates a merchant-level user identified by userId, email, or username (resolved to a single user internally). Can activate/deactivate and add, remove, or replace roles. Returns an actionable error and makes no change when the identifier matches zero or multiple users. Bulk changes are done by calling this once per user.';
