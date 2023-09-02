import MailingList from "../modules/mailingList.js";

export const addToMailingList = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingEmail = await MailingList.findOne({ email });
    if (existingEmail) {
      return res
        .status(409)
        .json({ message: "Email already exists in the mailing list" });
    }

    // Save the email to the mailing list
    const newEmail = new MailingList({ email });
    await newEmail.save();

    return res
      .status(201)
      .json({ message: "Email added to the mailing list successfully" });
  } catch (error) {
    console.error("Error adding email to the mailing list:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const ViewMails = async (req, res, next) => {
  try {
    const mails = await MailingList.find();

    return res.status(200).json(mails);
  } catch (error) {}
};
