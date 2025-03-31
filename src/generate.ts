import { AutoViewAgent, IAutoViewAgentProvider } from "@autoview/agent";
import fs from "fs";
import OpenAI from "openai";
import typia from "typia";

import { YourSchema } from "./YourSchema";
import env from "./env.js";
import { assertApiKey } from "./internal/assertApiKey.js";

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

  const schema = typia.llm.parameters<YourSchema, "chatgpt">();
  const result: AutoViewAgent.IResult = await AutoViewAgent.execute(
    provider,
    provider,
    {
      parameters: schema,
    },
  );
  await fs.promises.writeFile(
    "src/transform.ts",
    result.transformTsCode,
    "utf8",
  );
};
main().catch(console.error);
