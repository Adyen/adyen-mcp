import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Client, CheckoutAPI } from '@adyen/api-library';

vi.mock('@adyen/api-library');

const mockClient = {} as Client;

const refundArgs = {
  pspReference: 'PSP123',
  currency: 'EUR',
  value: 2000,
  merchantAccount: 'TestMerchant',
  reference: 'refund-1',
};

// What the Adyen library rejects with when a request times out or the connection fails:
// an ApiException, which is not an Error subclass and carries no HTTP response.
const transportFailure = (message: string) => ({
  name: 'ApiException',
  message,
  statusCode: 500,
});

const httpError = (status: number, message: string) => {
  const error = new Error(`HTTP Exception: ${status}. ${message}`);
  (error as any).name = 'HttpClientException';
  (error as any).statusCode = status;
  return error;
};

describe('checkout/modifications idempotency', () => {
  let tools: typeof import('../src/tools/checkout/modifications/index.js');
  let mockRefund: ReturnType<typeof vi.fn>;
  let mockCancel: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    mockRefund = vi.fn().mockResolvedValue({ pspReference: 'REFUND1' });
    mockCancel = vi.fn().mockResolvedValue({ pspReference: 'CANCEL1' });
    vi.mocked(CheckoutAPI).mockImplementation(function () {
      return {
        ModificationsApi: {
          refundCapturedPayment: mockRefund,
          cancelAuthorisedPayment: mockCancel,
        },
      } as any;
    });
    tools = await import('../src/tools/checkout/modifications/index.js');
  });

  it('sends the same derived idempotency key when a refund is repeated', async () => {
    await tools.refundPaymentTool.invoke(mockClient, refundArgs);
    await tools.refundPaymentTool.invoke(mockClient, { ...refundArgs });

    const first = mockRefund.mock.calls[0][2];
    const second = mockRefund.mock.calls[1][2];
    expect(first.idempotencyKey).toMatch(/^[0-9a-f]{64}$/);
    expect(second).toEqual(first);
  });

  it('derives a different key when the refund details differ', async () => {
    await tools.refundPaymentTool.invoke(mockClient, refundArgs);
    await tools.refundPaymentTool.invoke(mockClient, {
      ...refundArgs,
      reference: 'refund-2',
    });
    await tools.refundPaymentTool.invoke(mockClient, {
      ...refundArgs,
      value: 2001,
    });

    const keys = mockRefund.mock.calls.map((call) => call[2].idempotencyKey);
    expect(new Set(keys).size).toBe(3);
  });

  it('uses the idempotency key given by the caller', async () => {
    await tools.refundPaymentTool.invoke(mockClient, {
      ...refundArgs,
      idempotencyKey: 'caller-key-1',
    });
    expect(mockRefund.mock.calls[0][2]).toEqual({
      idempotencyKey: 'caller-key-1',
    });
  });

  it('rejects an idempotency key longer than 64 characters', () => {
    const parsed = tools.refundPaymentTool.arguments.safeParse({
      ...refundArgs,
      idempotencyKey: 'x'.repeat(65),
    });
    expect(parsed.success).toBe(false);
  });

  it('reports a refund without a response as unknown, not failed', async () => {
    mockRefund.mockRejectedValue(transportFailure('socket hang up'));
    const result = await tools.refundPaymentTool.invoke(mockClient, refundArgs);
    const key = mockRefund.mock.calls[0][2].idempotencyKey;

    expect(result).toMatch(/^Outcome unknown/);
    expect(result).toContain('socket hang up');
    expect(result).toContain(key);
    expect(result).not.toContain('Unknown error');
  });

  it('still reports an HTTP error from Adyen as a failure', async () => {
    mockRefund.mockRejectedValue(httpError(422, 'Unprocessable Entity'));
    const result = await tools.refundPaymentTool.invoke(mockClient, refundArgs);
    expect(result).toBe(
      'Failed to refund payment. Error: HTTP Exception: 422. Unprocessable Entity',
    );
  });

  it('reports an invalid API key as a failure', async () => {
    mockRefund.mockRejectedValue({
      name: 'ApiException',
      message: 'Invalid X-API-Key was used',
      statusCode: 401,
    });
    const result = await tools.refundPaymentTool.invoke(mockClient, refundArgs);
    expect(result).toBe(
      'Failed to refund payment. Error: Invalid X-API-Key was used',
    );
  });

  it('sends a derived idempotency key on cancel and reports an unknown outcome', async () => {
    const cancelArgs = {
      paymentReference: 'order-1',
      merchantAccount: 'TestMerchant',
    };
    await tools.cancelPaymentTool.invoke(mockClient, cancelArgs);
    mockCancel.mockRejectedValue(transportFailure('read ECONNRESET'));
    const result = await tools.cancelPaymentTool.invoke(mockClient, cancelArgs);

    const [first, second] = mockCancel.mock.calls.map((call) => call[1]);
    expect(first.idempotencyKey).toMatch(/^[0-9a-f]{64}$/);
    expect(second).toEqual(first);
    expect(result).toMatch(/^Outcome unknown/);
  });
});
