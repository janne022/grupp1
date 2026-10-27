import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: `../grupp1.Server/openapi.json`,
    },
    output: {
      mode: "tags-split",
      target: "./src/api/endpoints",
      schemas: "./src/api/models",
      client: "fetch",
      //prettier: true, apparently prettier is not working with the new version of orval
      // so we will use eslint instead. Good to know.
    },
  },
});
