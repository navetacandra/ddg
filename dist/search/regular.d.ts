import { SearchResponse, WebResult, VqdMetadata } from "../types";
export declare function regular(
  requestData: Omit<VqdMetadata, "vqd">,
  all?: boolean,
): Promise<SearchResponse<WebResult>>;
