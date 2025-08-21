import { z } from "zod";
import { ScheduleTerminalActionsRequest } from '@adyen/api-library/lib/src/typings/management/scheduleTerminalActionsRequest';
import { TerminalSettings } from '@adyen/api-library/lib/src/typings/management/terminalSettings';
import * as constants from "./constants"; // Group constants under a namespace
import * as schemas from "./schemas";
import { createTool } from "./toolFactory";

// =================================================================
//  Tool Definitions
// =================================================================

export const createTerminalActionTool = createTool({
  name: constants.CREATE_TERMINAL_ACTION_NAME,
  description: constants.CREATE_TERMINAL_ACTION_DESCRIPTION,
  schema: {
    ...schemas.scheduleTerminalActionsRequestSchema.shape,
  },
  apiCall: (api, args) => api.TerminalActionsTerminalLevelApi.createTerminalAction(args as ScheduleTerminalActionsRequest),
});

export const getAndroidAppTool = createTool({
  name: constants.GET_ANDROID_APP_NAME,
  description: constants.GET_ANDROID_APP_DESCRIPTION,
  schema: {
    id: z.string(),
    companyId: z.string(),
  },
  apiCall: (api, args) => api.AndroidFilesCompanyLevelApi.getAndroidApp(args.companyId, args.id),
});

export const getTerminalSettingsCompanyLevelTool = createTool({
  name: constants.GET_TERMINAL_SETTINGS_COMPANY_LEVEL_NAME,
  description: constants.GET_TERMINAL_SETTINGS_COMPANY_LEVEL_DESCRIPTION,
  schema: {
    companyId: z.string()
  },
  apiCall: (api, args) => api.TerminalSettingsCompanyLevelApi.getTerminalSettings(args.companyId),
});

export const getTerminalSettingsMerchantLevelTool = createTool({
  name: constants.GET_TERMINAL_SETTINGS_MERCHANT_LEVEL_NAME,
  description: constants.GET_TERMINAL_SETTINGS_MERCHANT_LEVEL_DESCRIPTION,
  schema: {
    merchantId: z.string()
  },
  apiCall: (api, args) => api.TerminalSettingsMerchantLevelApi.getTerminalSettings(args.merchantId),
});

export const getTerminalSettingsStoreLevelTool = createTool({
  name: constants.GET_TERMINAL_SETTINGS_STORE_LEVEL_NAME,
  description: constants.GET_TERMINAL_SETTINGS_STORE_LEVEL_DESCRIPTION,
  schema: {
    storeId: z.string()
  },
  apiCall: (api, args) => api.TerminalSettingsStoreLevelApi.getTerminalSettingsByStoreId(args.storeId),
});

export const getTerminalSettingsTerminalLevelTool = createTool({
  name: constants.GET_TERMINAL_SETTINGS_TERMINAL_LEVEL_NAME,
  description: constants.GET_TERMINAL_SETTINGS_TERMINAL_LEVEL_DESCRIPTION,
  schema: {
    terminalId: z.string()
  },
  apiCall: (api, args) => api.TerminalSettingsTerminalLevelApi.getTerminalSettings(args.terminalId),
});

export const listAndroidAppsTool = createTool({
  name: constants.LIST_ANDROID_APPS_NAME,
  description: constants.LIST_ANDROID_APPS_DESCRIPTION,
  schema: {
    companyId: z.string(),
    packageName: z.string().optional(),
    versionCode: z.number().optional(),
    pageNumber: z.number().optional(),
    pageSize: z.number().optional(),
  },
  apiCall: (api, args) => api.AndroidFilesCompanyLevelApi.listAndroidApps(args.companyId, args.pageNumber, args.pageSize, args.packageName, args.versionCode),
});

export const listAndroidCertificatesTool = createTool({
  name: constants.LIST_ANDROID_CERTIFICATES_NAME,
  description: constants.LIST_ANDROID_CERTIFICATES_DESCRIPTION,
  schema: {
    companyId: z.string(),
    certificateName: z.string().optional(),
    pageNumber: z.number().optional(),
    pageSize: z.number().optional(),
  },
  apiCall: (api, args) => api.AndroidFilesCompanyLevelApi.listAndroidCertificates(args.companyId, args.pageNumber, args.pageSize, args.certificateName),
});

export const listTerminalsTool = createTool({
  name: constants.LIST_TERMINALS_NAME,
  description: constants.LIST_TERMINALS_DESCRIPTION,
  schema: {
    searchQuery: z.string().optional(),
    otpQuery: z.string().optional(),
    countries: z.string().optional(),
    merchantIds: z.string().optional(),
    storeIds: z.string().optional(),
    brandModels: z.string().optional(),
    pageNumber: z.number().optional(),
    pageSize: z.number().optional(),
  },
  apiCall: (api, args) => api.TerminalsTerminalLevelApi.listTerminals(args.searchQuery, args.otpQuery, args.countries, args.merchantIds, args.storeIds, args.brandModels, args.pageNumber, args.pageSize),
});

export const listTerminalActionsTool = createTool({
  name: constants.LIST_TERMINAL_ACTIONS_NAME,
  description: constants.LIST_TERMINAL_ACTIONS_DESCRIPTION,
  schema: {
    companyId: z.string(),
    type: z.string().optional(),
    status: z.string().optional(),
    pageNumber: z.number().optional(),
    pageSize: z.number().optional(),
  },
  apiCall: (api, args) => api.TerminalActionsCompanyLevelApi.listTerminalActions(args.companyId, args.pageNumber, args.pageSize, args.status, args.type),
});

export const reassignTerminalTool = createTool({
  name: constants.REASSIGN_TERMINAL_NAME,
  description: constants.REASSIGN_TERMINAL_DESCRIPTION,
  schema: {
    terminalId: z.string(),
    companyId: z.string().optional(),
    merchantId: z.string().optional(),
    storeId: z.string().optional(),
    inventory: z.boolean().optional(),
  },
  apiCall: (api, { terminalId, ...reassignData }) => api.TerminalsTerminalLevelApi.reassignTerminal(terminalId, reassignData),
  successMessage: (_, args) => `Terminal ${args.terminalId} reassignment initiated successfully.`,
});

export const updateTerminalSettingsCompanyLevelTool = createTool({
  name: constants.UPDATE_TERMINAL_SETTINGS_COMPANY_LEVEL_NAME,
  description: constants.UPDATE_TERMINAL_SETTINGS_COMPANY_LEVEL_DESCRIPTION,
  schema: {
    companyId: z.string().describe("The unique identifier of the company account."),
    ...schemas.terminalSettingsSchema.shape,
  },
  apiCall: (api, args) => {
    const { companyId, ...terminalSettingsBody } = args;
    return api.TerminalSettingsCompanyLevelApi.updateTerminalSettings(companyId, terminalSettingsBody as TerminalSettings);
  },
});

export const updateTerminalSettingsMerchantLevelTool = createTool({
  name: constants.UPDATE_TERMINAL_SETTINGS_MERCHANT_LEVEL_NAME,
  description: constants.UPDATE_TERMINAL_SETTINGS_MERCHANT_LEVEL_DESCRIPTION,
  schema: {
    merchantId: z.string().describe("The unique identifier of the merchant account."),
    ...schemas.terminalSettingsSchema.shape,
  },
  apiCall: (api, args) => {
    const { merchantId, ...terminalSettingsBody } = args;
    return api.TerminalSettingsMerchantLevelApi.updateTerminalSettings(merchantId, terminalSettingsBody as TerminalSettings);
  },
});

export const updateTerminalSettingsStoreLevelTool = createTool({
  name: constants.UPDATE_TERMINAL_SETTINGS_STORE_LEVEL_NAME,
  description: constants.UPDATE_TERMINAL_SETTINGS_STORE_LEVEL_DESCRIPTION,
  schema: {
    storeId: z.string().describe("The unique identifier of the store."),
    ...schemas.terminalSettingsSchema.shape,
  },
  apiCall: (api, args) => {
    const { storeId, ...terminalSettingsBody } = args;
    return api.TerminalSettingsStoreLevelApi.updateTerminalSettingsByStoreId(storeId, terminalSettingsBody as TerminalSettings);
  },
});

export const updateTerminalSettingsTerminalLevelTool = createTool({
  name: constants.UPDATE_TERMINAL_SETTINGS_TERMINAL_LEVEL_NAME,
  description: constants.UPDATE_TERMINAL_SETTINGS_TERMINAL_LEVEL_DESCRIPTION,
  schema: {
    terminalId: z.string().describe("The unique identifier of the payment terminal."),
    ...schemas.terminalSettingsSchema.shape,
  },
  apiCall: (api, args) => {
    const { terminalId, ...terminalSettingsBody } = args;
    return api.TerminalSettingsTerminalLevelApi.updateTerminalSettings(terminalId, terminalSettingsBody as TerminalSettings);
  },
});