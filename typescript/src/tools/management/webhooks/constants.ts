export const LIST_ALL_MERCHANT_WEBHOOKS = 'list_all_merchant_webhooks';
export const LIST_ALL_MERCHANT_WEBHOOKS_DESCRIPTION = `
    Lists all webhook configurations for the merchant account.

    Args:
        merchantId (string): The unique identifier of the merchant account.
        pageSize (int): The number of items to have on a page, maximum 100. The default is 10 items on a page.
        pageNumber (int): The number of the page to fetch. Default is 1.
   `;

export const GET_MERCHANT_WEBHOOK = 'get_merchant_webhook';
export const GET_MERCHANT_WEBHOOK_DESCRIPTION = `
    Returns the configuration for the webhook identified in the path.

    Args:
        merchantId (string): The unique identifier of the merchant account.
        webhookId (string): Unique identifier of the webhook configuration.
   `;

export const LIST_ALL_COMPANY_WEBHOOKS = 'list_all_company_webhooks';
export const LIST_ALL_COMPANY_WEBHOOKS_DESCRIPTION = `
    Lists all webhook configurations for the company account.

    Args:
        companyId (string): Unique identifier of the company account.
        pageSize (int): The number of items to have on a page, maximum 100. The default is 10 items on a page.
        pageNumber (int): The number of the page to fetch. Default is 1.
   `;

export const GET_COMPANY_WEBHOOK = 'get_company_webhook';
export const GET_COMPANY_WEBHOOK_DESCRIPTION = `
    Returns the configuration for the webhook identified in the path.

    Args:
        companyID (string): Unique identifier of the company account.
        webhookId (string): Unique identifier of the webhook configuration.
   `;

export const TEST_MERCHANT_WEBHOOK = 'test_merchant_webhook';
export const TEST_MERCHANT_WEBHOOK_DESCRIPTION = `
    Sends sample notifications to test if the webhook is set up correctly.

    Args:
        merchantId (string): The unique identifier of the merchant account.
        webhookId (string): Unique identifier of the webhook configuration.
        types (array[string]): List of event codes for which to send test notifications.
   `;

export const TEST_COMPANY_WEBHOOK = 'test_company_webhook';
export const TEST_COMPANY_WEBHOOK_DESCRIPTION = `
    Sends sample notifications to test if the webhook is set up correctly.

    Args:
        companyId (string): The unique identifier of the company account.
        webhookId (string): Unique identifier of the webhook configuration.
        types (array[string]): List of event codes for which to send test notifications.
        merchantIds (array[string]): List of merchantId values for which test webhooks will be sent.
   `;
