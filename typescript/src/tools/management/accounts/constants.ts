export const LIST_MERCHANT_ACCOUNTS_NAME = 'list_merchant_accounts';
export const LIST_MERCHANT_ACCOUNTS_DESCRIPTION = `
    Get a list of merchant accounts

    Args:
        pageSize (int): The number of items to have on a page, maximum 100. The default is 10 items on a page.
        pageNumber (int): The number of the page to fetch.
   `;

export const GET_MERCHANT_ACCOUNTS_NAME = 'get_merchant_account';
export const GET_MERCHANT_ACCOUNTS_DESCRIPTION = `
    Get a single merchant account

    Args:
        merchantId (str): The unique identifier of the merchant account.
   `;
