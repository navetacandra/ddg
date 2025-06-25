import { SearchResponse, WebResult, VqdMetadata } from "../types";
export declare function web(requestData: Omit<VqdMetadata, "vqd">, all?: boolean): Promise<SearchResponse<WebResult>>;
