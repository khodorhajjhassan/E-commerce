import UAParser from "ua-parser-js";

export const parseUserAgent = (userAgentString) => {
  const uaParser = new UAParser(userAgentString);
  const result = uaParser.getResult();

  return {
    operatingSystem: `${result.os.name} ${result.os.version}`,
    browser: `${result.browser.name} ${result.browser.version}`,
  };
};
