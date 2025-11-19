export const GET_LEGAL_ENTITY_NAME = "get_legal_entity";        
export const GET_LEGAL_ENTITY_DESCRIPTION = `Gets all of the details about a legal entity.

    Args:
        id (string): The unique identifier of the legal entity

    Returns:
        object: The Adyen API response object reflecting the legal entity details.

    Notes:
        - Corresponds to the Adyen Legal Entity Management API \`GET /legalEntities/{id}\` endpoint.
        - Primarily used to learn more about the details of a legal entity. 
        - Contains information about the legal entity's verification status. 
        - Contains information about the problems during KYC. 

    Examples:
        get_legal_entity({id="LE00000000000000000000001"})
        # Returns the updated Adyen API response object or an error string.`;
