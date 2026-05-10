import type { QueryClient, QueryKey } from "@tanstack/react-query";

export const invalidateFeatureQueries = async (
  queryClient: QueryClient,
  queryKeys: readonly QueryKey[],
) => {
  await Promise.all(
    queryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
  );
};

export const removeFeatureQueries = (
  queryClient: QueryClient,
  queryKeys: readonly QueryKey[],
) => {
  queryKeys.forEach((queryKey) => {
    queryClient.removeQueries({ queryKey });
  });
};
