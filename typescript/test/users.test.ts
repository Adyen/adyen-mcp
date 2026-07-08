import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Client, ManagementAPI } from '@adyen/api-library';

vi.mock('@adyen/api-library');

const mockClient = {} as Client;

describe('user update tools', () => {
  let tools: typeof import('../src/tools/management/users/index.js');

  let companyListUsers: ReturnType<typeof vi.fn>;
  let companyGetUserDetails: ReturnType<typeof vi.fn>;
  let companyUpdateUserDetails: ReturnType<typeof vi.fn>;
  let merchantListUsers: ReturnType<typeof vi.fn>;
  let merchantGetUserDetails: ReturnType<typeof vi.fn>;
  let merchantUpdateUser: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    companyListUsers = vi.fn();
    companyGetUserDetails = vi.fn();
    companyUpdateUserDetails = vi.fn();
    merchantListUsers = vi.fn();
    merchantGetUserDetails = vi.fn();
    merchantUpdateUser = vi.fn();

    vi.mocked(ManagementAPI).mockImplementation(function () {
      return {
        UsersCompanyLevelApi: {
          listUsers: companyListUsers,
          getUserDetails: companyGetUserDetails,
          updateUserDetails: companyUpdateUserDetails,
        },
        UsersMerchantLevelApi: {
          listUsers: merchantListUsers,
          getUserDetails: merchantGetUserDetails,
          updateUser: merchantUpdateUser,
        },
      } as any;
    });

    tools = await import('../src/tools/management/users/index.js');
  });

  describe('update_company_user', () => {
    it('resolves the user by email and issues the update', async () => {
      companyListUsers.mockResolvedValue({
        data: [
          {
            id: 'U1',
            email: 'alice@example.com',
            username: 'alice',
            roles: ['A'],
          },
        ],
        pagesTotal: 1,
      });
      companyUpdateUserDetails.mockResolvedValue({ id: 'U1' });

      const result = await tools.updateCompanyUserTool.invoke(mockClient, {
        companyId: 'C1',
        email: 'alice@example.com',
        active: false,
      });

      expect(companyListUsers).toHaveBeenCalledWith(
        'C1',
        1,
        100,
        'alice@example.com',
      );
      expect(companyUpdateUserDetails).toHaveBeenCalledWith('C1', 'U1', {
        active: false,
      });
      expect(result).toEqual({ id: 'U1' });
    });

    it('merges addRoles/removeRoles onto the resolved roles without clobbering', async () => {
      companyListUsers.mockResolvedValue({
        data: [
          {
            id: 'U1',
            email: 'alice@example.com',
            username: 'alice',
            roles: ['Merchant admin', 'Legacy'],
          },
        ],
        pagesTotal: 1,
      });
      companyUpdateUserDetails.mockResolvedValue({ id: 'U1' });

      await tools.updateCompanyUserTool.invoke(mockClient, {
        companyId: 'C1',
        username: 'alice',
        addRoles: ['Reports'],
        removeRoles: ['Legacy'],
      });

      const [, , body] = companyUpdateUserDetails.mock.calls[0];
      expect(new Set(body.roles)).toEqual(
        new Set(['Merchant admin', 'Reports']),
      );
    });

    it('returns an error and performs no update when no user matches', async () => {
      companyListUsers.mockResolvedValue({ data: [], pagesTotal: 1 });

      const result = await tools.updateCompanyUserTool.invoke(mockClient, {
        companyId: 'C1',
        email: 'missing@example.com',
        active: false,
      });

      expect(result).toContain('No user found');
      expect(companyUpdateUserDetails).not.toHaveBeenCalled();
    });

    it('returns an error and performs no update when multiple users match', async () => {
      companyListUsers.mockResolvedValue({
        data: [
          { id: 'U1', email: 'dup@example.com', username: 'a', roles: [] },
          { id: 'U2', email: 'dup@example.com', username: 'b', roles: [] },
        ],
        pagesTotal: 1,
      });

      const result = await tools.updateCompanyUserTool.invoke(mockClient, {
        companyId: 'C1',
        email: 'dup@example.com',
        active: false,
      });

      expect(result).toContain('Found 2 users');
      expect(companyUpdateUserDetails).not.toHaveBeenCalled();
    });

    it('uses userId directly without listing, fetching current roles for a delta', async () => {
      companyGetUserDetails.mockResolvedValue({ id: 'U9', roles: ['A'] });
      companyUpdateUserDetails.mockResolvedValue({ id: 'U9' });

      await tools.updateCompanyUserTool.invoke(mockClient, {
        companyId: 'C1',
        userId: 'U9',
        addRoles: ['B'],
      });

      expect(companyListUsers).not.toHaveBeenCalled();
      expect(companyGetUserDetails).toHaveBeenCalledWith('C1', 'U9');
      const [, , body] = companyUpdateUserDetails.mock.calls[0];
      expect(new Set(body.roles)).toEqual(new Set(['A', 'B']));
    });

    it('requires an identifier', async () => {
      const result = await tools.updateCompanyUserTool.invoke(mockClient, {
        companyId: 'C1',
        active: false,
      });

      expect(result).toContain('provide one of userId, email, or username');
      expect(companyListUsers).not.toHaveBeenCalled();
      expect(companyUpdateUserDetails).not.toHaveBeenCalled();
    });

    it('returns a sanitized error string when the update call fails', async () => {
      companyListUsers.mockResolvedValue({
        data: [
          {
            id: 'U1',
            email: 'alice@example.com',
            username: 'alice',
            roles: [],
          },
        ],
        pagesTotal: 1,
      });
      companyUpdateUserDetails.mockRejectedValue(
        new Error('HTTP Exception: 403'),
      );

      const result = await tools.updateCompanyUserTool.invoke(mockClient, {
        companyId: 'C1',
        email: 'alice@example.com',
        active: false,
      });

      expect(result).toBe(
        'Failed to update company user. Error: HTTP Exception: 403',
      );
    });
  });

  describe('update_merchant_user', () => {
    it('resolves the user by email and issues the update', async () => {
      merchantListUsers.mockResolvedValue({
        data: [
          { id: 'M1', email: 'bob@example.com', username: 'bob', roles: [] },
        ],
        pagesTotal: 1,
      });
      merchantUpdateUser.mockResolvedValue({ id: 'M1' });

      const result = await tools.updateMerchantUserTool.invoke(mockClient, {
        merchantId: 'MERCH',
        email: 'bob@example.com',
        active: true,
      });

      expect(merchantListUsers).toHaveBeenCalledWith(
        'MERCH',
        1,
        100,
        'bob@example.com',
      );
      expect(merchantUpdateUser).toHaveBeenCalledWith('MERCH', 'M1', {
        active: true,
      });
      expect(result).toEqual({ id: 'M1' });
    });

    it('returns an error and performs no update when no user matches', async () => {
      merchantListUsers.mockResolvedValue({ data: [], pagesTotal: 1 });

      const result = await tools.updateMerchantUserTool.invoke(mockClient, {
        merchantId: 'MERCH',
        username: 'ghost',
        roles: ['A'],
      });

      expect(result).toContain('No user found');
      expect(merchantUpdateUser).not.toHaveBeenCalled();
    });
  });
});
