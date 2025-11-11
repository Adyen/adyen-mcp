import { z } from "zod";
import { CheckoutAPI, Client, Types } from "@adyen/api-library";
import {
  CANCEL_PAYMENT_DESCRIPTION,
  CANCEL_PAYMENT_NAME,
  REFUND_PAYMENT_DESCRIPTION,
  REFUND_PAYMENT_NAME,
} from "./constants";
import { Tool } from "../types";

const refundPaymentRequestShape: z.ZodRawShape = {
  pspReference: z.string(),
  currency: z.string(),
  value: z.number(),
  merchantAccount: z.string(),
  reference: z.string(),
};

const refundPaymentObject = z.object(refundPaymentRequestShape);

const refundPayment = async (
  client: Client,
  refundPaymentRequest: z.infer<typeof refundPaymentObject>,
) => {
  const { pspReference, currency, value, merchantAccount, reference } =
    refundPaymentRequest;
  const amount: Types.checkout.Amount = {
    currency,
    value,
  };

  const paymentRefundRequest: Types.checkout.PaymentRefundRequest = {
    amount,
    merchantAccount,
    reference,
  };

  const checkoutAPI = new CheckoutAPI(client);
  try {
    return await checkoutAPI.ModificationsApi.refundCapturedPayment(
      pspReference,
      paymentRefundRequest,
    );
  } catch (e) {
    return "Failed to refund payment. Error: " + JSON.stringify(e);
  }
};

const cancelPaymentRequestShape: z.ZodRawShape = {
  paymentReference: z.string(),
  merchantAccount: z.string(),
};

const cancelPaymentObject = z.object(cancelPaymentRequestShape);

const cancelPayment = async (
  client: Client,
  cancelPaymentRequest: z.infer<typeof cancelPaymentObject>,
) => {
  const { paymentReference, merchantAccount } = cancelPaymentRequest;
  const paymentRefundRequest: Types.checkout.StandalonePaymentCancelRequest = {
    paymentReference,
    merchantAccount,
  };

  const checkoutAPI = new CheckoutAPI(client);
  try {
    return await checkoutAPI.ModificationsApi.cancelAuthorisedPayment(
      paymentRefundRequest,
    );
  } catch (e) {
    return "Failed to cancel payment. Error: " + JSON.stringify(e);
  }
};

export const refundPaymentTool: Tool = {
  name: REFUND_PAYMENT_NAME,
  description: REFUND_PAYMENT_DESCRIPTION,
  arguments: refundPaymentObject,
  invoke: refundPayment,
};

export const cancelPaymentTool: Tool = {
  name: CANCEL_PAYMENT_NAME,
  description: CANCEL_PAYMENT_DESCRIPTION,
  arguments: cancelPaymentObject,
  invoke: cancelPayment,
};
