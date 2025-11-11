import { z } from "zod";
import { CheckoutAPI, Client, Types } from "@adyen/api-library";
import {
  CREATE_PAYMENT_LINKS_DESCRIPTION,
  CREATE_PAYMENT_LINKS_NAME,
  GET_PAYMENT_LINK_DESCRIPTION,
  GET_PAYMENT_LINK_NAME,
  UPDATE_PAYMENT_LINK_DESCRIPTION,
  UPDATE_PAYMENT_LINK_NAME,
} from "./constants";
import { Tool } from "../types";

const createPaymentLinkRequestShape: z.ZodRawShape = {
  currency: z.string(),
  value: z.number(),
  merchantAccount: z.string(),
  countryCode: z.string(),
  reference: z.string(),
};

const createPaymentLinkObject = z.object(createPaymentLinkRequestShape);

const createPaymentLink = async (
  client: Client,
  paymentRequest: z.infer<typeof createPaymentLinkObject>,
) => {
  const { currency, value, merchantAccount, countryCode, reference } =
    paymentRequest;
  const amount: Types.checkout.Amount = {
    currency,
    value,
  };

  const paymentLinkRequest: Types.checkout.PaymentLinkRequest = {
    amount,
    merchantAccount,
    countryCode,
    reference,
  };

  const checkoutAPI = new CheckoutAPI(client);
  try {
    return await checkoutAPI.PaymentLinksApi.paymentLinks(paymentLinkRequest);
  } catch (e) {
    return "Failed to create payment link. Error: " + JSON.stringify(e);
  }
};

const getPaymentLinkRequestShape: z.ZodRawShape = {
  linkId: z.string(),
};

const getPaymentLinkObject = z.object(getPaymentLinkRequestShape);

const updatePaymentLinkRequestShape: z.ZodRawShape = {
  linkId: z.string(),
  status: z.string(),
};

const updatePaymentLinkObject = z.object(updatePaymentLinkRequestShape);

const getPaymentLink = async (
  client: Client,
  getPaymentLinkRequest: z.infer<typeof getPaymentLinkObject>,
) => {
  const { linkId } = getPaymentLinkRequest;

  const checkoutAPI = new CheckoutAPI(client);
  try {
    return await checkoutAPI.PaymentLinksApi.getPaymentLink(linkId);
  } catch (e) {
    return "Failed to get payment link. Error: " + JSON.stringify(e);
  }
};

const updatePaymentLink = async (
  client: Client,
  updatePaymentLinkRequest: z.infer<typeof updatePaymentLinkObject>,
) => {
  const { linkId, status } = updatePaymentLinkRequest;

  const checkoutAPI = new CheckoutAPI(client);
  try {
    return await checkoutAPI.PaymentLinksApi.updatePaymentLink(linkId, {
      status,
    });
  } catch (e) {
    return "Failed to update payment link. Error: " + JSON.stringify(e);
  }
};

export const createPaymentLinkTool: Tool = {
  name: CREATE_PAYMENT_LINKS_NAME,
  description: CREATE_PAYMENT_LINKS_DESCRIPTION,
  arguments: createPaymentLinkObject,
  invoke: createPaymentLink,
};

export const getPaymentLinkTool: Tool = {
  name: GET_PAYMENT_LINK_NAME,
  description: GET_PAYMENT_LINK_DESCRIPTION,
  arguments: getPaymentLinkObject,
  invoke: getPaymentLink,
};

export const updatePaymentLinkTool: Tool = {
  name: UPDATE_PAYMENT_LINK_NAME,
  description: UPDATE_PAYMENT_LINK_DESCRIPTION,
  arguments: updatePaymentLinkObject,
  invoke: updatePaymentLink,
};
