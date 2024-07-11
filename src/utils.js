const http = require("http");
const https = require("https");

exports.request = (urlString, options = {}) => {
  return new Promise((resolve, reject) => {
    const urlObject = new URL(urlString);
    const protocol = urlObject.protocol === "https:" ? https : http;

    const req = protocol.request(urlString, options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(
            new Error(`Request failed with status code ${res.statusCode}`),
          );
        }
      });
    });

    req.on("error", (e) => {
      reject(new Error(`Problem with request: ${e.message}`));
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
};
