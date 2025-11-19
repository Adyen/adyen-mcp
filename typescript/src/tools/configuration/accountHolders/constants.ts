export const GET_ACCOUNT_HOLDER_NAME = "get_account_holder";
export const GET_ACCOUNT_HOLDER_DESCRIPTION = `Returns an account holder's details and capabilities. 

    Args:
        id (str): The unique identifier for the account holder

    Returns:
        object: The raw response from the Adyen API containing the AccountHolder object. 

    Notes:
        - The 'id' parameter is the path parameter and is mandatory. If necessary, ask the user to provide this data.

    Examples:
        get_account_holder({id: "AHXXXXXXXXXXXXXXXXXXXXXXXXX"})
        # Returns the raw response from the Adyen API, containing the AccountHolder object.`;
