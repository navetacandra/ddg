import { VqdMetadata } from "./types";
export declare const request: (url: RequestInfo | URL, options?: RequestInit) => Promise<Response>;
export declare const getJS: (query: string) => Promise<VqdMetadata>;
