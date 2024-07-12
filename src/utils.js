const http = require("http");
const https = require("https");

function randomIpV4() {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(
    Math.random() * 255,
  )}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function randomIPv6() {
  const hexChars = "0123456789abcdef";
  let ipv6 = "";
  
  for (let i = 0; i < 8; i++) {
    let segment = "";
    for (let j = 0; j < 4; j++) segment += hexChars[Math.floor(Math.random() * hexChars.length)];
    ipv6 += segment;
    if (i < 7) ipv6 += ":";
  }

  return ipv6;
}


exports.request = (urlString, options = {}) => {
  return new Promise((resolve, reject) => {
    const urlObject = new URL(urlString);
    const protocol = urlObject.protocol === "https:" ? https : http;

    const req = protocol.request(
      urlString,
      {
        ...options,
        headers: { ...options.headers, "X-Forwarded-For": [randomIpV4(), randomIPv6()][Math.floor(Math.random() * 2)] },
      },
      (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(
              new Error(
                `Request for ${urlString} failed with status code ${res.statusCode}`,
              ),
            );
          }
        });
      },
    );

    req.on("error", (e) => {
      reject(new Error(`Problem with request: ${e.message}`));
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
};

/**
 * Get the JS URL
 *
 * @param {string} query
 * @returns {Promise<{url: string, path: string, vqd: string}>}
 */
exports.getJS = async (query) => {
  const html = await exports.request(`https://duckduckgo.com/?q=${query}`);
  const url = html.match(
    /"(https:\/\/links\.duckduckgo\.com\/d\.js[^">]+)">/,
  )[1];
  return {
    url,
    path: url.match(/\/d\.js.*/)[0],
    vqd: url.match(/vqd=([^&]+)/)[1],
  };
};
