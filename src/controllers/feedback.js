import Feedback from "../modules/Feedback.js";
import { createError } from "../utils/error.js";

export const getFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (err) {
    //res.status(500).json({ error: "Failed to fetch users" });
    next(await createError(500, err, req, null));
  }
};

export const getFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback)
      return next(await createError(404, "Feedback not found!", req, null));

    res.status(200).json(feedback);
  } catch (err) {
    //res.status(500).json({ error: "Failed to fetch users" });
    next(await createError(500, err, req, null));
  }
};

// export const getFeedbackByUser = async (req, res, next) => {
//   try {
//     const userId = req.params.userId;
//     const shoeId = req.params.shoeId;

//     const feedback = await Feedback.find({ user: userId, shoe: shoeId });

//     res.status(200).json({ feedback });
//   } catch (err) {
//     next(await createError(500, err, req, null));
//   }
// };
export const checkDuplicateRating = async (req, res, next) => {
  const { user, order, rating } = req.body;

  try {
    const existingRating = await Feedback.findOne({ user, order });
    if (existingRating) {
      return res
        .status(400)
        .json({ message: "You have already rated this product." });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const addFeedback = async (req, res, next) => {
  try {
    const feedback = new Feedback(req.body);
    const savedFeedback = await feedback.save();

    res.status(201).json(savedFeedback);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback)
      return next(await createError(404, "Feedback not found!", req, null));

    res.status(200).json({ message: "Feedback Deleted" });
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const updateFeedback = async (req, res, next) => {
  try {
    const Feedbackupdate = await Feedback.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!Feedbackupdate)
      return next(await createError(404, "Feedback not found!", req, null));

    res.status(200).json(Feedbackupdate);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const getFeedbackByUser = async (req, res) => {
  const { orderId, userId } = req.params;

  try {
    const feedback = await Feedback.findOne({ user: userId, order: orderId });
    return res.status(200).json(feedback);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getAverageRatingForShoe = async (req, res, next) => {
  try {
    const shoeId = req.params.shoeId;

    const feedbacks = await Feedback.find({ shoe: shoeId });

    if (feedbacks.length === 0) {
      return res.status(200).json({ averageRating: 0 });
    }

    let totalRating = 0;
    feedbacks.forEach((feedback) => {
      totalRating += feedback.rating;
    });

    const averageRating = totalRating / feedbacks.length;

    res.status(200).json({ averageRating });
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};
