import { AutoViewAgent, IAutoViewAgentProvider } from "@autoview/agent";
import {
  HttpLlm,
  IChatGptSchema,
  IHttpLlmApplication,
  IHttpLlmFunction,
  OpenApi,
} from "@samchon/openapi";
import fs from "fs";
import OpenAI from "openai";
import typia from "typia";

import { YourSchema } from "./YourSchema";
import env from "./env.js";
import { assertApiKey } from "./internal/assertApiKey.js";

const generateForTsType = async (
  provider: IAutoViewAgentProvider,
): Promise<void> => {
  // GENERATE SCHEMA
  const schema: IChatGptSchema.IParameters = typia.llm.parameters<
    YourSchema,
    "chatgpt"
  >();

  // GENERATE CODE
  const result: AutoViewAgent.IResult = await AutoViewAgent.execute(
    provider,
    provider,
    {
      parameters: schema,
    },
  );
  await fs.promises.writeFile(
    "src/transformYourSchema.ts",
    result.transformTsCode,
    "utf8",
  );
};

const generateForSwagger = async (
  provider: IAutoViewAgentProvider,
): Promise<void> => {
  // GET SWAGGER SCHEMA INFORMATION
  const document: OpenApi.IDocument = OpenApi.convert(
    await fetch("https://shopping-be.wrtn.ai/editor/swagger.json").then((r) =>
      r.json(),
    ),
  );

  // CONVERT TO LLM FUNCTION CALLING SCHEMA
  const app: IHttpLlmApplication<"chatgpt"> = HttpLlm.application({
    model: "chatgpt",
    document,
    options: {
      reference: true,
    },
  });
  const page: IHttpLlmFunction<"chatgpt"> | undefined = app.functions.find(
    (func) =>
      func.path === "/shoppings/customers/sales" && func.method === "patch",
  );
  const sale: IHttpLlmFunction<"chatgpt"> | undefined = app.functions.find(
    (func) =>
      func.path === "/shoppings/customers/sales/{id}" && func.method === "get",
  );
  if (page === undefined || sale === undefined) {
    console.error("Operation not found");
    process.exit(-1);
  }

  // GENERATE
  await Promise.all(
    Object.entries({
      page,
      sale,
    }).map(async ([key, func]) => {
      const result: AutoViewAgent.IResult = await AutoViewAgent.execute(
        provider,
        provider,
        {
          schema: func.output!,
          $defs: func.parameters.$defs,
        },
      );
      await fs.promises.writeFile(
        `src/transform${key[0].toUpperCase()}${key.slice(1)}.ts`,
        result.transformTsCode,
        "utf8",
      );
    }),
  );
};

const main = async (): Promise<void> => {
  assertApiKey();

  const provider: IAutoViewAgentProvider = {
    type: "chatgpt",
    api: new OpenAI({
      apiKey: typia.assert<string>(env.OPENAI_API_KEY),
    }),
    model: typia.assert<OpenAI.ChatModel>(env.OPENAI_MODEL),
    isThinkingEnabled: false,
  };
  await Promise.all([
    generateForTsType(provider),
    generateForSwagger(provider),
  ]);
};
main().catch(console.error);
