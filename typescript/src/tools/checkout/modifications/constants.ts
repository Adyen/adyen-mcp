export const REFUND_PAYMENT_NAME = 'refund_payment';
export const REFUND_PAYMENT_DESCRIPTION = `Refunds a previously captured payment using the Adyen API.

    Args:
        paymentPspReference (str): The unique identifier of the payment to be refunded.
        currency (str): A 3 character currency code (e.g., EUR for euros, USD for US dollars). This must match the currency of the original payment.
        value (int): The amount to be refunded, specified in minor units (e.g., 1099 for 10.99 EUR). This must be less than or equal to the captured amount.
        merchantAccount (str): The merchant account identifier used to process the original payment.

    Returns:
        str: A unique reference for the refund request. The actual outcome (success/failure) is delivered asynchronously via a REFUND webhook.

    Notes:
        - This endpoint should only be used for payments that have already been captured. If the capture status is uncertain, use the \`reversals\` tool instead.
        - You can refund the full captured amount or perform multiple partial refunds, provided the total refunded amount does not exceed the original captured amount.
        - Support for partial refunds varies by payment method (e.g., cards, iDEAL, Klarna). Check specific payment method documentation for details.

    Examples:
        refund_payment("PSP_REFERENCE_XYZ", "EUR", 2500, "your_merchant_account")
        # Returns a unique reference for the refund request. Check webhooks for the final status.`;

export const CANCEL_PAYMENT_NAME = 'cancel_payment';
export const CANCEL_PAYMENT_DESCRIPTION = `Cancels an authorisation on a payment that has not yet been captured using the Adyen API.

    Args:
        paymentReference (str): The reference of the payment that you want to cancel.
        merchantAccount (str): The merchant account identifier used to process the payment.

    Returns:
        str: A unique reference for the cancellation request. The outcome of the request is delivered asynchronously via a TECHNICAL_CANCEL webhook.

    Notes:
        - This endpoint should only be used for payments that have not yet been captured.
        - If you want to cancel a payment using the \`pspReference\`, use the \`/payments/{paymentPspReference}/cancels\` endpoint instead. You must check if a tool is available.
        - If you want to cancel a payment but are not sure whether it has been captured, use the \`/payments/{paymentPspReference}/reversals\` endpoint instead.  You must check if a tool is available.

    Examples:
        cancel_payment("YOUR_UNIQUE_PAYMENT_REFERENCE", "YOUR_MERCHANT_ACCOUNT")
        # Returns a unique reference for the cancellation request. Check TECHNICAL_CANCEL webhook for the final status.`;
