import { createHash } from 'node:crypto';
import { z } from 'zod';
import { CheckoutAPI, Client, Types } from '@adyen/api-library';
import {
  CANCEL_PAYMENT_DESCRIPTION,
  CANCEL_PAYMENT_NAME,
  REFUND_PAYMENT_DESCRIPTION,
  REFUND_PAYMENT_NAME,
} from './constants.js';
import { Tool } from '../../types.js';
import { writes } from '../../annotations.js';

// Adyen accepts idempotency keys of up to 64 characters; a SHA-256 hex digest is exactly 64.
const idempotencyKeySchema = z.string().min(1).max(64).optional();

/**
 * Derives an idempotency key from the arguments that define a modification, so that the
 * same call made again (for example after a timeout) is replayed by Adyen instead of being
 * processed a second time. A caller who means a second, identical modification passes its
 * own key.
 */
export const deriveIdempotencyKey = (
  operation: string,
  ...parts: (string | number)[]
): string =>
  createHash('sha256')
    .update(JSON.stringify([operation, ...parts]))
    .digest('hex');

const errorMessage = (e: unknown): string => {
  if (e instanceof Error) {
    return e.message;
  }
  if (
    typeof e === 'object' &&
    e !== null &&
    typeof (e as { message?: unknown }).message === 'string'
  ) {
    return (e as { message: string }).message;
  }
  return 'Unknown error';
};

/**
 * True when the request may have reached Adyen but no response came back: the library
 * rejects timeouts, resets and other transport errors with an ApiException (which is not an
 * Error subclass and has no HTTP response), and a response cut off midway with a plain Error.
 */
const isOutcomeUnknown = (e: unknown): boolean => {
  if (e instanceof Error) {
    return e.message.startsWith('The connection was terminated');
  }
  if (typeof e === 'object' && e !== null) {
    const { name, statusCode } = e as { name?: unknown; statusCode?: unknown };
    return (
      name === 'ApiException' &&
      (typeof statusCode !== 'number' || statusCode >= 500)
    );
  }
  return false;
};

const outcomeUnknown = (
  operation: string,
  e: unknown,
  idempotencyKey: string,
): string =>
  `Outcome unknown: the ${operation} request got no response from Adyen (${errorMessage(e)}), ` +
  `so the ${operation} may have been made. Do not treat it as failed. ` +
  `Calling again with the same arguments and idempotencyKey "${idempotencyKey}" is safe: ` +
  `Adyen returns the result of the first request instead of processing it again.`;

const refundPaymentRequestShape: z.ZodRawShape = {
  pspReference: z.string(),
  currency: z.string(),
  value: z.number(),
  merchantAccount: z.string(),
  reference: z.string(),
  idempotencyKey: idempotencyKeySchema,
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

  const idempotencyKey =
    refundPaymentRequest.idempotencyKey ??
    deriveIdempotencyKey(
      'refund',
      pspReference,
      merchantAccount,
      currency,
      value,
      reference,
    );

  const checkoutAPI = new CheckoutAPI(client);
  try {
    return await checkoutAPI.ModificationsApi.refundCapturedPayment(
      pspReference,
      paymentRefundRequest,
      { idempotencyKey },
    );
  } catch (e: unknown) {
    if (isOutcomeUnknown(e)) {
      return outcomeUnknown('refund', e, idempotencyKey);
    }
    return 'Failed to refund payment. Error: ' + errorMessage(e);
  }
};

const cancelPaymentRequestShape: z.ZodRawShape = {
  paymentReference: z.string(),
  merchantAccount: z.string(),
  idempotencyKey: idempotencyKeySchema,
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

  const idempotencyKey =
    cancelPaymentRequest.idempotencyKey ??
    deriveIdempotencyKey('cancel', paymentReference, merchantAccount);

  const checkoutAPI = new CheckoutAPI(client);
  try {
    return await checkoutAPI.ModificationsApi.cancelAuthorisedPayment(
      paymentRefundRequest,
      { idempotencyKey },
    );
  } catch (e: unknown) {
    if (isOutcomeUnknown(e)) {
      return outcomeUnknown('cancel', e, idempotencyKey);
    }
    return 'Failed to cancel payment. Error: ' + errorMessage(e);
  }
};

export const refundPaymentTool: Tool = {
  name: REFUND_PAYMENT_NAME,
  annotations: writes('Refund payment', { destructive: true }),
  description: REFUND_PAYMENT_DESCRIPTION,
  arguments: refundPaymentObject,
  invoke: refundPayment,
};

export const cancelPaymentTool: Tool = {
  name: CANCEL_PAYMENT_NAME,
  annotations: writes('Cancel payment', { destructive: true }),
  description: CANCEL_PAYMENT_DESCRIPTION,
  arguments: cancelPaymentObject,
  invoke: cancelPayment,
};
