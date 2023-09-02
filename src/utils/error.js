// errorLogModel.js

import Logs from "../modules/Logs.js";
import { parseUserAgent } from "./parseUserAgent.js";
import DeviceDetector from "node-device-detector";
import DeviceHelper from "node-device-detector/helper.js";

// ... Other code ...

export const createError = async (status, message, req, user) => {
  const failed = true;
  const err = new Error();
  const detector = new DeviceDetector();

  err.status = status;
  err.message = message;
  // Get operating system and browser information from user agent string
  const userAgentString = req.headers["user-agent"];
  const result = detector.detect(userAgentString);

  const deviceType = DeviceHelper.isDesktop(result)
    ? "Desktop"
    : DeviceHelper.isTablet(result)
    ? "Tablet"
    : DeviceHelper.isAndroid(result)
    ? "Android"
    : DeviceHelper.isIOS(result)
    ? "IOS"
    : "Unknown";

  const { operatingSystem, browser } = parseUserAgent(userAgentString);

  // Store the error in the database using the ErrorLog model

  try {
    const errorLog = new Logs({
      status: err.status,
      message: err.message,
      deviceType,
      operatingSystem,
      browser,
      user, // Store the user information
    });

    await errorLog.save();
  } catch (error) {
    // If an error occurs while saving to the database, you may want to log it or handle it accordingly
    console.error("Error saving error log to the database:", error);
  }

  return err;
};

// ... Other code ...
