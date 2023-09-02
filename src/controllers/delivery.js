import Delivery from "../modules/Delivery.js";
import { createError } from "../utils/error.js";

export const getDeliveries = async (req, res, next) => {
  try {
    const delivery = await Delivery.find();
    res.status(200).json(delivery);
  } catch (err) {
    //res.status(500).json({ error: "Failed to fetch users" });
    next(await createError(500, err, req, null));
  }
};

export const getDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery)
      return next(await createError(404, "Delivery not found!", req, null));

    res.status(200).json(delivery);
  } catch (err) {
    //res.status(500).json({ error: "Failed to fetch users" });
    next(await createError(500, err, req, null));
  }
};

export const addDelivery = async (req, res, next) => {
  try {
    const delivery = new Delivery(req.body);
    const savedDelivery = await delivery.save();

    res.status(201).json(savedDelivery);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const deleteDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id);

    if (!delivery)
      return next(await createError(404, "Delivery not found!", req, null));

    res.status(200).json({ message: "Delivery Deleted" });
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const updateDelivery = async (req, res, next) => {
  try {
    const Deliveryupdate = await Delivery.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!Deliveryupdate)
      return next(await createError(404, "Delivery not found!", req, null));

    res.status(200).json(Deliveryupdate);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const getDeleviryByOrderId = async (req, res, next) => {
  try {
    const id = req.params.id;
    const delivery = await Delivery.find({ order: id });
    res.status(200).json(delivery);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};
