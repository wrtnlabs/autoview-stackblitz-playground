import {
  AutoViewAgent,
  IAutoViewResult,
  IAutoViewVendor,
} from "@autoview/agent";
import {
  HttpLlm,
  IHttpLlmApplication,
  IHttpLlmFunction,
  OpenApi,
} from "@samchon/openapi";
import fs from "fs";
import OpenAI from "openai";
import typia from "typia";

import { YourSchema } from "./YourSchema";
import env from "./env";
import { assertApiKey } from "./internal/assertApiKey";

const generateForTsType = async (vendor: IAutoViewVendor): Promise<void> => {
  const agent = new AutoViewAgent({
    vendor,
    input: {
      type: "json-schema",
      unit: typia.json.schema<YourSchema>(),
    },
    transformFunctionName: "transformYourSchema",
    experimentalAllInOne: true,
  });
  const result: IAutoViewResult = await agent.generate();
  await fs.promises.writeFile(
    "src/transformYourSchema.ts",
    result.transformTsCode,
    "utf8",
  );
};

const generateForSwagger = async (vendor: IAutoViewVendor): Promise<void> => {
  // GET SWAGGER SCHEMA INFORMATION
  const document: OpenApi.IDocument = OpenApi.convert(
    await fetch(
      "https://raw.githubusercontent.com/samchon/shopping-backend/refs/heads/master/packages/api/swagger.json",
    ).then((r) => r.json()),
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
      const name: string = `transform${key[0].toUpperCase()}${key.slice(1)}`;
      const agent: AutoViewAgent = new AutoViewAgent({
        vendor,
        input: {
          type: "llm-schema",
          model: "chatgpt",
          schema: func.output!,
          $defs: func.parameters.$defs,
        },
        instruction:
          key === "page" ? "use carousel layout for each item" : undefined,
        transformFunctionName: name,
        experimentalAllInOne: true,
      });
      const result: IAutoViewResult = await agent.generate();
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

  const vendor: IAutoViewVendor = {
    api: new OpenAI({
      apiKey: typia.assert<string>(env.OPENAI_API_KEY),
    }),
    model: typia.assert<OpenAI.ChatModel>(env.OPENAI_MODEL),
  };
  await Promise.all([generateForTsType(vendor), generateForSwagger(vendor)]);
};
main().catch(console.error);
