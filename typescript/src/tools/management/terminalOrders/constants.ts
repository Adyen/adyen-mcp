export const LIST_TERMINAL_MODELS_NAME = 'list_terminal_models';
export const LIST_TERMINAL_MODELS_DESCRIPTION = `Gets a list of terminal models available for ordering.

    Args:
        companyId (string, required): The unique identifier of the company account.

    Returns:
        object: The Adyen API response listing terminal models.

    Notes:
        - Corresponds to the Adyen Management API GET /companies/{companyId}/terminalModels endpoint.`;

export const LIST_TERMINAL_PRODUCTS_NAME = 'list_terminal_products';
export const LIST_TERMINAL_PRODUCTS_DESCRIPTION = `Gets a list of terminal products available for ordering for a country.

    Args:
        companyId (string, required): The unique identifier of the company account.
        country (string, required): Required. Two-letter ISO 3166-1 alpha-2 country code. Terminals are region-locked; the API returns only what is orderable for that country.
        terminalModelId (string, optional): The unique identifier of the terminal model.
        offset (integer, optional): The number of items to skip.
        limit (integer, optional): The number of items to return.

    Returns:
        object: The Adyen API response listing terminal products.

    Notes:
        - Corresponds to the Adyen Management API GET /companies/{companyId}/terminalProducts endpoint.
        - Part of the Terminal Ordering Workflow:
          1. Call list_terminal_models to see available models.
          2. Call list_terminal_products with the country code to get orderable product IDs.
          3. Call list_billing_entities to get the billingEntityId.
          4. Call list_shipping_locations or create_shipping_location to get a shippingLocationId.
          5. Call create_terminal_order to place the order.`;

export const LIST_BILLING_ENTITIES_NAME = 'list_billing_entities';
export const LIST_BILLING_ENTITIES_DESCRIPTION = `Gets a list of billing entities for a company.

    Args:
        companyId (string, required): The unique identifier of the company account.
        name (string, optional): The name of the billing entity to filter by.

    Returns:
        object: The Adyen API response listing billing entities.

    Notes:
        - Corresponds to the Adyen Management API GET /companies/{companyId}/billingEntities endpoint.
        - NOTE: Billing entities are provisioned by Adyen during account onboarding and CANNOT be created via the API. If none is returned, it is an account-setup gap.`;

export const LIST_SHIPPING_LOCATIONS_NAME = 'list_shipping_locations';
export const LIST_SHIPPING_LOCATIONS_DESCRIPTION = `Gets a list of shipping locations for a company.

    Args:
        companyId (string, required): The unique identifier of the company account.
        name (string, optional): The name of the shipping location to filter by.
        offset (integer, optional): The number of items to skip.
        limit (integer, optional): The number of items to return.

    Returns:
        object: The Adyen API response listing shipping locations.

    Notes:
        - Corresponds to the Adyen Management API GET /companies/{companyId}/shippingLocations endpoint.`;

export const CREATE_SHIPPING_LOCATION_NAME = 'create_shipping_location';
export const CREATE_SHIPPING_LOCATION_DESCRIPTION = `Creates a shipping location to use in terminal orders.

    Args:
        companyId (string, required): The unique identifier of the company account.
        name (string, required): Name of the shipping location.
        address (object, optional): Address object containing city, companyName, country, postalCode, stateOrProvince, streetAddress, streetAddress2.
        contact (object, optional): Contact object containing email, firstName, infix, lastName, phoneNumber.

    Returns:
        object: The Adyen API response representing the created shipping location.

    Notes:
        - Corresponds to the Adyen Management API POST /companies/{companyId}/shippingLocations endpoint.
        - After creating a shipping location, wait a few seconds before creating the order to ensure synchronization in the Adyen backend.`;

export const CREATE_TERMINAL_ORDER_NAME = 'create_terminal_order';
export const CREATE_TERMINAL_ORDER_DESCRIPTION = `Creates a terminal order.

    Args:
        companyId (string, required): The unique identifier of the company account.
        items (array[object], required): List of order items, each containing:
            - id (string, required): The unique product identifier from list_terminal_products.
            - quantity (integer, required): Number of units to order.
            - name (string, optional): Name of the product.
            - installments (integer, optional): Number of installments.
        billingEntityId (string, required): The unique identifier of the billing entity.
        shippingLocationId (string, required): The unique identifier of the shipping location.
        customerOrderReference (string, optional): Customer reference for the order.
        taxId (string, optional): The tax ID of the order. Needed when shipping location and billing entity are in different countries.
        orderType (string, optional): The order type.

    Returns:
        object: The Adyen API response representing the created terminal order.

    Notes:
        - Corresponds to the Adyen Management API POST /companies/{companyId}/terminalOrders endpoint.
        - Terminal Ordering Workflow:
          1. Use list_terminal_models to see available models.
          2. Use list_terminal_products with a required two-letter ISO country code to get orderable product IDs for that country (terminals are region-locked; the API returns only what is orderable for that country).
          3. Use list_billing_entities to get the billingEntityId (NOTE: billing entities are provisioned by Adyen from account onboarding and CANNOT be created via API; if none is returned, it's an account-setup gap).
          4. Use list_shipping_locations or create_shipping_location to get a shippingLocationId. After creating a shipping location, wait a few seconds before creating the order.
          5. Use create_terminal_order with items (array of {id, quantity}), billingEntityId, shippingLocationId, optional customerOrderReference and taxId.`;

export const LIST_TERMINAL_ORDERS_NAME = 'list_terminal_orders';
export const LIST_TERMINAL_ORDERS_DESCRIPTION = `Gets a list of terminal orders for a company.

    Args:
        companyId (string, required): The unique identifier of the company account.
        customerOrderReference (string, optional): The customer order reference to filter by.
        status (string, optional): The status of the terminal orders. Allowed values: Placed, Confirmed, Cancelled, Shipped, Delivered.
        offset (integer, optional): The number of items to skip.
        limit (integer, optional): The number of items to return.

    Returns:
        object: The Adyen API response listing terminal orders.

    Notes:
        - Corresponds to the Adyen Management API GET /companies/{companyId}/terminalOrders endpoint.`;

export const GET_TERMINAL_ORDER_NAME = 'get_terminal_order';
export const GET_TERMINAL_ORDER_DESCRIPTION = `Gets the status details of a terminal order by order ID.

    Args:
        companyId (string, required): The unique identifier of the company account.
        orderId (string, required): The unique identifier of the terminal order.

    Returns:
        object: The Adyen API response representing the terminal order.

    Notes:
        - Corresponds to the Adyen Management API GET /companies/{companyId}/terminalOrders/{orderId} endpoint.`;

export const UPDATE_TERMINAL_ORDER_NAME = 'update_terminal_order';
export const UPDATE_TERMINAL_ORDER_DESCRIPTION = `Updates a terminal order.

    Args:
        companyId (string, required): The unique identifier of the company account.
        orderId (string, required): The unique identifier of the terminal order.
        items (array[object], optional): List of order items (updating items replaces the whole array).
        billingEntityId (string, optional): The billing entity ID.
        shippingLocationId (string, optional): The shipping location ID.
        customerOrderReference (string, optional): The customer order reference.
        taxId (string, optional): The tax ID.
        orderType (string, optional): The order type.

    Returns:
        object: The Adyen API response representing the updated terminal order.

    Notes:
        - Corresponds to the Adyen Management API PATCH /companies/{companyId}/terminalOrders/{orderId} endpoint.
        - Updates only work while the order status is "Placed".
        - Updating items replaces the whole array.`;

export const CANCEL_TERMINAL_ORDER_NAME = 'cancel_terminal_order';
export const CANCEL_TERMINAL_ORDER_DESCRIPTION = `Cancels a terminal order.

    Args:
        companyId (string, required): The unique identifier of the company account.
        orderId (string, required): The unique identifier of the terminal order.

    Returns:
        object: The Adyen API response representing the cancelled terminal order.

    Notes:
        - Corresponds to the Adyen Management API POST /companies/{companyId}/terminalOrders/{orderId}/cancel endpoint.
        - Cancellations only work while the order status is "Placed".`;
