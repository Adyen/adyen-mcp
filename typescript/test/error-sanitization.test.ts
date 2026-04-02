import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Client, CheckoutAPI, ManagementAPI, BalancePlatformAPI, LegalEntityManagementAPI } from '@adyen/api-library';

vi.mock('@adyen/api-library');

const SENSITIVE_FIELDS = ['JSESSIONID', 'www-authenticate', 'traceparent', 'responseHeaders', 'set-cookie'];

function createAdyenHttpError(message: string): Error {
  const error = new Error(message);
  (error as any).statusCode = 401;
  (error as any).name = 'HttpClientException';
  (error as any).responseHeaders = {
    'set-cookie': ['JSESSIONID=ABCDEFG; Path=/checkout; Secure; HttpOnly'],
    'www-authenticate': 'BASIC realm="Adyen PAL Service Authentication"',
    traceparent: '00-33322c1f111a01a11dbd0d53fea4ccce-f11d11cc1111abd1-11',
    'x-frame-options': 'SAMEORIGIN',
    'strict-transport-security': 'max-age=31536000; includeSubDomains',
  };
  (error as any).responseBody = '{"status":401,"errorCode":"000","message":"Unauthorized"}';
  return error;
}

function assertNoSensitiveData(result: unknown) {
  const str = typeof result === 'string' ? result : JSON.stringify(result);
  for (const field of SENSITIVE_FIELDS) {
    expect(str).not.toContain(field);
  }
}

const mockClient = {} as Client;

describe('error sanitization', () => {
  describe('checkout/payments', () => {
    let tools: typeof import('../src/tools/checkout/payments/index.js');
    let mockSessions: ReturnType<typeof vi.fn>;
    let mockGetSession: ReturnType<typeof vi.fn>;
    let mockPaymentMethods: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
      mockSessions = vi.fn();
      mockGetSession = vi.fn();
      mockPaymentMethods = vi.fn();
      vi.mocked(CheckoutAPI).mockImplementation(() => ({
        PaymentsApi: {
          sessions: mockSessions,
          getResultOfPaymentSession: mockGetSession,
          paymentMethods: mockPaymentMethods,
        },
      }) as any);
      tools = await import('../src/tools/checkout/payments/index.js');
    });

    it('createPaymentSession does not leak response headers on error', async () => {
      mockSessions.mockRejectedValue(createAdyenHttpError('HTTP Exception: 401. Unauthorized'));
      const result = await tools.createPaymentSessionTool.invoke(mockClient, {
        currency: 'EUR', value: 100, merchantAccount: 'TEST', reference: 'ref', returnUrl: 'https://example.com',
      });
      assertNoSensitiveData(result);
      expect(result).toContain('HTTP Exception: 401. Unauthorized');
    });

    it('createPaymentSession returns "Unknown error" when e.message is absent', async () => {
      mockSessions.mockRejectedValue({});
      const result = await tools.createPaymentSessionTool.invoke(mockClient, {
        currency: 'EUR', value: 100, merchantAccount: 'TEST', reference: 'ref', returnUrl: 'https://example.com',
      });
      expect(result).toContain('Unknown error');
    });

    it('getPaymentSession does not leak response headers on error', async () => {
      mockGetSession.mockRejectedValue(createAdyenHttpError('HTTP Exception: 401. Unauthorized'));
      const result = await tools.getPaymentSessionTool.invoke(mockClient, { sessionId: 'sid' });
      assertNoSensitiveData(result);
      expect(result).toContain('HTTP Exception: 401. Unauthorized');
    });

    it('getPaymentMethods does not leak response headers on error', async () => {
      mockPaymentMethods.mockRejectedValue(createAdyenHttpError('HTTP Exception: 401. Unauthorized'));
      const result = await tools.getPaymentMethodsTool.invoke(mockClient, { merchantAccount: 'TEST' });
      assertNoSensitiveData(result);
      expect(result).toContain('HTTP Exception: 401. Unauthorized');
    });
  });

  describe('checkout/paymentLinks', () => {
    let tools: typeof import('../src/tools/checkout/paymentLinks/index.js');
    let mockCreate: ReturnType<typeof vi.fn>;
    let mockGet: ReturnType<typeof vi.fn>;
    let mockUpdate: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
      mockCreate = vi.fn();
      mockGet = vi.fn();
      mockUpdate = vi.fn();
      vi.mocked(CheckoutAPI).mockImplementation(() => ({
        PaymentLinksApi: {
          paymentLinks: mockCreate,
          getPaymentLink: mockGet,
          updatePaymentLink: mockUpdate,
        },
      }) as any);
      tools = await import('../src/tools/checkout/paymentLinks/index.js');
    });

    it('createPaymentLink does not leak response headers on error', async () => {
      mockCreate.mockRejectedValue(createAdyenHttpError('HTTP Exception: 401. Unauthorized'));
      const result = await tools.createPaymentLinkTool.invoke(mockClient, {
        currency: 'EUR', value: 100, merchantAccount: 'TEST', countryCode: 'NL', reference: 'ref',
      });
      assertNoSensitiveData(result);
    });

    it('getPaymentLink does not leak response headers on error', async () => {
      mockGet.mockRejectedValue(createAdyenHttpError('HTTP Exception: 404. Not Found'));
      const result = await tools.getPaymentLinkTool.invoke(mockClient, { linkId: 'link123' });
      assertNoSensitiveData(result);
    });

    it('updatePaymentLink does not leak response headers on error', async () => {
      mockUpdate.mockRejectedValue(createAdyenHttpError('HTTP Exception: 422. Unprocessable'));
      const result = await tools.updatePaymentLinkTool.invoke(mockClient, { linkId: 'link123', status: 'expired' });
      assertNoSensitiveData(result);
    });
  });

  describe('checkout/modifications', () => {
    let tools: typeof import('../src/tools/checkout/modifications/index.js');
    let mockRefund: ReturnType<typeof vi.fn>;
    let mockCancel: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
      mockRefund = vi.fn();
      mockCancel = vi.fn();
      vi.mocked(CheckoutAPI).mockImplementation(() => ({
        ModificationsApi: {
          refundCapturedPayment: mockRefund,
          cancelAuthorisedPayment: mockCancel,
        },
      }) as any);
      tools = await import('../src/tools/checkout/modifications/index.js');
    });

    it('refundPayment does not leak response headers on error', async () => {
      mockRefund.mockRejectedValue(createAdyenHttpError('HTTP Exception: 422. Unprocessable'));
      const result = await tools.refundPaymentTool.invoke(mockClient, {
        pspReference: 'psp123', currency: 'EUR', value: 100, merchantAccount: 'TEST', reference: 'ref',
      });
      assertNoSensitiveData(result);
    });

    it('cancelPayment does not leak response headers on error', async () => {
      mockCancel.mockRejectedValue(createAdyenHttpError('HTTP Exception: 422. Unprocessable'));
      const result = await tools.cancelPaymentTool.invoke(mockClient, {
        paymentReference: 'pay123', merchantAccount: 'TEST',
      });
      assertNoSensitiveData(result);
    });
  });

  describe('management/accounts', () => {
    let tools: typeof import('../src/tools/management/accounts/index.js');
    let mockList: ReturnType<typeof vi.fn>;
    let mockGet: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
      mockList = vi.fn();
      mockGet = vi.fn();
      vi.mocked(ManagementAPI).mockImplementation(() => ({
        AccountMerchantLevelApi: {
          listMerchantAccounts: mockList,
          getMerchantAccount: mockGet,
        },
      }) as any);
      tools = await import('../src/tools/management/accounts/index.js');
    });

    it('listMerchantAccounts does not leak response headers on error', async () => {
      mockList.mockRejectedValue(createAdyenHttpError('HTTP Exception: 403. Forbidden'));
      const result = await tools.listMerchantAccountsTool.invoke(mockClient, { pageSize: 10, pageNumber: 1 });
      assertNoSensitiveData(result);
      expect(result).toContain('HTTP Exception: 403. Forbidden');
    });

    it('getMerchantAccount does not leak response headers on error', async () => {
      mockGet.mockRejectedValue(createAdyenHttpError('HTTP Exception: 404. Not Found'));
      const result = await tools.getMerchantAccountsTool.invoke(mockClient, { merchantId: 'merch123' });
      assertNoSensitiveData(result);
    });
  });

  describe('management/webhooks', () => {
    let tools: typeof import('../src/tools/management/webhooks/index.js');
    let mockMerchantList: ReturnType<typeof vi.fn>;
    let mockMerchantGet: ReturnType<typeof vi.fn>;
    let mockCompanyList: ReturnType<typeof vi.fn>;
    let mockCompanyGet: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
      mockMerchantList = vi.fn();
      mockMerchantGet = vi.fn();
      mockCompanyList = vi.fn();
      mockCompanyGet = vi.fn();
      vi.mocked(ManagementAPI).mockImplementation(() => ({
        WebhooksMerchantLevelApi: {
          listAllWebhooks: mockMerchantList,
          getWebhook: mockMerchantGet,
        },
        WebhooksCompanyLevelApi: {
          listAllWebhooks: mockCompanyList,
          getWebhook: mockCompanyGet,
        },
      }) as any);
      tools = await import('../src/tools/management/webhooks/index.js');
    });

    it('listAllMerchantWebhooks does not leak response headers on error', async () => {
      mockMerchantList.mockRejectedValue(createAdyenHttpError('HTTP Exception: 403. Forbidden'));
      const result = await tools.listAllMerchantWebhooksTool.invoke(mockClient, { merchantId: 'm1', pageSize: 10, pageNumber: 1 });
      assertNoSensitiveData(result);
    });

    it('getMerchantWebhook does not leak response headers on error', async () => {
      mockMerchantGet.mockRejectedValue(createAdyenHttpError('HTTP Exception: 404. Not Found'));
      const result = await tools.getMerchantWebhookTool.invoke(mockClient, { merchantId: 'm1', webhookId: 'w1' });
      assertNoSensitiveData(result);
    });

    it('listAllCompanyWebhooks does not leak response headers on error', async () => {
      mockCompanyList.mockRejectedValue(createAdyenHttpError('HTTP Exception: 403. Forbidden'));
      const result = await tools.listAllCompanyWebhooksTool.invoke(mockClient, { companyId: 'c1', pageSize: 10, pageNumber: 1 });
      assertNoSensitiveData(result);
    });

    it('getCompanyWebhook does not leak response headers on error', async () => {
      mockCompanyGet.mockRejectedValue(createAdyenHttpError('HTTP Exception: 404. Not Found'));
      const result = await tools.getCompanyWebhookTool.invoke(mockClient, { companyId: 'c1', webhookId: 'w1' });
      assertNoSensitiveData(result);
    });
  });

  describe('legalEntityManagement/legalEntities', () => {
    let tools: typeof import('../src/tools/legalEntityManagement/legalEntities/index.js');
    let mockGet: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
      mockGet = vi.fn();
      vi.mocked(LegalEntityManagementAPI).mockImplementation(() => ({
        LegalEntitiesApi: { getLegalEntity: mockGet },
      }) as any);
      tools = await import('../src/tools/legalEntityManagement/legalEntities/index.js');
    });

    it('getLegalEntity does not leak response headers on error', async () => {
      mockGet.mockRejectedValue(createAdyenHttpError('HTTP Exception: 404. Not Found'));
      const result = await tools.getLegalEntityTool.invoke(mockClient, { id: 'le123' });
      assertNoSensitiveData(result);
    });
  });

  describe('legalEntityManagement/onboardingLinks', () => {
    let tools: typeof import('../src/tools/legalEntityManagement/onboardingLinks/index.js');
    let mockCreate: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
      mockCreate = vi.fn();
      vi.mocked(LegalEntityManagementAPI).mockImplementation(() => ({
        HostedOnboardingApi: { getLinkToAdyenhostedOnboardingPage: mockCreate },
      }) as any);
      tools = await import('../src/tools/legalEntityManagement/onboardingLinks/index.js');
    });

    it('getOnboardingLink does not leak response headers on error', async () => {
      mockCreate.mockRejectedValue(createAdyenHttpError('HTTP Exception: 403. Forbidden'));
      const result = await tools.createHostedOnboardingLinkTool.invoke(mockClient, { id: 'le123' });
      assertNoSensitiveData(result);
    });
  });

  describe('configuration/accountHolders', () => {
    let tools: typeof import('../src/tools/configuration/accountHolders/index.js');
    let mockGet: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
      mockGet = vi.fn();
      vi.mocked(BalancePlatformAPI).mockImplementation(() => ({
        AccountHoldersApi: { getAccountHolder: mockGet },
      }) as any);
      tools = await import('../src/tools/configuration/accountHolders/index.js');
    });

    it('getAccountHolder does not leak response headers on error', async () => {
      mockGet.mockRejectedValue(createAdyenHttpError('HTTP Exception: 404. Not Found'));
      const result = await tools.getAccountHolderTool.invoke(mockClient, { id: 'ah123' });
      assertNoSensitiveData(result);
    });
  });
});
