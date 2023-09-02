import mongoose from "mongoose";
const settingSchema = new mongoose.Schema({
  facebookLink: {
    type: String,
    default: "https://m.facebook.com/people/ESA-Coding-Lab/100076499853835/",
  },
  twitterLink: {
    type: String,
    default: "https://twitter.com/lab_esa",
  },
  instagramLink: {
    type: String,
    default: "https://www.instagram.com/esacodinglab/?igshid=YmMyMTA2M2Y%3D",
  },
  logoUrl: {
    type: String,
    required: true,
    default: "s",
  },
  email: {
    type: String,
    default: "ausmi.natalli@gmail.com",
  },
  phone: {
    type: String,
    default: "01/987333",
  },
  address: {
    type: String,
    default: "Sabra, rehab",
  },
});

export default mongoose.model("Setting", settingSchema);
