import {
	DefaultAzureCredential,
	getBearerTokenProvider,
} from "@azure/identity";

const credential = new DefaultAzureCredential();
const scope = "https://cognitiveservices.azure.com/.default";
export const azureADTokenProvider = getBearerTokenProvider(credential, scope);
