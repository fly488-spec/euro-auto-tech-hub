import { queryOptions } from "@tanstack/react-query";

import { getStorefrontCatalog } from "./catalog.functions";

export const storefrontCatalogQuery = queryOptions({
  queryKey: ["storefront", "catalog"],
  queryFn: () => getStorefrontCatalog(),
});
