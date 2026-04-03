export const LIST_ALL_PAYMENT_METHODS_MERCHANT =
  'list_all_payment_methods_merchant';
export const LIST_ALL_PAYMENT_METHODS_MERCHANT_DESCRIPTION = `
    Returns details for all payment methods of the merchant account identified in the path.

    Args:
        merchantId (string): 
        pageSize (int, optional): The number of items to have on a page, maximum 100. The default is 10 items on a page.
        pageNumber (int, optional): The number of the page to fetch.
        businessLineId (string, optional): The unique identifier of the Business Line for which to return the payment methods.
        storeId (string, optional): The unique identifier of the store for which to return the payment methods.
   `;

export const GET_PAYMENT_METHODS_DETAILS_MERCHANT =
  'get_payment_methods_details_merchant';
export const GET_PAYMENT_METHODS_DETAILS_MERCHANT_DESCRIPTION = `
    Returns details for the merchant account and the payment method identified in the path.

    Args:
        merchantId (string): The unique identifier of the merchant account.
        paymentMethodId (string): The unique identifier of the payment method.
   `;
