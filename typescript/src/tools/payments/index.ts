import { z } from "zod";
import { CheckoutAPI, Client, Types } from "@adyen/api-library";
import {
  CREATE_PAYMENT_SESSION_DESCRIPTION,
  CREATE_PAYMENT_SESSION_NAME,
  GET_PAYMENT_METHODS_DESCRIPTION,
  GET_PAYMENT_METHODS_NAME,
  GET_PAYMENT_SESSION_DESCRIPTION, GET_PAYMENT_SESSION_NAME,
} from "./constants";
import { Tool } from "../types";

const paymentSessionRequestShape: z.ZodRawShape = {
  currency: z.string(),
  value: z.number(),
  merchantAccount: z.string(),
  reference: z.string(),
  returnUrl: z.string(),
};

const paymentSessionObject = z.object(paymentSessionRequestShape);

const createPaymentSession = async (
  client: Client,
  paymentSessionRequest: z.infer<typeof paymentSessionObject>
) => {
  const { currency, value, merchantAccount, reference, returnUrl } =
    paymentSessionRequest;
  const amount: Types.checkout.Amount = {
    currency,
    value,
  };

  const createCheckoutSessionRequest: Types.checkout.CreateCheckoutSessionRequest =
    {
      amount,
      merchantAccount,
      reference,
      returnUrl,
    };

  const checkoutAPI = new CheckoutAPI(client);
  try {
    return await checkoutAPI.PaymentsApi.sessions(createCheckoutSessionRequest);
  } catch (e) {
    return "Failed to create checkout session. Error: " + JSON.stringify(e);
  }
};

const getPaymentSessionRequestShape: z.ZodRawShape = {
  sessionId: z.string(),
};

const getPaymentSessionObject = z.object(getPaymentSessionRequestShape);

const getPaymentSession = async (
    client: Client,
    getPaymentSessionRequest: z.infer<typeof paymentSessionObject>
) => {
  const { sessionId } =
      getPaymentSessionRequest;

  const checkoutAPI = new CheckoutAPI(client);
  try {
    return await checkoutAPI.PaymentsApi.getResultOfPaymentSession(sessionId);
  } catch (e) {
    return "Failed to get the result of the payment session. Error: " + JSON.stringify(e);
  }
};

const getPaymentMethodsRequestShape: z.ZodRawShape = {
  merchantAccount: z.string(),
};

const getPaymentMethodsObject = z.object(getPaymentMethodsRequestShape);

const getPaymentMethods = async (
    client: Client,
    getPaymentMethodsRequest: z.infer<typeof getPaymentMethodsObject>
) => {
  const { merchantAccount } =
      getPaymentMethodsRequest;

  const getCheckoutPaymentMethodsRequest: Types.checkout.PaymentMethodsRequest = {
    merchantAccount
  }

  const checkoutAPI = new CheckoutAPI(client);
  try {
    return await checkoutAPI.PaymentsApi.paymentMethods(getCheckoutPaymentMethodsRequest);
  } catch (e) {
    return "Failed to create checkout session. Error: " + JSON.stringify(e);
  }
};

export const createPaymentSessionTool: Tool = {
  name: CREATE_PAYMENT_SESSION_NAME,
  description: CREATE_PAYMENT_SESSION_DESCRIPTION,
  arguments: paymentSessionObject,
  invoke: createPaymentSession,
};

export const getPaymentSessionTool: Tool = {
  name: GET_PAYMENT_SESSION_NAME,
  description: GET_PAYMENT_SESSION_DESCRIPTION,
  arguments: getPaymentSessionObject,
  invoke: getPaymentSession,
};

export const getPaymentMethodsTool: Tool = {
  name: GET_PAYMENT_METHODS_NAME,
  description: GET_PAYMENT_METHODS_DESCRIPTION,
  arguments: getPaymentMethodsObject,
  invoke: getPaymentMethods,
};