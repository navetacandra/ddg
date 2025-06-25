import { ResultParser, SearchResponse, VqdMetadata } from "../types";
import { request } from "../utils";

export async function media<T>(
  requestData: Omit<VqdMetadata, "vqd">,
  parser: ResultParser<T>,
  all: boolean = false,
): Promise<SearchResponse<T>> {
  const url = new URL(`https://duckduckgo.com${requestData.path}`);
  const res = await (await request(url.href)).text();
  const result: SearchResponse<T> = { data: [], next: null, hasNext: false };

  if (res === "If this error persists, please let us know: ops@duckduckgo.com")
    throw new Error("You got rate limit message.");

  const _parsed = JSON.parse(res);
  if (!("results" in _parsed)) return result; // no results

  const nextCursor = new URLSearchParams(_parsed.next).get("s");
  const nextVqd = _parsed.vqd[_parsed.queryEncoded];

  url.searchParams.set("s", nextCursor || "");
  url.searchParams.set("vqd", nextVqd || "");

  result.hasNext = !!nextCursor;
  if (result.hasNext)
    requestData.path =
      result.next = `${url.pathname}?${url.searchParams.toString()}`;

  const results = _parsed.results as any[];
  result.data = results.map((data) => parser(data));

  if (result.next && all) {
    const nextResult = await media<T>(requestData, parser, all);
    result.data = [...result.data, ...nextResult.data];
    result.next = null;
    result.hasNext = false;
  }

  return result;
}
