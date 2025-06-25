import { VqdMetadata } from "./types";

const randomIPv4 = (): string =>
  Array.from({ length: 4 })
    .map((_) => Math.floor(Math.random() * 255))
    .join(".");
const randomIPv6Segment = (): string =>
  Math.random().toString(16).slice(2, 6).padStart(4, "0");
const randomIPv6 = (): string =>
  Array.from({ length: 8 })
    .map((_) => randomIPv6Segment())
    .join(":");

const userAgents: string[] = [
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 11.0; Surface Duo) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
];

export const request = async (
  url: RequestInfo | URL,
  options?: RequestInit,
): Promise<Response> =>
  await fetch(url, {
    ...options,
    headers: {
      accept: "text/html; charset=utf-8",
      "accept-language": "en-US,en;q=0.9,id;q=0.8",
      "cache-control": "no-cache",
      pragma: "no-cache",
      "user-agent": userAgents[Math.floor(Math.random() * userAgents.length)],
      ...options?.headers,
      "x-forwarded-for": `${randomIPv4()}, ${randomIPv6()}`,
    },
  });

export const getJS = async (query: string): Promise<VqdMetadata> => {
  const html = await (
    await request(
      `https://duckduckgo.com/?q=${encodeURIComponent(query)}&ia=web`,
    )
  ).text();
  const regex = /"(https:\/\/links\.duckduckgo\.com\/d\.js[^">]+)">/;
  const url = html.match(regex)![1];

  return {
    path: url.match(/\/d\.js.*/)![0],
    vqd: url.match(/vqd=([^&]+)/)![1],
  };
};
