export const CREATE_HOSTED_ONBOARDING_LINK_NAME = "create_hosted_onboarding_link";
export const CREATE_HOSTED_ONBOARDING_LINK_DESCRIPTION = `Returns a link to an Adyen-hosted onboarding page where you need to redirect your user.

    Args:
        id (str): The unique identifier of the legal entity. (Path parameter)
        locale (str, optional): The language for the page (e.g., "en-US", "nl-NL"). Defaults to browser language or "en-US".
        redirectUrl (str, optional): The URL where the user is redirected after completing onboarding.
        settings (object, optional): Key-value pairs for hosted onboarding page settings (e.g., acceptedCountries, editPrefilledCountry). See OnboardingLinkSettings schema for details.
        themeId (str, optional): The unique identifier of the hosted onboarding theme.

    Returns:
        object: The raw response from the Adyen API, containing the OnboardingLink object with the hosted onboarding page 'url'.

    Purpose: Users utilize hosted onboarding links to view and edit their legal entity details, update and create transfer instruments and bank details, and upload documents. If needed, the user can utilize this to fix problems surfaced in the GET legalEntities problems[] array. 
    
    Notes:
        - The 'id' parameter is mandatory and part of the URL path.
        - The generated URL expires after 4 minutes and can only be used once. If the link expires, you need to create a new one.
        - The link can be used by account holders to fix their legal entity details, update their bank account, and upload documents. 
        - If asked for help fixing an issue with a legal entity, transfer instrument, bank account, document, or account holder information, you can use this tool to generate a new link for the user.
    
    Examples:
        create_hosted_onboarding_link({id: "LEXXXXXXXXXXXXXXXXXXXXXXXXX", locale: "en-US", redirectUrl: "https://your-company.example.com", themeId: "THEMEXXXXXXXXXXXXXXXXXXXXXXXX"})
        # Returns the raw response from the Adyen API, containing the OnboardingLink object with the URL.`;
