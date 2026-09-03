import { z } from 'zod';

// Validation rules below mirror the Adyen Management API v3 definition
// (https://docs.adyen.com/api-explorer/Management/3/). The API itself often
// returns vague errors, so we validate the documented field formats up front
// and return precise messages the caller can act on.

export const addressSchema = z.object({
  city: z.string().optional().describe('The name of the city.'),
  companyName: z.string().optional().describe('The name of the company.'),
  country: z
    .string()
    .regex(
      /^[A-Za-z]{2}$/,
      'country must be a two-letter ISO 3166-1 alpha-2 code, for example "DE", "NL" or "US".',
    )
    .transform((c) => c.toUpperCase())
    .optional()
    .describe(
      'The two-letter ISO 3166-1 alpha-2 country code (e.g. DE, NL, US). Automatically upper-cased.',
    ),
  postalCode: z.string().optional().describe('The postal code.'),
  stateOrProvince: z
    .string()
    .optional()
    .describe(
      'The state or province as an ISO 3166-2 code (e.g. "ON" for Ontario). Only applicable for Australia, Brazil, Canada, India, Mexico, New Zealand and the United States.',
    ),
  streetAddress: z
    .string()
    .optional()
    .describe('The name of the street, and the house or building number.'),
  streetAddress2: z
    .string()
    .optional()
    .describe('Additional address details, if any.'),
});

export const contactSchema = z.object({
  email: z
    .string()
    .email(
      'email must be a valid email address, for example "name@example.com".',
    )
    .optional()
    .describe("The individual's email address."),
  firstName: z.string().optional().describe("The individual's first name."),
  infix: z
    .string()
    .optional()
    .describe("The infix in the individual's name, if any."),
  lastName: z.string().optional().describe("The individual's last name."),
  phoneNumber: z
    .string()
    .regex(
      /^\+?[0-9]{10,14}$/,
      'phoneNumber must be 10-14 digits with an optional leading "+", for example "+491234567890".',
    )
    .optional()
    .describe(
      "The individual's phone number, specified as 10-14 digits with an optional + prefix.",
    ),
});

export const orderItemSchema = z.object({
  id: z
    .string()
    .min(
      1,
      'id is required: use a product id returned by list_terminal_products.',
    )
    .describe('The unique product identifier from list_terminal_products.'),
  quantity: z
    .number()
    .int('quantity must be a whole number.')
    .positive('quantity must be at least 1.')
    .describe('Number of units to order (at least 1).'),
  name: z.string().optional().describe('The name of the product.'),
  installments: z
    .number()
    .int('installments must be a whole number.')
    .positive('installments must be at least 1.')
    .optional()
    .describe('The number of installments for the specified product id.'),
});

export const shippingLocationSchema = z.object({
  name: z
    .string()
    .min(1, 'name is required: a unique name for the shipping location.')
    .describe(
      'The unique name of the shipping location (used to identify it later).',
    ),
  contact: contactSchema
    .optional()
    .describe('The contact details of the recipient.'),
  address: addressSchema
    .optional()
    .describe(
      'The shipping address. Provide at least country, streetAddress, city and postalCode for a deliverable location.',
    ),
});

export const terminalOrderRequestSchema = z.object({
  items: z
    .array(orderItemSchema)
    .min(1, 'items must contain at least one product to order.')
    .describe('The products included in the order (at least one).'),
  billingEntityId: z
    .string()
    .min(1, 'billingEntityId, if provided, must not be empty.')
    .optional()
    .describe(
      'The id of the billing entity to use for the order (from list_billing_entities). Required for all countries except Brazil.',
    ),
  shippingLocationId: z
    .string()
    .min(
      1,
      'shippingLocationId is required: use an id from list_shipping_locations or create_shipping_location.',
    )
    .describe(
      'The id of the shipping location to use for the order (from list_shipping_locations or create_shipping_location).',
    ),
  customerOrderReference: z
    .string()
    .optional()
    .describe('The merchant-defined purchase order reference.'),
  taxId: z
    .string()
    .optional()
    .describe('The tax number of the billing entity.'),
  orderType: z.string().optional().describe('Type of order.'),
});
