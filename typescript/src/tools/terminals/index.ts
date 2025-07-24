import { z } from "zod";
import { ManagementAPI } from "@adyen/api-library";
import { ScheduleTerminalActionsRequest } from '@adyen/api-library/lib/src/typings/management/scheduleTerminalActionsRequest';
import { TerminalSettings } from '@adyen/api-library/lib/src/typings/management/terminalSettings';
import * as constants from "./constants"; // Group constants under a namespace
import * as schemas from "./schemas";
import { createTool } from "./toolFactory";

// =================================================================
//  Helper Functions
// =================================================================

/**
 * Intelligently resolves a companyId. If the provided ID is a merchantId,
 * it fetches the corresponding companyId. Otherwise, it returns the original ID.
 */
async function resolveCompanyId(api: ManagementAPI, id: string): Promise<string> {
  try {
    const merchantAccount = await api.AccountMerchantLevelApi.getMerchantAccount(id);
    // If the call succeeds, it was a merchantId. Return the real companyId.
    return merchantAccount?.companyId || id;
  } catch (e) {
    // If the call fails, it's not a valid merchantId. Assume the original id was correct.
    return id;
  }
}

// =================================================================
//  Tool Definitions
// =================================================================

const createTerminalActionTool = createTool({
  name: constants.CREATE_TERMINAL_ACTION_NAME,
  description: constants.CREATE_TERMINAL_ACTION_DESCRIPTION,
  schema: {
    ...schemas.scheduleTerminalActionsRequestSchema.shape,
  },
  apiCall: (api, args) => api.TerminalActionsTerminalLevelApi.createTerminalAction(args as ScheduleTerminalActionsRequest),
});

const getAndroidAppTool = createTool({
  name: constants.GET_ANDROID_APP_NAME,
  description: constants.GET_ANDROID_APP_DESCRIPTION,
  schema: {
    id: z.string().describe("The unique identifier of the Android app."),
    companyId: z.string().describe("The unique identifier of the company account."),
  },
  apiCall: async (api, args) => {
    const companyId = await resolveCompanyId(api, args.companyId);
    return api.AndroidFilesCompanyLevelApi.getAndroidApp(companyId, args.id);
  },
});

const getTerminalSettingsTool = createTool({
  name: constants.GET_TERMINAL_SETTINGS_NAME,
  description: constants.GET_TERMINAL_SETTINGS_DESCRIPTION,
  schema: {
    level: z.enum(['company', 'merchant', 'store', 'terminal']).describe("The account level for which to get the settings."),
    id: z.string().describe("The unique ID of the company, merchant, store, or terminal."),
  },
  apiCall: async (api, args) => {
    const { level, id } = args;
    switch (level) {
      case 'company':
        return api.TerminalSettingsCompanyLevelApi.getTerminalSettings(id);
      case 'merchant':
        return api.TerminalSettingsMerchantLevelApi.getTerminalSettings(id);
      case 'store':
        return api.TerminalSettingsStoreLevelApi.getTerminalSettingsByStoreId(id);
      case 'terminal':
        return api.TerminalSettingsTerminalLevelApi.getTerminalSettings(id);
      default:
        throw new Error(`Invalid level provided: ${level}`);
    }
  },
});

const listAndroidAppsTool = createTool({
  name: constants.LIST_ANDROID_APPS_NAME,
  description: constants.LIST_ANDROID_APPS_DESCRIPTION,
  schema: {
    companyId: z.string().describe("The unique identifier of the company account."),
    packageName: z.string().optional().describe("The package name that uniquely identifies the Android app."),
    versionCode: z.number().optional().describe("The version code of the Android app."),
    pageNumber: z.number().optional().describe("The number of the page to fetch."),
    pageSize: z.number().optional().describe("The number of items to have on a page, maximum 100. The default is 20 items on a page."),
  },
  apiCall: async (api, args) => {
    const companyId = await resolveCompanyId(api, args.companyId);
    return api.AndroidFilesCompanyLevelApi.listAndroidApps(companyId, args.pageNumber, args.pageSize, args.packageName, args.versionCode);
  },
});

const listAndroidCertificatesTool = createTool({
  name: constants.LIST_ANDROID_CERTIFICATES_NAME,
  description: constants.LIST_ANDROID_CERTIFICATES_DESCRIPTION,
  schema: {
    companyId: z.string().describe("The unique identifier of the company account."),
    certificateName: z.string().optional().describe("The name of the certificate."),
    pageNumber: z.number().optional().describe("The number of the page to fetch."),
    pageSize: z.number().optional().describe("The number of items to have on a page, maximum 100. The default is 20 items on a page."),
  },
  apiCall: async (api, args) => {
    const companyId = await resolveCompanyId(api, args.companyId);
    return api.AndroidFilesCompanyLevelApi.listAndroidCertificates(companyId, args.pageNumber, args.pageSize, args.certificateName)
  },
});

const listTerminalsTool = createTool({
  name: constants.LIST_TERMINALS_NAME,
  description: constants.LIST_TERMINALS_DESCRIPTION,
  schema: {
    searchQuery: z.string().optional().describe("Returns terminals with an ID that contains the specified string. If present, other query parameters are ignored."),
    otpQuery: z.string().optional().describe("Returns terminals associated with the one-time passwords specified in the request. If this query parameter is used, other query parameters are ignored."),
    countries: z.string().optional().describe("Returns terminals located in the countries specified by their two-letter country code."),
    merchantIds: z.string().optional().describe("Returns terminals that belong to the merchant accounts specified by their unique merchant account ID."),
    storeIds: z.string().optional().describe("Returns terminals that are assigned to the stores specified by their unique store ID."),
    brandModels: z.string().optional().describe('Returns terminals of the models specified in the format "brand.model".'),
    pageNumber: z.number().optional().describe("The number of the page to fetch."),
    pageSize: z.number().optional().describe("The number of items to have on a page, maximum 100. The default is 20 items on a page."),
  },
  apiCall: (api, args) => api.TerminalsTerminalLevelApi.listTerminals(args.searchQuery, args.otpQuery, args.countries, args.merchantIds, args.storeIds, args.brandModels, args.pageNumber, args.pageSize),
});

const listTerminalActionsTool = createTool({
  name: constants.LIST_TERMINAL_ACTIONS_NAME,
  description: constants.LIST_TERMINAL_ACTIONS_DESCRIPTION,
  schema: {
    companyId: z.string().describe("The unique identifier of the company account."),
    type: z.string().optional().describe("The type of terminal actions. Allowed values: InstallAndroidApp, UninstallAndroidApp, InstallAndroidCertificate, UninstallAndroidCertificate."),
    status: z.string().optional().describe("The status of terminal actions. Allowed values: pending, successful, failed, cancelled, tryLater."),
    pageNumber: z.number().optional().describe("The number of the page to fetch."),
    pageSize: z.number().optional().describe("The number of items to have on a page, maximum 100. The default is 20 items on a page."),
  },
  apiCall: async (api, args) => {
    const companyId = await resolveCompanyId(api, args.companyId);
    return api.TerminalActionsCompanyLevelApi.listTerminalActions(companyId, args.pageNumber, args.pageSize, args.status, args.type);
  },
});

const reassignTerminalTool = createTool({
  name: constants.REASSIGN_TERMINAL_NAME,
  description: constants.REASSIGN_TERMINAL_DESCRIPTION,
  schema: {
    terminalId: z.string().describe("The unique identifier of the payment terminal to reassign."),
    companyId: z.string().optional().describe("The unique identifier of the company account to reassign the terminal to."),
    merchantId: z.string().optional().describe("The unique identifier of the merchant account to reassign the terminal to."),
    storeId: z.string().optional().describe("The unique identifier of the store to reassign the terminal to."),
    inventory: z.boolean().optional().describe("Set to true to reassign the terminal to the inventory of the specified merchant account."),
  },
  apiCall: (api, { terminalId, ...reassignData }) => api.TerminalsTerminalLevelApi.reassignTerminal(terminalId, reassignData),
  successMessage: (_, args) => `Terminal ${args.terminalId} reassignment initiated successfully.`,
});

const updateTerminalSettingsTool = createTool({
  name: constants.UPDATE_TERMINAL_SETTINGS_NAME,
  description: constants.UPDATE_TERMINAL_SETTINGS_DESCRIPTION,
  schema: {
    level: z.enum(['company', 'merchant', 'store', 'terminal']).describe("The account level for which to update the settings."),
    id: z.string().describe("The unique ID of the company, merchant, store, or terminal."),
    settings: schemas.terminalSettingsSchema.describe("An object containing the terminal settings fields to update."),
  },
  apiCall: (api, args) => {
    const { level, id, settings } = args;
    const body = settings as TerminalSettings;
    switch (level) {
      case 'company':
        return api.TerminalSettingsCompanyLevelApi.updateTerminalSettings(id, body);
      case 'merchant':
        return api.TerminalSettingsMerchantLevelApi.updateTerminalSettings(id, body);
      case 'store':
        return api.TerminalSettingsStoreLevelApi.updateTerminalSettingsByStoreId(id, body);
      case 'terminal':
        return api.TerminalSettingsTerminalLevelApi.updateTerminalSettings(id, body);
      default:
        throw new Error(`Invalid level provided: ${level}`);
    }
  },
});

export const terminalTools = [
  createTerminalActionTool,
  getAndroidAppTool,
  getTerminalSettingsTool,
  listAndroidAppsTool,
  listAndroidCertificatesTool,
  listTerminalsTool,
  listTerminalActionsTool,
  reassignTerminalTool,
  updateTerminalSettingsTool,
];