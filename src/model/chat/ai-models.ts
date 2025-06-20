import { azureADTokenProvider } from "@routes/api/v1/chat/components/azure-identity";
import { AzureClientOptions } from "openai/azure";

export const aiModels = {
	"gpt-4.1-mini": {
		endpoint: process.env.OPENAI_ENDPOINT,
		deployment: "gpt-4.1-mini",
		apiVersion: "2025-03-01-preview",
		azureADTokenProvider,
	} as AzureClientOptions,
	"gpt-4.1": {
		endpoint: process.env.OPENAI_ENDPOINT,
		deployment: "gpt-4.1",
		apiVersion: "2025-03-01-preview",
		azureADTokenProvider,
	} as AzureClientOptions,
	"o4-mini": {
		endpoint: process.env.OPENAI_ENDPOINT,
		deployment: "o4-mini",
		apiVersion: "2025-03-01-preview",
		azureADTokenProvider,
	} as AzureClientOptions,
	"o3-mini": {
		endpoint: process.env.OPENAI_ENDPOINT,
		deployment: "o3-mini",
		apiVersion: "2025-03-01-preview",
		azureADTokenProvider,
	} as AzureClientOptions,
	"o1-mini": {
		endpoint: process.env.OPENAI_ENDPOINT,
		deployment: "o1-mini",
		apiVersion: "2025-03-01-preview",
		azureADTokenProvider,
	} as AzureClientOptions,
	o1: {
		endpoint: process.env.OPENAI_ENDPOINT,
		deployment: "o1",
		apiVersion: "2025-03-01-preview",
		azureADTokenProvider,
	} as AzureClientOptions,
};

export type Model = keyof typeof aiModels;
