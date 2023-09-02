import paymentConfirmationEmail from "../StructureMail/paymentEmail.js";
import Order from "../modules/Order.js";
import { createError } from "../utils/error.js";

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    //res.status(500).json({ error: "Failed to fetch users" });
    next(await createError(500, err, req, null));
  }
};
export const getOrdersByUserId = async (req, res, next) => {
  try {
    const id = req.params.id;

    const orders = await Order.find({ user: id }).populate("shoe").exec();
    res.status(200).json(orders);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const getOrdersByProductID = async (req, res, next) => {
  try {
    const _id = req.params._id;

    const orders = await Order.find({
      shoe: {
        $elemMatch: {
          $elemMatch: {
            _id: _id,
          },
        },
      },
    });

    res.status(200).json(orders);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return next(await createError(404, "Order not found!"));

    res.status(200).json(order);
  } catch (err) {
    //res.status(500).json({ error: "Failed to fetch users" });
    next(await createError(500, err, req, null));
  }
};

export const addOrder = async (req, res, next) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    const to = req.body.email;
    const id = order._id;
    const amountPaid = savedOrder.totalPrice;
    const paymentDate = savedOrder.createdAt;
    console.log(savedOrder);
    console.log(to, id, amountPaid, paymentDate);
    paymentConfirmationEmail(to, id, amountPaid, paymentDate);

    res.status(201).json(savedOrder);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order)
      return next(await createError(404, "Order not found!", req, null));

    res.status(200).json({ message: "Order Deleted" });
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const Orderupdate = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!Orderupdate) return next(await createError(404, "Order not found!"));

    res.status(200).json(Orderupdate);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};
