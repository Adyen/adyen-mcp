import { z } from 'zod';
import { Client, ManagementAPI } from '@adyen/api-library';
import { Tool } from '../../types.js';
import {
  GET_PAYMENT_METHODS_DETAILS_MERCHANT,
  GET_PAYMENT_METHODS_DETAILS_MERCHANT_DESCRIPTION,
  LIST_ALL_PAYMENT_METHODS_MERCHANT,
  LIST_ALL_PAYMENT_METHODS_MERCHANT_DESCRIPTION,
} from './constants.js';

const listAllPaymentMethodsRequestObject = z.object({
  merchantId: z.string(),
  pageSize: z.number().optional(),
  pageNumber: z.number().optional(),
  businessLineId: z.string().optional(),
  storeId: z.string().optional(),
});

const listAllPaymentMethods = async (
  client: Client,
  req: z.infer<typeof listAllPaymentMethodsRequestObject>,
) => {
  const { merchantId, pageSize, pageNumber, businessLineId, storeId } = req;

  const managementAPI = new ManagementAPI(client);
  try {
    return await managementAPI.PaymentMethodsMerchantLevelApi.getAllPaymentMethods(
      merchantId,
      businessLineId,
      storeId,
      pageSize,
      pageNumber,
    );
  } catch (e) {
    return (
      'Failed to list payment methods on merchant account. Error: ' +
      JSON.stringify(e)
    );
  }
};

export const listAllPaymentMethodsMerchant: Tool = {
  name: LIST_ALL_PAYMENT_METHODS_MERCHANT,
  description: LIST_ALL_PAYMENT_METHODS_MERCHANT_DESCRIPTION,
  arguments: listAllPaymentMethodsRequestObject,
  invoke: listAllPaymentMethods,
};

const getPaymentMethodsRequestObject = z.object({
  paymentMethodId: z.string(),
  merchantId: z.string(),
});

const getPaymentMethodsDetails = async (
  client: Client,
  req: z.infer<typeof getPaymentMethodsRequestObject>,
) => {
  const { paymentMethodId, merchantId } = req;

  const managementAPI = new ManagementAPI(client);
  try {
    return await managementAPI.PaymentMethodsMerchantLevelApi.getPaymentMethodDetails(
      merchantId,
      paymentMethodId,
    );
  } catch (e) {
    return (
      'Failed to list payment methods on merchant account. Error: ' +
      JSON.stringify(e)
    );
  }
};

export const getPaymentMethodsDetailsMerchant: Tool = {
  name: GET_PAYMENT_METHODS_DETAILS_MERCHANT,
  description: GET_PAYMENT_METHODS_DETAILS_MERCHANT_DESCRIPTION,
  arguments: getPaymentMethodsRequestObject,
  invoke: getPaymentMethodsDetails,
};
