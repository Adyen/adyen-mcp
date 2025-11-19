import { z } from "zod";
import { Client, Types, LegalEntityManagementAPI } from "@adyen/api-library";
import {
  CREATE_HOSTED_ONBOARDING_LINK_DESCRIPTION,
  CREATE_HOSTED_ONBOARDING_LINK_NAME
} from "./constants";
import { Tool } from "../../types";

const createHostedOnboardingLinkShape: z.ZodRawShape = {
  id: z.string()
};

const createHostedOnboardingLinkObject = z.object(createHostedOnboardingLinkShape);

const createHostedOnboardingLink = async (
  client: Client,
  createHostedOnboardingLinkRequest: z.infer<typeof createHostedOnboardingLinkObject> 
) => {
  const {id} = createHostedOnboardingLinkRequest;
  const legalEntityManagementApi = new LegalEntityManagementAPI(client)
  try {
     return await legalEntityManagementApi.HostedOnboardingApi.getLinkToAdyenhostedOnboardingPage(id, {})
  } catch (e) {
    return "Failed to get account holder. Error: " + JSON.stringify(e);
  }
}

export const createHostedOnboardingLinkTool: Tool = {
  name: CREATE_HOSTED_ONBOARDING_LINK_NAME,
  description: CREATE_HOSTED_ONBOARDING_LINK_DESCRIPTION,
  arguments: createHostedOnboardingLinkObject,
  invoke: createHostedOnboardingLink,
};