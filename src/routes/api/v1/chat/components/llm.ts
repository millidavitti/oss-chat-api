import { AzureOpenAI } from "openai";
import { AzureClientOptions } from "openai/azure";

export const llm = (options: AzureClientOptions) => new AzureOpenAI(options);
