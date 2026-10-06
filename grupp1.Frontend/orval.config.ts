import { defineConfig } from 'orval';

const backendUrl =
    process.env.SERVER_HTTPS ||
    process.env.SERVER_HTTP ||
    'http://localhost:8080';

export default defineConfig({
    api: {
    input: {
        target: `${backendUrl}/openapi/v1.json`,
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