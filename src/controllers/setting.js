import Setting from "../modules/Setting.js";
import uploadImagetoCloud from "../utils/Cloudinary/uploadImagetoCloud.js";
import { createError } from "../utils/error.js";

export const getSocialMediaLinks = async (req, res, next) => {
  try {
    const socialMediaLinks = await Setting.find();
    if (!socialMediaLinks)
      return next(createError(404, "Social media links not found!", req, null));
    res.status(200).json(socialMediaLinks);
  } catch (err) {
    next(err);
  }
};

export const updateSocialMediaLinks = async (req, res, next) => {
  try {
    const { _id, ...fieldsToUpdate } = req.body;
    console.log(fieldsToUpdate);
    let socialMediaLink;
    if (_id) {
      socialMediaLink = await Setting.findById(_id);
      if (!socialMediaLink) {
        return next(
          createError(404, "Social media link not found!", req, null)
        );
      }
    } else {
      socialMediaLink = new Setting(fieldsToUpdate);
    }

    for (const [field, value] of Object.entries(fieldsToUpdate)) {
      socialMediaLink[field] = value;
    }

    const updatedSocialMediaLink = await socialMediaLink.save();
    res.status(200).json(updatedSocialMediaLink);
  } catch (err) {
    next(err);
  }
};

export const getLogo = async (req, res, next) => {
  try {
    const logo = await Setting.findOne();
    if (!logo) return next(createError(404, "Logo not found!", req, null));
    res.status(200).json({ logoUrl: logo.logoUrl });
  } catch (err) {
    next(err);
  }
};

export const uploadLogo = async (req, res, next) => {
  try {
    const file = req.body.base64Image;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const _id = "64e7be6f673a33a570fe67dd";

    const uploadedImage = await uploadImagetoCloud(file);

    const updateResult = await Setting.updateOne(
      { _id },
      { $set: { logoUrl: uploadedImage } } // Wrap the image in an array
    );

    if (updateResult.nModified === 0) {
      return res.status(404).json({ message: "Logo not found" });
    }

    res.status(200).json({ uploadedImages: [uploadedImage] }); // Wrap the image in an array
  } catch (error) {
    console.error("Error uploading logo:", error);
    next(error);
  }
};

export const deleteLogo = async (req, res) => {
  try {
    const _id = "64e7be6f673a33a570fe67dd";

    const updateResult = await Setting.updateOne(
      { _id },
      { $set: { logoUrl: "" } }
    );

    if (updateResult.nModified === 0) {
      return res.status(404).json({ message: "Logo not found" });
    }

    res.status(200).json({ message: "Logo deleted successfully" });
  } catch (error) {
    console.error("Error deleting logo:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getContactInfo = async (req, res) => {
  try {
    console.log("sdsdsdsds");
    const contact = await Setting.find();
    console.log("sss=>", contact);
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch contact information" });
  }
};

export const updateContactInfo = async (req, res) => {
  const { email, phone, address, id } = req.body;

  try {
    let contact = await Setting.findOne();
    if (!contact) {
      contact = new Setting({ email, phone, address });
    } else {
      contact.email = email;
      contact.phone = phone;
      contact.address = address;
    }
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: "Could not update contact information" });
  }
};
