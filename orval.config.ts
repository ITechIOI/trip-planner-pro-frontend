// orval.config.ts
import { defineConfig } from "orval";

export default defineConfig({
  tripPlannerApi: {
    input: {
      target: "docs/api/swagger.yaml",
    },
    output: {
      mode: "tags-split",
      target: "./src/shared/api/generated/index.ts",
      schemas: "./src/shared/api/generated/model",

      // Generate TanStack Query hooks
      client: "react-query",

      // Use Axios under generated React Query hooks
      httpClient: "axios",

      clean: true,
      // prettier: true,

      override: {
        mutator: {
          path: "./src/shared/http/custom-instance.ts",
          name: "customInstance",
        },

        query: {
          useQuery: true,
          useMutation: true,

          // Cache helpers for invalidation and manual query updates.
          useInvalidate: true,
          useSetQueryData: true,
          useGetQueryData: true,

          // Pass AbortSignal from React Query into generated requests.
          signal: true,

          queryOptions: {
            path: "./src/shared/query-options.ts",
            name: "withDefaultQueryOptions",
          },
        },
      },
    },
  },
});
