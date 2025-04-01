# AutoView Playground
Automate your frontend development.

Modify [`src/YourSchema.ts`](./src/YourSchema.ts) type, and run `npm run generate` command after assigning your OpenAI API key into the [`.env`](./.env) file.

Then `@autoview` will generate frontend rendering code for the `YourSchema` type, and the newly generated code would be written in the [`src/transformYourSchema.ts`](./src/transformYourSchema.ts) file. Also, following the changed interface type, website of right side would be automatically updated too.

If you want to see how to utilize such frontend automation tool, look at the [`src/generate.ts`](./src/generate.ts) file.
