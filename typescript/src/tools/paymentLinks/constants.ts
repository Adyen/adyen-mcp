export const CREATE_PAYMENT_LINKS_NAME = "create_payment_links";
export const CREATE_PAYMENT_LINKS_DESCRIPTION = `Creates a payment link at Adyen given an amount.

    Args:
        currency (str): A 3 character currency code (e.g., EUR for euros, USD for US dollars).
        value (int): The transaction amount in minor units.
        merchantAccount (str): The merchant account identifier.
        countryCode(str): The shopper's two-letter country code.
        reference(str): A reference that is used to uniquely identify the payment in future communications about the payment status.

    Returns:
        str: The raw response from the Adyen API, containing the payment link URL. And the linkId as \`id\`.

    Notes:
        - The \`value\` parameter should be specified in minor units, which is the smallest unit of the currency.
          For example, for EUR, the minor unit is cents (1 EUR = 100 cents), so a value of 10.99 EUR would be 1099.
        - The \`currency\` parameter should be a valid 3 character currency code.
        - \`currency\`, \`value\`, \`merchantAccount\` and \`countryCode\` are all mandatory fields.
          If necessary, ask the user to provide this data.

    Examples:
        create_payment_link({currency: "EUR", value: 1099, merchantAccount: "your_merchant_account", countryCode:"NL", reference: "myReference123"})
        # Returns the raw response from the Adyen API, containing the payment link URL. And the linkId as \`id\`.`;

export const GET_PAYMENT_LINK_NAME = "get_payment_link";
export const GET_PAYMENT_LINK_DESCRIPTION = `Get a payment link at Adyen given a linkId.

    Args:
        linkId (str): Unique identifier of the payment link. 

    Returns:
        str: The raw response from the Adyen API, containing the payment link URL.

    Examples:
        get_payment_link({linkId: "PLE83C39B0A0DE0C1E"})
        # Returns the raw response from the Adyen API, containing the payment link URL.`;

export const UPDATE_PAYMENT_LINK_NAME = "update_payment_link";
export const UPDATE_PAYMENT_LINK_DESCRIPTION = `Updates the status of an Adyen Payment Link, primarily used to manually expire a link.

    Args:
        linkId (string): The unique identifier of the payment link to update.
        status (string): The status to set. Currently only 'expired' is supported via the API.

    Returns:
        object | string: The Adyen API response object reflecting the update, or an error string.

    Notes:
        - Corresponds to the Adyen Checkout API \`PATCH /paymentLinks/{linkId}\` endpoint.
        - Primarily used to force expiry of a payment link.
        - Assumes a pre-configured Adyen client instance is available.

    Examples:
        update_payment_link({linkId:"PL61C53A8B97E6915A", status: "expired"})
        # Returns the updated Adyen API response object or an error string.`;
