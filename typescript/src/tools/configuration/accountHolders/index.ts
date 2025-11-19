import { z } from "zod";
import { Client, Types, BalancePlatformAPI } from "@adyen/api-library";
import {
  GET_ACCOUNT_HOLDER_NAME,
  GET_ACCOUNT_HOLDER_DESCRIPTION
} from "./constants";
import { Tool } from "../../types";

const getAccountHolderRequestShape: z.ZodRawShape = {
  id: z.string()
};

const getAccountHolderObject = z.object(getAccountHolderRequestShape);

const getAccountHolder = async (
  client: Client,
  getAccountHolderRequest: z.infer<typeof getAccountHolderObject> 
) => {
  const {id} = getAccountHolderRequest;
  const balancePlatformApi = new BalancePlatformAPI(client)
  try {
     return await balancePlatformApi.AccountHoldersApi.getAccountHolder(id)
  } catch (e) {
    return "Failed to get account holder. Error: " + JSON.stringify(e);
  }
}

export const getAccountHolderTool: Tool = {
  name: GET_ACCOUNT_HOLDER_NAME,
  description: GET_ACCOUNT_HOLDER_DESCRIPTION,
  arguments: getAccountHolderObject,
  invoke: getAccountHolder,
};