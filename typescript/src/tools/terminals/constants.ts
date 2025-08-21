export const CREATE_TERMINAL_ACTION_NAME = "create_terminal_action";
export const CREATE_TERMINAL_ACTION_DESCRIPTION = `Schedules a terminal action by specifying the action and the terminals that the action must be applied to.

    Args:
        actionDetails (object, required): Information about the action to take.
        scheduledAt (string, optional): The date and time when the action should happen. Format: RFC 3339, but without the Z before the time offset. For example, 2021-11-15T12:16:21+0100
        storeId (string, optional): The unique ID of the store. If present, all terminals in the terminalIds list must be assigned to this store.
        terminalIds (array[string], optional): A list of unique IDs of the terminals to apply the action to. You can extract the IDs from the GET /terminals response. Maximum length: 100 IDs.

    Returns:
        object | string: The Adyen API response object reflecting the schedules terminal actions.

    Notes:
        - Corresponds to the Adyen Management API POST /terminals/scheduleActions endpoint.
        - Your API credential must have the "Management API—Terminal actions read and write" role to make this request.

    Examples:
        create_terminal_action_mcp(
            {
                actionDetails: {
                    "type": "InstallAndroidApp",
                    "appId": "ANDA422LZ223223K5F694GCCF732K8"
                },
                terminalIds: [
                    "S1E-000150183300032",
                    "S1E-000150183300033",
                    "S1F2-000150183300034"
                ],
                scheduledAt: "2021-12-12T20:21:22-0100",
            }
        )
        # Returns a success or error message.`;

export const GET_ANDROID_APP_NAME = "get_android_app";
export const GET_ANDROID_APP_DESCRIPTION = `Gets the details of the Android app.

    Args:
        id (string, required): The unique identifier of the Android app.
        companyId (string, required): The unique identifier of the company account.

    Returns:
        object | string: The Adyen API response object reflecting the Android app.

    Notes:
        - Corresponds to the Adyen Management API GET /companies/{companyId}/androidApps/{id} endpoint.
        - Your API credential must have the "Management API—Android files read" or "Management API—Android files read and write" role to make this request.
        - In the live environment, requests to this endpoint are subject to rate limits.

    Examples:
        get_android_app({id="TestApp", companyId="TestCompany"})
        # Returns the Adyen API response object listing Android app for {id="TestApp", companyId="TestCompany"}, or an error string.`;

export const GET_TERMINAL_SETTINGS_COMPANY_LEVEL_NAME = "get_terminal_settings_company_level";
export const GET_TERMINAL_SETTINGS_COMPANY_LEVEL_DESCRIPTION = `Gets the terminal settings that are configured for the company account level.

    Args:
        companyId (string, required): The unique identifier of the company account

    Returns:
        object | string: The Adyen API response object reflecting the terminal settings that is set for company level.

    Notes:
        - Corresponds to the Adyen Management API GET /companies/{companyId}/terminalSettings endpoint.
        - Your API credential must have the "Management API—Terminal settings read" or "Management API—Terminal settings read and write" role to make this request.
        - In the live environment, requests to this endpoint are subject to rate limits.

    Examples:
        get_terminal_settings_company_level_mcp({companyId="TestCompany"})
        # Returns the Adyen API response object listing terminal settings for "TestCompany", or an error string.`;

export const GET_TERMINAL_SETTINGS_MERCHANT_LEVEL_NAME = "get_terminal_settings_merchant_level";
export const GET_TERMINAL_SETTINGS_MERCHANT_LEVEL_DESCRIPTION = `Gets terminal settings that are configured for the merchant account level.

    Args:
        merchantId (string, required): The unique identifier of the merchant account

    Returns:
        object | string: The Adyen API response object reflecting the terminal settings that is set for merchant level.

    Notes:
        - Corresponds to the Adyen Management API GET /merchants/{merchantId}/terminalSettings endpoint.
        - Your API credential must have the "Management API—Terminal settings read" or "Management API—Terminal settings read and write" role to make this request.
        - In the live environment, requests to this endpoint are subject to rate limits.

    Examples:
        get_terminal_settings_merchant_level_mcp({merchantId="TestMerchant"})
        # Returns the Adyen API response object listing terminal settings for "TestMerchant", or an error string.`;

export const GET_TERMINAL_SETTINGS_STORE_LEVEL_NAME = "get_terminal_settings_store_level";
export const GET_TERMINAL_SETTINGS_STORE_LEVEL_DESCRIPTION = `Gets terminal settings that are configured for the store level.

    Args:
        storeId (string, required): The unique identifier of the store

    Returns:
        object | string: The Adyen API response object reflecting the terminal settings that is set for store level.

    Notes:
        - Corresponds to the Adyen Management API GET /stores/{storeId}/terminalSettings endpoint.
        - Your API credential must have the "Management API—Terminal settings read" or "Management API—Terminal settings read and write" role to make this request.
        - In the live environment, requests to this endpoint are subject to rate limits.

    Examples:
        get_terminal_settings_store_level_mcp({storeId="TestStore"})
        # Returns the Adyen API response object listing terminal settings for "TestStore", or an error string.`;

export const GET_TERMINAL_SETTINGS_TERMINAL_LEVEL_NAME = "get_terminal_settings_terminal_level";
export const GET_TERMINAL_SETTINGS_TERMINAL_LEVEL_DESCRIPTION = `Gets terminal settings that are configured for the terminal level.

    Args:
        terminalId (string, required): The unique identifier of the terminal

    Returns:
        object | string: The Adyen API response object reflecting the terminal settings that is set for terminal level.

    Notes:
        - Corresponds to the Adyen Management API GET /terminals/{terminalId}/terminalSettings endpoint.
        - Your API credential must have the "Management API—Terminal settings read" or "Management API—Terminal settings read and write" role to make this request.
        - In the live environment, requests to this endpoint are subject to rate limits.

    Examples:
        get_terminal_settings_terminal_level_mcp({terminalId="TestTerminal"})
        # Returns the Adyen API response object listing terminal settings for "TestTerminal", or an error string.`;

export const LIST_ANDROID_APPS_NAME = "list_android_apps";
export const LIST_ANDROID_APPS_DESCRIPTION = `Gets a list of Android apps.

    Args:
        companyId (string, required): The unique identifier of the company account.
        packageName (string, optional): The package name that uniquely identifies the Android app.
        versionCode (integer, optional): The version code of the Android app.
        pageNumber (integer, optional): The number of the page to fetch.
        pageSize (integer, optional): The number of items to have on a page, maximum 100. The default is 20 items on a page.

    Returns:
        object | string: The Adyen API response object reflecting the Android apps.

    Notes:
        - Corresponds to the Adyen Management API GET /companies/{companyId}/androidApps endpoint.
        - Your API credential must have the "Management API—Android files read" or "Management API—Android files read and write" role to make this request.
        - In the live environment, requests to this endpoint are subject to rate limits.

    Examples:
        get_android_apps({companyId="TestCompany"})
        # Returns the Adyen API response object listing Android apps for "TestCompany", or an error string.`;

export const LIST_ANDROID_CERTIFICATES_NAME = "list_android_certificates";
export const LIST_ANDROID_CERTIFICATES_DESCRIPTION = `Gets a list of Android certificates.

    Args:
        companyId (string, required): The unique identifier of the company account.
        certificateName (string, optional): The name of the certificate.
        pageNumber (integer, optional): The number of the page to fetch.
        pageSize (integer, optional): The number of items to have on a page, maximum 100. The default is 20 items on a page.

    Returns:
        object | string: The Adyen API response object reflecting the Android certificates.

    Notes:
        - Corresponds to the Adyen Management API GET /companies/{companyId}/androidCertificates endpoint.
        - Your API credential must have the "Management API—Android files read" or "Management API—Android files read and write" role to make this request.
        - In the live environment, requests to this endpoint are subject to rate limits.

    Examples:
        get_android_certificates({companyId="TestCompany"})
        # Returns the Adyen API response object listing Android certificates for "TestCompany", or an error string.`;

export const LIST_TERMINALS_NAME = "list_terminals";
export const LIST_TERMINALS_DESCRIPTION = `Gets a list of payment terminals.

    Args:
        searchQuery (string, optional): Returns terminals with an ID that contains the specified string. If present, other query parameters are ignored.
        otpQuery (string, optional): Returns one or more terminals associated with the one-time passwords specified in the request. If this query parameter is used, other query parameters are ignored.
        countries (string, optional): Returns terminals located in the countries specified by their two-letter country code.
        merchantIds (string, optional): Returns terminals that belong to the merchant accounts specified by their unique merchant account ID.
        storeIds (string, optional): Returns terminals that are assigned to the stores specified by their unique store ID.
        brandModels (string, optional): Returns terminals of the models specified in the format "brand.model".
        pageNumber (integer, optional): The number of the page to fetch.
        pageSize (integer, optional): The number of items to have on a page, maximum 100. The default is 20 items on a page.

    Returns:
        object | string: The Adyen API response object reflecting the list of terminals that the API credential has access to and that match the query parameters.

    Notes:
        - Corresponds to the Adyen Management API GET /terminals endpoint.
        - No parameters are required. If the user does not ask for the results to be filtered, do not include any parameters in the request.
        - To make this request, your API credential must have the "Management API — Terminal actions read" role.
        - In the live environment, requests to this endpoint are subject to rate limits.

    Examples:
        get_terminals_mcp({searchQuery="P400"})
        # Returns the Adyen API response object listing terminals with "P400" in their ID, or an error string.`;

export const LIST_TERMINAL_ACTIONS_NAME = "list_terminal_actions";
export const LIST_TERMINAL_ACTIONS_DESCRIPTION = `Gets a list of terminal actions.

    Args:
        companyId (string, required): The unique identifier of the company account.
        type (string, optional): The type of terminal actions. Allowed values: InstallAndroidApp, UninstallAndroidApp, InstallAndroidCertificate, UninstallAndroidCertificate.
        status (string, optional): The status of terminal actions. Allowed values: pending, successful, failed, cancelled, tryLater.
        pageNumber (integer, optional): The number of the page to fetch.
        pageSize (integer, optional): The number of items to have on a page, maximum 100. The default is 20 items on a page.

    Returns:
        object | string: The Adyen API response object reflecting the terminal actions.

    Notes:
        - Corresponds to the Adyen Management API GET /companies/{companyId}/terminalActions endpoint.
        - Your API credential must have the "Management API—Terminal actions read" or "Management API—Terminal actions read and write" role to make this request.
        - In the live environment, requests to this endpoint are subject to rate limits.

    Examples:
        get_terminal_actions({companyId="TestCompany", type="InstallAndroidApp", status="pending", pageNumber=1, pageSize=20})
        # Returns the Adyen API response object listing terminal actions for "TestCompany", or an error string.`;

export const REASSIGN_TERMINAL_NAME = "reassign_terminal";
export const REASSIGN_TERMINAL_DESCRIPTION = `Reassigns a payment terminal to a different company account, merchant account, or store.

    Args:
        terminalId (string, required): The unique identifier of the payment terminal to reassign.
        companyId (string, optional): The unique identifier of the company account to reassign the terminal to.
        merchantId (string, optional): The unique identifier of the merchant account to reassign the terminal to.
        storeId (string, optional): The unique identifier of the store to reassign the terminal to.
        inventory (boolean, optional): Set to true to reassign the terminal to the inventory of the specified merchant account.

    Returns:
        string: A confirmation message indicating the result of the reassignment operation.

    Notes:
        - Corresponds to the Adyen Management API POST /terminals/{terminalId}/reassign endpoint.
        - Your API credential must have the "Management API—Assign Terminal" role to make this request.
        - When reassigning to a merchant account, you must specify the inventory field.

    Examples:
        reassign_terminal_mcp({terminalId="S1F2-000150183300034", storeId="YOUR_STORE_ID"})
        # Returns a success or error message.`;

export const UPDATE_TERMINAL_SETTINGS_COMPANY_LEVEL_NAME = "update_terminal_settings_company_level";
export const UPDATE_TERMINAL_SETTINGS_COMPANY_LEVEL_DESCRIPTION = `Updates the terminal settings that are configured for the company account level.

    Args:
        companyId (string, required): The unique identifier of the company account
        settings (object, required): The terminal settings object to be updated. To change a parameter, include the full object that contains it. To restore a parameter to the value inherited from the Adyen PSP level, provide an empty value or omit the parameter.

    Returns:
        object | string: The Adyen API response object reflecting the updated terminal settings for the company level.

    Notes:
        - Corresponds to the Adyen Management API PATCH /companies/{companyId}/terminalSettings endpoint.
        - Your API credential must have the "Management API—Terminal settings read and write" role.
        - For sensitive terminal settings, the "Management API—Terminal settings Advanced read and write" role is required.
        - In the live environment, requests to this endpoint are subject to rate limits.

    Examples:
        update_terminal_settings_company_level_mcp({
            companyId="TestCompany",
            settings={ "signature": { "skipSignature": true } }
        })
        # Returns the updated terminal settings object for "TestCompany", or an error string.`;

export const UPDATE_TERMINAL_SETTINGS_MERCHANT_LEVEL_NAME = "update_terminal_settings_merchant_level";
export const UPDATE_TERMINAL_SETTINGS_MERCHANT_LEVEL_DESCRIPTION = `Updates terminal settings that are configured for the merchant account level.

    Args:
        merchantId (string, required): The unique identifier of the merchant account.
        settings (object, required): The terminal settings object to be updated. To change a parameter, include the full object that contains it. To restore a parameter to the value inherited from a higher level, provide an empty value or omit the parameter.

    Returns:
        object | string: The Adyen API response object reflecting the updated terminal settings for the merchant level, or an error string.

    Notes:
        - Corresponds to the Adyen Management API PATCH /merchants/{merchantId}/terminalSettings endpoint.
        - Your API credential must have the "Management API—Terminal settings read and write" role.
        - For sensitive terminal settings, the "Management API—Terminal settings Advanced read and write" role is required.
        - In the live environment, requests to this endpoint are subject to rate limits.

    Examples:
        update_terminal_settings_merchant_level_mcp({
            merchantId="TestMerchant",
            settings={ "offlineProcessing": { "chipFloorLimit": 10000 } }
        })
        # Returns the updated terminal settings object for "TestMerchant", or an error string.`;

export const UPDATE_TERMINAL_SETTINGS_STORE_LEVEL_NAME = "update_terminal_settings_store_level";
export const UPDATE_TERMINAL_SETTINGS_STORE_LEVEL_DESCRIPTION = `Updates terminal settings that are configured for the store level.

    Args:
        storeId (string, required): The unique identifier of the store.
        settings (object, required): The terminal settings object to be updated. To change a parameter, include the full object that contains it. To restore a parameter to the value inherited from a higher level, provide an empty value or omit the parameter.

    Returns:
        object | string: The Adyen API response object reflecting the updated terminal settings for the store level, or an error string.

    Notes:
        - Corresponds to the Adyen Management API PATCH /stores/{storeId}/terminalSettings endpoint.
        - Your API credential must have the "Management API—Terminal settings read and write" role.
        - For sensitive terminal settings, the "Management API—Terminal settings Advanced read and write" role is required.
        - In the live environment, requests to this endpoint are subject to rate limits.

    Examples:
        update_terminal_settings_store_level_mcp({
            storeId="TestStore",
            settings={ "receiptOptions": { "qrCodeData": "https://example.com/order" } }
        })
        # Returns the updated terminal settings object for "TestStore", or an error string.`;

export const UPDATE_TERMINAL_SETTINGS_TERMINAL_LEVEL_NAME = "update_terminal_settings_terminal_level";
export const UPDATE_TERMINAL_SETTINGS_TERMINAL_LEVEL_DESCRIPTION = `Updates terminal settings that are configured for the terminal level.

    Args:
        terminalId (string, required): The unique identifier of the payment terminal.
        settings (object, required): The terminal settings object to be updated. To change a parameter, include the full object that contains it. To restore a parameter to the value inherited from a higher level, provide an empty value or omit the parameter.

    Returns:
        object | string: The Adyen API response object reflecting the updated terminal settings, or an error string.

    Notes:
        - Corresponds to the Adyen Management API PATCH /terminals/{terminalId}/terminalSettings endpoint.
        - Your API credential must have the "Management API—Terminal settings read and write" role.
        - For sensitive terminal settings, the "Management API—Terminal settings Advanced read and write" role is required.
        - In the live environment, requests to this endpoint are subject to rate limits.

    Examples:
        update_terminal_settings_terminal_level_mcp({
            terminalId="TestTerminal",
            settings={ "hardware": { "displayMaximumBackLight": 80 } }
        })
        # Returns the updated terminal settings object for "TestTerminal", or an error string.`;