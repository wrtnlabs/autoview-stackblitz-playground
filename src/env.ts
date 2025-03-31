import dotenv from "dotenv";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "YOUR_OPENAI_API_KEY";
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "o3-mini";

const env = {
  OPENAI_API_KEY,
  OPENAI_MODEL,
};

export default env;
