import { z } from "zod";

// --- Schemas for Terminal Settings ---
const minorUnitsMonetaryValueSchema = z.object({
  amount: z.number().int().optional().describe("The transaction amount, in [minor units](https://docs.adyen.com/development-resources/currency-codes)."),
  currencyCode: z.string().optional().describe("The three-character [ISO currency code](https://docs.adyen.com/development-resources/currency-codes)."),
});

const cardholderReceiptSchema = z.object({
  headerForAuthorizedReceipt: z.string().optional().describe("A custom header to show on the shopper receipt for an authorised transaction. Allows one or two comma-separated header lines, and blank lines. For example, header,header,filler"),
});

const urlSchema = z.object({
  url: z.string().optional().describe("The URL in the format: http(s)://domain.com."),
  username: z.string().optional().describe("The username for authentication of the notifications."),
  password: z.string().optional().describe("The password for authentication of the notifications."),
  encrypted: z.boolean().optional().describe("Indicates if the message sent to this URL should be encrypted."),
});

const eventUrlSchema = z.object({
  eventLocalUrls: z.array(urlSchema).optional().describe("One or more local URLs to send event notifications to when using Terminal API."),
  eventPublicUrls: z.array(urlSchema).optional().describe("One or more public URLs to send event notifications to when using Terminal API."),
});

const connectivitySchema = z.object({
  simcardStatus: z.enum(["ACTIVATED", "INVENTORY"]).optional().describe("Indicates the status of the SIM card in the payment terminal. Can be updated and received only at terminal level, and only for models that support cellular connectivity.\n\nPossible values:\n* **ACTIVATED**: the SIM card is activated. Cellular connectivity may still need to be enabled on the terminal itself, in the **Network** settings.\n* **INVENTORY**: the SIM card is not activated. The terminal can't use cellular connectivity."),
  terminalIPAddressURL: eventUrlSchema.nullable().optional().describe("The list of local and public URLs to send notifications to when using local integrations."),
});

const gratuitySchema = z.object({
  allowCustomAmount: z.boolean().optional().describe("Indicates whether one of the predefined tipping options is to let the shopper enter a custom tip. If **true**, only three of the other options defined in `predefinedTipEntries` are shown."),
  currency: z.string().optional().describe("The currency that the tipping settings apply to."),
  predefinedTipEntries: z.array(z.string()).optional().describe("Tipping options the shopper can choose from if `usePredefinedTipEntries` is **true**. The maximum number of predefined options is four, or three plus the option to enter a custom tip.\nThe options can be a mix of:\n\n- A percentage of the transaction amount. Example: **5%**\n- A tip amount in [minor units](https://docs.adyen.com/development-resources/currency-codes). Example: **500** for a EUR 5 tip."),
  usePredefinedTipEntries: z.boolean().optional().describe("Indicates whether the terminal shows a prompt to enter a tip (**false**), or predefined tipping options to choose from (**true**)."),
});

const hardwareSchema = z.object({
  displayMaximumBackLight: z.number().int().optional().describe("The brightness of the display when the terminal is being used, expressed as a percentage."),
  resetTotalsHour: z.number().int().optional().describe("The hour of the day when the terminal is set to reset the Totals report. By default, the reset hour is at 6:00 AM in the timezone of the terminal. Minimum value: 0, maximum value: 23."),
  restartHour: z.number().int().optional().describe("The hour of the day when the terminal is set to reboot to apply the configuration and software updates. By default, the restart hour is at 6:00 AM in the timezone of the terminal. Minimum value: 0, maximum value: 23."),
});

const localizationSchema = z.object({
  language: z.string().optional().describe("Language of the terminal."),
  secondaryLanguage: z.string().optional().describe("Secondary language of the terminal."),
  timezone: z.string().optional().describe("The time zone of the terminal."),
});

const keySchema = z.object({
  identifier: z.string().optional().describe("The unique identifier of the shared key."),
  passphrase: z.string().optional().describe("The secure passphrase to protect the shared key. Must consist of: \n\n* At least 12 characters.\n\n* At least 1 uppercase letter: `[A-Z]`. \n\n* At least 1 lowercase letter: `[a-z]`. \n\n* At least 1 digit: `[0-9]`. \n\n * At least 1 special character. Limited to the following: `~`, `@`, `$`, `%`, `^`, `&`, `*`, `(`, `)`, `_`, `+`, `=`, `}`, `{`, `]`, `[`, `;`, `:`, `?`, `.`, `,`, `>`, `<`."),
  version: z.number().int().optional().describe("The version number of the shared key."),
});

const notificationSchema = z.object({
  category: z.enum(["SaleWakeUp", "KeyPressed", ""]).optional().describe("The type of event notification sent when you select the notification button."),
  details: z.string().optional().describe("The text shown in the prompt which opens when you select the notification button. For example, the description of the input box for pay-at-table."),
  enabled: z.boolean().optional().describe("Enables sending event notifications either by pressing the Confirm key on terminals with a keypad or by tapping the event notification button on the terminal screen."),
  showButton: z.boolean().optional().describe("Shows or hides the event notification button on the screen of terminal models that have a keypad."),
  title: z.string().optional().describe("The name of the notification button on the terminal screen."),
});

const notificationUrlSchema = z.object({
  localUrls: z.array(urlSchema).optional().describe("One or more local URLs to send notifications to when using Terminal API."),
  publicUrls: z.array(urlSchema).optional().describe("One or more public URLs to send notifications to when using Terminal API."),
});

const nexoSchema = z.object({
  displayUrls: notificationUrlSchema.nullable().optional().describe("The list of local and public URLs to send display notifications to when using Terminal API."), 
  eventUrls: eventUrlSchema.nullable().optional().describe("The list of local and public URLs to send event notifications to when using Terminal API."),
  encryptionKey: keySchema.optional().describe("The key you share with Adyen to secure local communications when using Terminal API."),
  notification: notificationSchema.optional().describe("Configures sending event notifications by pressing a button on a terminal, for example used for pay-at-table."),
});

const offlineProcessingSchema = z.object({
  chipFloorLimit: z.number().int().optional().describe("The maximum offline transaction amount for chip cards, in the processing currency and specified in [minor units](https://docs.adyen.com/development-resources/currency-codes)."),
  offlineSwipeLimits: z.array(minorUnitsMonetaryValueSchema).optional().describe("The maximum offline transaction amount for swiped cards, in the specified currency."),
});

const opiSchema = z.object({
  enablePayAtTable: z.boolean().optional().describe("Indicates if Pay at table is enabled."),
  payAtTableStoreNumber: z.string().optional().describe("The store number to use for Pay at Table."),
  payAtTableURL: z.string().optional().describe("The URL and port number used for Pay at Table communication."),
});

const passcodesSchema = z.object({
  adminMenuPin: z.string().optional().describe("The passcode for the Admin menu and the Settings menu."),
  refundPin: z.string().optional().describe("The passcode for referenced and unreferenced refunds on standalone terminals."),
  screenLockPin: z.string().optional().describe( "The passcode to unlock the terminal screen after a timeout."),
  txMenuPin: z.string().optional().describe("The passcode for the Transactions menu."),
});

const payAtTableSchema = z.object({
  authenticationMethod: z.enum(["MAGSWIPE", "MKE"]).optional().describe("Allowed authentication methods: Magswipe, Manual Entry."),
  enablePayAtTable: z.boolean().optional().describe("Enable Pay at table."),
  paymentInstrument: z.enum(["Cash", "Card"]).nullable().optional().describe("Sets the allowed payment instrument for Pay at table transactions.  Can be: **cash** or **card**. If not set, the terminal presents both options."),
});

const paymentSchema = z.object({
  contactlessCurrency: z.string().length(3).optional().describe("The default currency for contactless payments on the payment terminal, as the three-letter [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code."),
  hideMinorUnitsInCurrencies: z.array(z.string()).optional().describe("Hides the minor units for the listed [ISO currency codes](https://en.wikipedia.org/wiki/ISO_4217)."),
});

const receiptOptionsSchema = z.object({
  logo: z.string().max(350000).optional().describe("The receipt logo converted to a Base64-encoded string. The image must be a .bmp file of < 256 KB, dimensions 240 (H) x 384 (W) px."),
  promptBeforePrinting: z.boolean().optional().describe("Indicates whether a screen appears asking if you want to print the shopper receipt."),
  qrCodeData: z.string().optional().describe("Data to print on the receipt as a QR code. This can include static text and the following variables:\n\n- `${merchantreference}`: the merchant reference of the transaction.\n- `${pspreference}`: the PSP reference of the transaction.\n\n For example, **http://www.example.com/order/${pspreference}/${merchantreference}**."),
});

const receiptPrintingSchema = z.object({
  merchantApproved: z.boolean().optional().describe("Print a merchant receipt when the payment is approved."),
  merchantCancelled: z.boolean().optional().describe("Print a merchant receipt when the transaction is cancelled."),
  merchantCaptureApproved: z.boolean().optional().describe("Print a merchant receipt when capturing the payment is approved."),
  merchantCaptureRefused: z.boolean().optional().describe("Print a merchant receipt when capturing the payment is refused."),
  merchantRefundApproved: z.boolean().optional().describe("Print a merchant receipt when the refund is approved."),
  merchantRefundRefused: z.boolean().optional().describe("Print a merchant receipt when the refund is refused."),
  merchantRefused: z.boolean().optional().describe("Print a merchant receipt when the payment is refused."),
  merchantVoid: z.boolean().optional().describe("Print a merchant receipt when a previous transaction is voided."),
  shopperApproved: z.boolean().optional().describe("Print a shopper receipt when the payment is approved."),
  shopperCancelled: z.boolean().optional().describe("Print a shopper receipt when the transaction is cancelled."),
  shopperCaptureApproved: z.boolean().optional().describe("Print a shopper receipt when capturing the payment is approved."),
  shopperCaptureRefused: z.boolean().optional().describe("Print a shopper receipt when capturing the payment is refused."),
  shopperRefundApproved: z.boolean().optional().describe("Print a shopper receipt when the refund is approved."),
  shopperRefundRefused: z.boolean().optional().describe("Print a shopper receipt when the refund is refused."),
  shopperRefused: z.boolean().optional().describe("Print a shopper receipt when the payment is refused."),
  shopperVoid: z.boolean().optional().describe("Print a shopper receipt when a previous transaction is voided."),
});

const referencedSchema = z.object({
  enableStandaloneRefunds: z.boolean().optional().describe("Indicates whether referenced refunds are enabled on the standalone terminal."),
});

const refundsSchema = z.object({
  referenced: referencedSchema.optional().describe("Settings for referenced refunds."),
});

const signatureSchema = z.object({
  askSignatureOnScreen: z.boolean().optional().describe("If `skipSignature` is false, indicates whether the shopper should provide a signature on the display (**true**) or on the merchant receipt (**false**)."),
  deviceName: z.string().optional().describe("Name that identifies the terminal."),
  deviceSlogan: z.string().max(50).optional().describe("Slogan shown on the start screen of the device."),
  skipSignature: z.boolean().optional().describe("Skip asking for a signature. This is possible because all global card schemes (American Express, Diners, Discover, JCB, MasterCard, VISA, and UnionPay) regard a signature as optional."),
});

const standaloneSchema = z.object({
  currencyCode: z.string().length(3).optional().describe("The default currency of the standalone payment terminal as an [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code."),
  enableGratuities: z.boolean().optional().describe("Indicates whether the tipping options specified in `gratuities` are enabled on the standalone terminal."),
  enableStandalone: z.boolean().optional().describe("Enable standalone mode."),
});

const supportedCardTypesSchema = z.object({
  credit: z.boolean().optional().describe("Set to **true** to accept credit cards."),
  debit: z.boolean().optional().describe("Set to **true** to accept debit cards."),
  deferredDebit: z.boolean().optional().describe("Set to **true** to accept cards that allow deferred debit."),
  prepaid: z.boolean().optional().describe("Set to **true** to accept prepaid cards."),
  unknown: z.boolean().optional().describe("Set to **true** to accept card types for which the terminal can't determine the funding source while offline."),
});

const storeAndForwardSchema = z.object({
  maxAmount: z.array(minorUnitsMonetaryValueSchema).optional().describe("The maximum amount that the terminal accepts for a single store-and-forward payment."),
  maxPayments: z.number().int().optional().describe("The maximum number of store-and-forward transactions per terminal that you can process while offline."),
  supportedCardTypes: supportedCardTypesSchema.optional().describe("The type of card for which the terminal accepts store-and-forward payments. You can specify multiple card types."),
});

const currencySchema = z.object({
  amount: z.number().int().optional().describe("Surcharge amount per transaction, in [minor units](https://docs.adyen.com/development-resources/currency-codes)."),
  currencyCode: z.string().optional().describe("Three-character [ISO currency code](https://docs.adyen.com/development-resources/currency-codes). For example, **AUD**."),
  maxAmount: z.number().int().optional().describe("The maximum surcharge amount per transaction, in [minor units](https://docs.adyen.com/development-resources/currency-codes)."),
  percentage: z.number().optional().describe("Surcharge percentage per transaction. The maximum number of decimal places is two. For example, **1%** or **2.27%**."),
});

const configurationSchema = z.object({
  brand: z.string().describe("Payment method, like **eftpos_australia** or **mc**. See the [possible values](https://docs.adyen.com/development-resources/paymentmethodvariant#management-api)."),
  commercial: z.boolean().optional().describe("Set to **true** to apply surcharges only to commercial/business cards."),
  country: z.array(z.string()).optional().describe("The country/region of the card issuer. If used, the surcharge settings only apply to the card issued in that country/region."),
  currencies: z.array(currencySchema).describe("Currency and percentage or amount of the surcharge."),
  sources: z.array(z.string()).optional().describe("Funding source. Possible values:\n* **Credit**\n* **Debit**"),
});

const surchargeSchema = z.object({
  askConfirmation: z.boolean().optional().describe("Show the surcharge details on the terminal, so the shopper can confirm."),
  configurations: z.array(configurationSchema).optional().describe("Surcharge fees or percentages for specific cards, funding sources (credit or debit), and currencies."),
  excludeGratuityFromSurcharge: z.boolean().optional().describe("Exclude the tip amount from the surcharge calculation."),
});

const tapToPaySchema = z.object({
  merchantDisplayName: z.string().optional().describe("The text shown on the screen during the Tap to Pay transaction."),
});

const terminalInstructionsSchema = z.object({
  adyenAppRestart: z.boolean().optional().describe("Indicates whether the Adyen app on the payment terminal restarts automatically when the configuration is updated."),
});

const timeoutsSchema = z.object({
  fromActiveToSleep: z.number().int().optional().describe("Indicates the number of seconds of inactivity after which the terminal display goes into sleep mode."),
});

const fileSchema = z.object({
  data: z.string().describe("The certificate content converted to a Base64-encoded string."),
  name: z.string().describe("The name of the certificate. Must be unique across Wi-Fi profiles."),
});

const profileSchema = z.object({
  authType: z.string().optional().describe("The type of Wi-Fi network. Possible values: **wpa-psk**, **wpa2-psk**, **wpa-eap**, **wpa2-eap**."),
  autoWifi: z.boolean().optional().describe("Indicates whether to automatically select the best authentication method available. Does not work on older terminal models."),
  bssType: z.string().optional().describe("Use **infra** for infrastructure-based networks. This applies to most networks. Use **adhoc** only if the communication is p2p-based between base stations."),
  channel: z.number().int().optional().describe("The channel number of the Wi-Fi network. The recommended setting is **0** for automatic channel selection."),
  defaultProfile: z.boolean().optional().describe("Indicates whether this is your preferred wireless network. If **true**, the terminal will try connecting to this network first."),
  domainSuffix: z.string().optional().describe("Specifies the server domain name for EAP-TLS and EAP-PEAP WiFi profiles on Android 11 and above."),
  eap: z.string().optional().describe("For `authType` **wpa-eap** or **wpa2-eap**. Possible values: **tls**, **peap**, **leap**, **fast**"),
  eapCaCert: fileSchema.optional().describe("For `authType` **wpa-eap** or **wpa2-eap**. The root certificate from the CA that signed the certificate of the RADIUS server that is part of your wireless network."),
  eapClientCert: fileSchema.optional().describe("For `eap` **tls**. The certificate chain for the terminals. All terminals in the same network will use the same EAP client certificate."),
  eapClientKey: fileSchema.optional().describe("For `eap` **tls**. The RSA private key for the client. Include the lines BEGIN RSA PRIVATE KEY and END RSA PRIVATE KEY."),
  eapClientPwd: z.string().optional().describe("For `eap` **tls**. The password of the RSA key file, if that file is password-protected."),
  eapIdentity: z.string().optional().describe("For `authType` **wpa-eap** or **wpa2-eap**. The EAP-PEAP username from your MS-CHAP account. Must match the configuration of your RADIUS server."),
  eapIntermediateCert: fileSchema.optional().describe("For `eap` **tls**. The EAP intermediate certificate."),
  eapPwd: z.string().optional().describe("For `eap` **peap**. The EAP-PEAP password from your MS-CHAP account. Must match the configuration of your RADIUS server."),
  hiddenSsid: z.boolean().optional().describe("Indicates if the network doesn't broadcast its SSID. Mandatory for Android terminals, because these terminals rely on this setting to be able to connect to any network."),
  name: z.string().optional().describe("Your name for the Wi-Fi profile."),
  psk: z.string().optional().describe("For `authType` **wpa-psk or **wpa2-psk**. The password to the wireless network."),
  ssid: z.string().describe("The name of the wireless network."),
  wsec: z.string().optional().describe("The type of encryption. Possible values: **auto**, **ccmp** (recommended), **tkip**"),
});

const settingsSchema = z.object({
  band: z.string().optional().describe("The preferred Wi-Fi band, for use if the terminals support multiple bands. Possible values: All, 2.4GHz, 5GHz."),
  roaming: z.boolean().optional().describe("Indicates whether roaming is enabled on the terminals."),
  timeout: z.number().int().optional().describe("The connection time-out in seconds. Minimum value: 0."),
});

const wifiProfilesSchema = z.object({
  profiles: z.array(profileSchema).optional().describe("List of remote Wi-Fi profiles."),
  settings: settingsSchema.optional().describe("General Wi-Fi settings."),
});

// The complete TerminalSettings schema
export const terminalSettingsSchema = z.object({
  cardholderReceipt: cardholderReceiptSchema.nullable().optional().describe("Settings to define the header of the shopper receipt."),
  connectivity: connectivitySchema.nullable().optional().describe("Settings for terminal connectivity features."),
  gratuities: z.array(gratuitySchema).nullable().optional().describe("Settings for tipping with or without predefined options to choose from. The maximum number of predefined options is four, or three plus the option to enter a custom tip."),
  hardware: hardwareSchema.describe("Settings for terminal hardware features."),
  localization: localizationSchema.describe("Settings for localization."),
  nexo: nexoSchema.describe("Settings for a Terminal API integration."),
  offlineProcessing: offlineProcessingSchema.describe("Settings for [offline payment](https://docs.adyen.com/point-of-sale/offline-payments) features."),
  opi: opiSchema.describe("Settings for an Oracle Payment Interface (OPI) integration."),
  passcodes: passcodesSchema.describe("Settings for [passcodes](https://docs.adyen.com/point-of-sale/managing-terminals/menu-access?tab=manage_passcodes_with_an_api_call_2#manage-passcodes) features."),
  payAtTable: payAtTableSchema.describe("Settings for [Pay-at-table](https://docs.adyen.com/point-of-sale/pay-at-x) features."),
  payment: paymentSchema.describe("Settings for payment features."),
  receiptOptions: receiptOptionsSchema.describe("Generic receipt settings."),
  receiptPrinting: receiptPrintingSchema.describe("Transaction outcomes that you want the terminal to print a merchant receipt or a shopper receipt for."),
  refunds: refundsSchema.describe("Settings for refunds."),
  signature: signatureSchema.describe("Settings to skip signature, sign on display, or sign on receipt."),
  standalone: standaloneSchema.describe("Settings for [standalone](https://docs.adyen.com/point-of-sale/standalone/standalone-build/set-up-standalone#set-up-standalone-using-an-api-call) features."),
  storeAndForward: storeAndForwardSchema.describe("Settings for store-and-forward offline payments. The `maxAmount`, `maxPayments`, and `supportedCardTypes` parameters must be configured, either in the request or inherited from a higher level in your account structure."),
  surcharge: surchargeSchema.describe("Settings for payment [surcharge](https://docs.adyen.com/point-of-sale/surcharge) features."),
  tapToPay: tapToPaySchema.describe("Settings for Tap to Pay."),
  terminalInstructions: terminalInstructionsSchema.describe("Settings to define the behaviour of the payment terminal."),
  timeouts: timeoutsSchema.describe("Settings for device [time-outs](https://docs.adyen.com/point-of-sale/pos-timeouts#device-time-out)."),
  wifiProfiles: wifiProfilesSchema.describe("Remote Wi-Fi profiles for WPA and WPA2 PSK and EAP Wi-Fi networks."),
});

// --- Schemas for Action Details ---
const installAndroidAppDetailsSchema = z.object({
  type: z.literal("InstallAndroidApp").describe("Type of terminal action: Install an Android app."),
  appId: z.string().describe("The unique identifier of the app to be installed."),
});

const installAndroidCertificateDetailsSchema = z.object({
  type: z.literal("InstallAndroidCertificate").describe("Type of terminal action: Install an Android certificate."),
  certificateId: z.string().describe("The unique identifier of the certificate to be installed."),
});

const releaseUpdateDetailsSchema = z.object({
  type: z.literal("ReleaseUpdate").describe("Type of terminal action: Update Release."),
  updateAtFirstMaintenanceCall: z.boolean().optional().describe("If true, the terminal updates at the first maintenance call. If false, it updates on its configured reboot time."),
});

const uninstallAndroidAppDetailsSchema = z.object({
  type: z.literal("UninstallAndroidApp").describe("Type of terminal action: Uninstall an Android app."),
  appId: z.string().describe("The unique identifier of the app to be uninstalled."),
});

const uninstallAndroidCertificateDetailsSchema = z.object({
  type: z.literal("UninstallAndroidCertificate").describe("Type of terminal action: Uninstall an Android certificate."),
  certificateId: z.string().describe("The unique identifier of the certificate to be uninstalled."),
});

// Main schema for the 'schedule terminal actions' request
export const scheduleTerminalActionsRequestSchema = z.object({
  actionDetails: z.discriminatedUnion("type", [
    installAndroidAppDetailsSchema,
    installAndroidCertificateDetailsSchema,
    releaseUpdateDetailsSchema,
    uninstallAndroidAppDetailsSchema,
    uninstallAndroidCertificateDetailsSchema,
  ]).describe("Information about the action to take."),
  terminalIds: z.array(z.string()).describe("A list of unique IDs of the terminals to apply the action to (maximum 100)."),
  storeId: z.string().optional().describe("The unique ID of the store. If present, all terminals in the `terminalIds` list must be assigned to this store."),
  scheduledAt: z.string().optional().describe("The date and time for the action in RFC 3339 format (e.g., 2021-11-15T12:16:21+01:00). If empty, the action occurs at the next maintenance call."),
});