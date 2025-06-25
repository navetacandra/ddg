import { ImageResult, MapResult, NewsResult, WebResult, SearchQuery, SearchResponse, VideoResult } from "./types";
export declare function search(request: SearchQuery, type: "web", all?: boolean): Promise<SearchResponse<WebResult>>;
export declare function search(request: SearchQuery, type: "image", all?: boolean): Promise<SearchResponse<ImageResult>>;
export declare function search(request: SearchQuery, type: "video", all?: boolean): Promise<SearchResponse<VideoResult>>;
export declare function search(request: SearchQuery, type: "news", all?: boolean): Promise<SearchResponse<NewsResult>>;
export declare function search(request: SearchQuery, type: "map", all?: boolean): Promise<SearchResponse<MapResult>>;
