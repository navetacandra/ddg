import { SearchResponse, WebResult, VqdMetadata } from "../types";
import { request } from "../utils";

export async function web(
  requestData: Omit<VqdMetadata, "vqd">,
  all: boolean = false,
) {
  const res = await (
    await request(`https://links.duckduckgo.com${requestData.path}`)
  ).text();
  const result: SearchResponse<WebResult> = {
    data: [],
    next: null,
    hasNext: false,
  };

  if (res === "If this error persists, please let us know: ops@duckduckgo.com")
    throw new Error("You got rate limit message.");

  const match = res.match(/DDG\.pageLayout\.load\('d',? ?(\[.+\])?\);/);
  if (!match || !match[1]) return result;
  const ddgData = match[1];

  if (ddgData) {
    const parsed = JSON.parse(ddgData) as any[];
    result.data = parsed
      .filter((d) => !d.n)
      .map((item) => ({
        title: item.t,
        url: item.u,
        domain: item.i,
        description: item.a,
        icon: `https://external-content.duckduckgo.com/ip3/${item.i}.ico`,
      }));
    result.next = parsed.find((d) => d.n)?.n || null;
    result.hasNext = !!result.next;
  }

  if (result.next && all) {
    const nextResult = await web({ path: result.next }, all);
    result.data = [...result.data, ...nextResult.data];
    result.next = null;
    result.hasNext = false;
  }

  return result;
}
