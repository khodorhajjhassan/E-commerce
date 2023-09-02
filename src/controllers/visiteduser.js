import axios from "axios";
import DeviceDetector from "node-device-detector";
import DeviceHelper from "node-device-detector/helper.js";
import VisitedUser from "../modules/VisitedUser.js";
import { createError } from "../utils/error.js";
export const getAllVistedUsers = async (req, res, next) => {
  try {
    const visitedUser = await VisitedUser.find();

    res.status(200).json(visitedUser);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const addVistedUser = async (req, res, next) => {
  try {
    const IPURL = await axios.get(
      "https://api.ipgeolocation.io/ipgeo?apiKey=" +
        process.env.IPgeolocationAPI
    );
    const data = IPURL.data;
    const deviceDetector = new DeviceDetector();
    const userAgent = req.headers["user-agent"];
    const result = deviceDetector.detect(userAgent);
    const deviceType = DeviceHelper.getDeviceType(result);

    const newVisitedUser = new VisitedUser({
      ipAddress: data.ip,
      deviceType: deviceType,
      country: data.country_name,
      city: data.city,
    });
    await newVisitedUser.save();

    res.status(200).json({ message: "User visit tracked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error tracking user visit" });
  }
};

export const deleteVisits = async (req, res, next) => {
  try {
    const deletedVisited = await VisitedUser.findByIdAndRemove(req.params.id);

    if (!deletedVisited)
      return next(await createError(404, "User Visit not found!", req, null));

    res.status(202).json({ message: "Visit deleted successfully" });
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};
