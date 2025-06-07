import { z } from "zod";
import { Client, ManagementAPI } from "@adyen/api-library";
import {
  GET_MERCHANT_ACCOUNTS_DESCRIPTION,
  GET_MERCHANT_ACCOUNTS_NAME,
  LIST_MERCHANT_ACCOUNTS_DESCRIPTION,
  LIST_MERCHANT_ACCOUNTS_NAME,
} from "./constants";
import { Tool } from "../types";

const listMerchantAccountsRequestShape: z.ZodRawShape = {
  pageSize: z.number(),
  pageNumber: z.number(),
};

const listMerchantAccountsRequestObject = z.object(
  listMerchantAccountsRequestShape
);

const listMerchantAccounts = async (
  client: Client,
  listMerchantAccountsRequest: z.infer<typeof listMerchantAccountsRequestObject>
) => {
  const { pageSize, pageNumber } = listMerchantAccountsRequest;

  const managementAPI = new ManagementAPI(client);
  try {
    return await managementAPI.AccountMerchantLevelApi.listMerchantAccounts(
      pageNumber,
      pageSize
    );
  } catch (e) {
    return "Failed to list merchant accounts. Error: " + JSON.stringify(e);
  }
};

export const listMerchantAccountsTool: Tool = {
  name: LIST_MERCHANT_ACCOUNTS_NAME,
  description: LIST_MERCHANT_ACCOUNTS_DESCRIPTION,
  arguments: listMerchantAccountsRequestObject,
  invoke: listMerchantAccounts,
};

const getMerchantAccountRequestShape: z.ZodRawShape = {
  merchantId: z.string()
};

const getMerchantAccountRequestObject = z.object(
    getMerchantAccountRequestShape
);

const getMerchantAccount = async (
    client: Client,
    getMerchantAccountRequest: z.infer<typeof getMerchantAccountRequestObject>
) => {
  const { merchantId } = getMerchantAccountRequest;

  const managementAPI = new ManagementAPI(client);
  try {
    return await managementAPI.AccountMerchantLevelApi.getMerchantAccount(
        merchantId
    );
  } catch (e) {
    return "Failed to get merchant account. Error: " + JSON.stringify(e);
  }
};

export const getMerchantAccountsTool: Tool = {
  name: GET_MERCHANT_ACCOUNTS_NAME,
  description: GET_MERCHANT_ACCOUNTS_DESCRIPTION,
  arguments: getMerchantAccountRequestObject,
  invoke: getMerchantAccount,
};

