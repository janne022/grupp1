import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: `../grupp1.Server/openapi.json`,
    },
    output: {
      mode: "tags-split",
      target: "./src/shared/api/endpoints",
      schemas: {
        path: "./src/shared/api/models",
        splitByTags: true,
      },
      client: "fetch",
      clean: true,
      //prettier: true, apparently prettier is not working with the new version of orval
      // so we will use eslint instead. Good to know.
    },
  },
});
