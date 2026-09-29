import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Client, ManagementAPI } from '@adyen/api-library';
import { tools } from '../src/tools/tools.js';

vi.mock('@adyen/api-library');

const TERMINAL_ORDER_TOOL_NAMES = [
  'list_terminal_models',
  'list_terminal_products',
  'list_billing_entities',
  'list_shipping_locations',
  'create_shipping_location',
  'create_terminal_order',
  'list_terminal_orders',
  'get_terminal_order',
  'update_terminal_order',
  'cancel_terminal_order',
];

const findTool = (name: string) => {
  const tool = tools.find((t) => t.name === name);
  if (!tool) throw new Error(`Tool not found: ${name}`);
  return tool;
};

describe('terminalOrders', () => {
  describe('registration', () => {
    it('registers all ten terminal-ordering tools', () => {
      const names = tools.map((t) => t.name);
      for (const name of TERMINAL_ORDER_TOOL_NAMES) {
        expect(names).toContain(name);
      }
    });

    it('exposes a description and a zod argument schema for each tool', () => {
      for (const name of TERMINAL_ORDER_TOOL_NAMES) {
        const tool = findTool(name);
        expect(tool.description).toBeTruthy();
        expect(tool.arguments).toBeDefined();
        expect(typeof tool.invoke).toBe('function');
      }
    });
  });

  describe('input validation (mirrors the Adyen Management API definition)', () => {
    it('requires companyId on every tool', () => {
      for (const name of TERMINAL_ORDER_TOOL_NAMES) {
        const result = findTool(name).arguments.safeParse({});
        expect(result.success).toBe(false);
      }
    });

    it('rejects a country that is not a two-letter ISO code', () => {
      const result = findTool('create_shipping_location').arguments.safeParse({
        companyId: 'C1',
        name: 'Berlin HQ',
        address: { country: 'Germany' },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('country');
      }
    });

    it('normalizes a valid country code to upper case', () => {
      const result = findTool('create_shipping_location').arguments.safeParse({
        companyId: 'C1',
        name: 'Berlin HQ',
        address: { country: 'de' },
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.address?.country).toBe('DE');
      }
    });

    it('rejects an invalid phone number format', () => {
      const result = findTool('create_shipping_location').arguments.safeParse({
        companyId: 'C1',
        name: 'Berlin HQ',
        contact: { phoneNumber: '12-34' },
      });
      expect(result.success).toBe(false);
    });

    it('accepts a phone number with an optional leading plus', () => {
      const result = findTool('create_shipping_location').arguments.safeParse({
        companyId: 'C1',
        name: 'Berlin HQ',
        contact: { phoneNumber: '+491234567890' },
      });
      expect(result.success).toBe(true);
    });

    it('rejects an invalid email address', () => {
      const result = findTool('create_shipping_location').arguments.safeParse({
        companyId: 'C1',
        name: 'Berlin HQ',
        contact: { email: 'not-an-email' },
      });
      expect(result.success).toBe(false);
    });

    it('requires at least one item on a terminal order', () => {
      const result = findTool('create_terminal_order').arguments.safeParse({
        companyId: 'C1',
        items: [],
        billingEntityId: 'BE1',
        shippingLocationId: 'SL1',
      });
      expect(result.success).toBe(false);
    });

    it('rejects a non-positive item quantity', () => {
      const result = findTool('create_terminal_order').arguments.safeParse({
        companyId: 'C1',
        items: [{ id: 'P1', quantity: 0 }],
        billingEntityId: 'BE1',
        shippingLocationId: 'SL1',
      });
      expect(result.success).toBe(false);
    });

    it('requires billingEntityId and shippingLocationId on a terminal order', () => {
      const result = findTool('create_terminal_order').arguments.safeParse({
        companyId: 'C1',
        items: [{ id: 'P1', quantity: 1 }],
        billingEntityId: '',
        shippingLocationId: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map((i) => i.path.join('.'));
        expect(paths).toContain('billingEntityId');
        expect(paths).toContain('shippingLocationId');
      }
    });

    it('accepts a fully valid terminal order request', () => {
      const result = findTool('create_terminal_order').arguments.safeParse({
        companyId: 'C1',
        items: [{ id: 'P1', quantity: 2 }],
        billingEntityId: 'BE1',
        shippingLocationId: 'SL1',
        customerOrderReference: 'PO-123',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('invocation against the Management API', () => {
    const mockClient = {} as Client;
    let mockListModels: ReturnType<typeof vi.fn>;
    let mockCreateOrder: ReturnType<typeof vi.fn>;
    let mockGetMerchantAccount: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockListModels = vi.fn();
      mockCreateOrder = vi.fn();
      // resolveCompanyId calls getMerchantAccount; rejecting makes it fall back
      // to the provided id (i.e. treat the argument as a company id directly).
      mockGetMerchantAccount = vi
        .fn()
        .mockRejectedValue(new Error('not a merchant'));
      vi.mocked(ManagementAPI).mockImplementation(function () {
        return {
          AccountMerchantLevelApi: {
            getMerchantAccount: mockGetMerchantAccount,
          },
          TerminalOrdersCompanyLevelApi: {
            listTerminalModels: mockListModels,
            createOrder: mockCreateOrder,
          },
        } as any;
      });
    });

    it('passes the resolved companyId through to the Management API', async () => {
      mockListModels.mockResolvedValue({ data: [] });
      const result = await findTool('list_terminal_models').invoke(mockClient, {
        companyId: 'CompanyAccount',
      });
      expect(mockListModels).toHaveBeenCalledWith('CompanyAccount');
      expect(result).toEqual({ data: [] });
    });

    it('returns a friendly error string instead of throwing on API failure', async () => {
      mockCreateOrder.mockRejectedValue(
        new Error('HTTP Exception: 422. Unprocessable Entity'),
      );
      const result = await findTool('create_terminal_order').invoke(
        mockClient,
        {
          companyId: 'C1',
          items: [{ id: 'P1', quantity: 1 }],
          billingEntityId: 'BE1',
          shippingLocationId: 'SL1',
        },
      );
      expect(typeof result).toBe('string');
      expect(result).toContain('Failed to execute tool');
      expect(result).toContain('422');
    });
  });
});
