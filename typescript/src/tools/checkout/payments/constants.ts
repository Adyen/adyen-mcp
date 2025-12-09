export const CREATE_PAYMENT_SESSION_NAME = 'create_payment_session';
export const CREATE_PAYMENT_SESSION_DESCRIPTION = `Creates a payment session for Adyen Drop-in, Components, or Hosted Checkout integrations.

    This tool initiates a payment session and returns encrypted data used by the front end
    to manage the payment flow.

    Args:
        currency (str): A 3 character currency code (e.g., EUR for euros, USD for US dollars).
        value (int): The transaction amount in minor units (e.g., 1099 for 10.99 EUR).
        merchantAccount (str): The merchant account identifier for processing the transaction.
        reference (str): A unique reference to identify the payment.
        returnUrl (str): The URL the shopper is redirected back to after completing the payment or authentication.
                         Format depends on the channel (web, iOS, Android). Max length: 8000 characters.

    Returns:
        str: The raw API response containing the encrypted payment session data. The front end then
        uses the session data to make any required server-side calls for the payment flow..
             The final payment outcome is delivered asynchronously via an AUTHORISATION webhook.

    Notes:
        - The \`returnUrl\` format varies by channel:
            - Web: Use \`http://\` or \`https://\`. Can include query parameters (e.g., \`https://your-company.com/checkout?orderId=123\`).
            - iOS: Use your app's custom URL scheme (e.g., \`my-app://\`).
            - Android: Use a custom URL handled by an Activity via an intent filter (e.g., \`my-app://your.package.name\`).
        - If \`returnUrl\` contains non-ASCII characters, it must be URL-encoded.
        - The \`returnUrl\` must NOT contain personally identifiable information (PII).
        - All arguments (\`currency\`, \`value\`, \`merchantAccount\`, \`reference\`, \`returnUrl\`) are mandatory.

    Examples:
        create_payment_session(
            {
                "merchantAccount": "your_merchant_account",
                "value": 2500,
                "currency": "EUR"
                "reference": "YOUR_UNIQUE_PAYMENT_REFERENCE",
                "returnUrl": "https://your-company.example.com/checkout?shopperOrder=12xy",
            }
        )
        # Returns the raw API response with encrypted session data. Check webhooks for authorisation status.`;

export const GET_PAYMENT_SESSION_NAME = 'get_payment_session';
export const GET_PAYMENT_SESSION_DESCRIPTION = `
    Returns the status of the payment session given a sessionId
    
    Args:
        sessionId (str): A unique identifier of the session.
`;

export const GET_PAYMENT_METHODS_NAME = 'get_payment_methods';
export const GET_PAYMENT_METHODS_DESCRIPTION = `
    Retrieves the list of available payment methods for the transaction based on the Merchant Account.
    
    Args:
        merchantAccount (str): A unique identifier of the session.
`;
