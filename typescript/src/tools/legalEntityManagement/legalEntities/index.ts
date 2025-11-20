import { z } from 'zod';
import { Client, LegalEntityManagementAPI } from '@adyen/api-library';
import {
  GET_LEGAL_ENTITY_NAME,
  GET_LEGAL_ENTITY_DESCRIPTION,
} from './constants.js';
import { Tool } from '../../types.js';

const getLegalEntityRequestShape: z.ZodRawShape = {
  id: z.string(),
};

const getLegalEntityObject = z.object(getLegalEntityRequestShape);

const getLegalEntity = async (
  client: Client,
  getLegalEntityRequest: z.infer<typeof getLegalEntityObject>,
) => {
  const { id } = getLegalEntityRequest;
  const legalEntityManagmentApi = new LegalEntityManagementAPI(client);
  try {
    return await legalEntityManagmentApi.LegalEntitiesApi.getLegalEntity(id);
  } catch (e) {
    return 'Failed to get legal entity. Error: ' + JSON.stringify(e);
  }
};

export const getLegalEntityTool: Tool = {
  name: GET_LEGAL_ENTITY_NAME,
  description: GET_LEGAL_ENTITY_DESCRIPTION,
  arguments: getLegalEntityObject,
  invoke: getLegalEntity,
};
