import { defineConfig } from "orval";

const input = {
  target: `../grupp1.Server/openapi.json`,
};

export default defineConfig({
  kindergartens: {
    input: {
      ...input,
      filters: {
        tags: ["Kindergartens"],
      },
    },
    output: {
      mode: "tags-split",
      target: "./src/features/kindergartens/-api/endpoints",
      schemas: "./",
      client: "fetch",
    },
  },
  api: {
    input: {
      target: `../grupp1.Server/openapi.json`,
    },
    output: {
      mode: "tags-split",
      target: "./src/shared/api/endpoints",
      schemas: "./src/shared/api/models",
      client: "fetch",
      clean: true,
      //prettier: true, apparently prettier is not working with the new version of orval
      // so we will use eslint instead. Good to know.
    },
  },
});
