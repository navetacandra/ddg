import { ResultParser, SearchResponse, VqdMetadata } from "../types";
export declare function media<T>(requestData: Omit<VqdMetadata, "vqd">, parser: ResultParser<T>, all?: boolean): Promise<SearchResponse<T>>;
