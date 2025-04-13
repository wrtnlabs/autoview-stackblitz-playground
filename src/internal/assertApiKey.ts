import env from "../env.js";

export const assertApiKey = (): void => {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "YOUR_OPENAI_API_KEY") {
    console.error("");
    console.error("[========= API KEY ERROR =========]");
    console.error("");
    console.error(
      "`OPENAI_API_KEY` is not set; please open the `src/env.ts` file and feed your own key",
    );
    console.error("");
    console.error("[=================================]");
    console.error("");
    process.exit(-1);
  }
};
