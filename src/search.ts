import { media } from "./search/media";
import { web } from "./search/web";
import {
  ImageResult,
  MapResult,
  ResultParser,
  NewsResult,
  WebResult,
  SearchQuery,
  SearchResponse,
  SearchCategory,
  VideoResult,
  VqdMetadata,
} from "./types";
import { getJS } from "./utils";

export function search(
  request: SearchQuery,
  type: "web",
  all?: boolean,
): Promise<SearchResponse<WebResult>>;
export function search(
  request: SearchQuery,
  type: "image",
  all?: boolean,
): Promise<SearchResponse<ImageResult>>;
export function search(
  request: SearchQuery,
  type: "video",
  all?: boolean,
): Promise<SearchResponse<VideoResult>>;
export function search(
  request: SearchQuery,
  type: "news",
  all?: boolean,
): Promise<SearchResponse<NewsResult>>;
export function search(
  request: SearchQuery,
  type: "map",
  all?: boolean,
): Promise<SearchResponse<MapResult>>;

export async function search(
  request: SearchQuery,
  type: SearchCategory = "web",
  all: boolean = false,
): Promise<SearchResponse<any>> {
  const searchRequest: VqdMetadata = request.next
    ? {
        path: request.next,
        vqd: new URLSearchParams(request.next).get("vqd") || "",
      }
    : await getJS(request.query);
  if (!searchRequest.vqd) throw new Error("Invalid VQD");

  if (type === "web") return web(searchRequest, all);
  else {
    let parser: ResultParser<any> = (data: any) => data;
    if (type === "image") {
      searchRequest.path = `/i.js?q=${encodeURIComponent(request.query)}&o=json&s=0&u=bing&l=us-en&vqd=${searchRequest.vqd}&p=-1&image_exp=a&product_ad_extensions_exp=b`;
      parser = ({
        width,
        height,
        url,
        title,
        image: imageUrl,
      }): ImageResult => ({ width, height, url, title, imageUrl });
    } else if (type === "video") {
      searchRequest.path = `/v.js?q=${encodeURIComponent(request.query)}&o=json&s=0&u=bing&l=us-en&vqd=${searchRequest.vqd}&p=-1`;
      parser = ({
        content: url,
        title,
        description,
        duration,
        images: thumbnails,
        embed_url: embedUrl,
        published: publishedAt,
        publisher,
      }): VideoResult => ({
        url,
        title,
        description,
        duration,
        thumbnails,
        embedUrl,
        publishedAt,
        publisher,
      });
    } else if (type === "news") {
      searchRequest.path = `/news.js?q=${encodeURIComponent(request.query)}&o=json&s=0&u=bing&l=us-en&vqd=${searchRequest.vqd}&p=-1&noamp=1`;
      parser = ({
        image: imageUrl,
        excerpt,
        relative_time: relativeTime,
        source,
        title,
        url,
        date,
      }): NewsResult => ({
        excerpt,
        relativeTime,
        source,
        title,
        url,
        date: Number(`${date}`.padEnd(13, "0")),
        ...(imageUrl ? { imageUrl } : {}),
      });
    } else if (type === "map") {
      searchRequest.path = `/local.js?q=${encodeURIComponent(request.query)}&o=json&s=0&u=bing&l=us-en&vqd=${searchRequest.vqd}&tg=maps_places&rt=D&mkexp=b&wiki_info=1&is_requery=1&latitude=0&longitude=0&location_type=geoip`;
      parser = ({
        id,
        name,
        address,
        city,
        address_lines: addressLines,
        coordinates,
        country_code: countryCode,
        ddg_category: category,
        display_phone: phone,
        timezone,
      }): MapResult => ({
        id,
        name,
        address,
        city,
        addressLines,
        coordinates,
        countryCode,
        category,
        phone,
        timezone,
      });
    }

    return media(searchRequest, parser, all);
  }
}
