import dotenv from "dotenv";
import Stripe from "stripe";
import Order from "../modules/Order.js";
import Payment from "../modules/Payment.js";
import { createError } from "../utils/error.js";
dotenv.config();
export const getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (err) {
    //res.status(500).json({ error: "Failed to fetch users" });
    next(await createError(500, err, req, null));
  }
};

export const getDelivery = async (req, res, next) => {
  try {
    const payments = await Order.find({})
      .populate("user", "fname lname email mobilenumber profileimg")
      .populate("shoe", "name price producer productimg")
      .populate("payment", "paymentMethod paymentStatus stripePaymentIntentId")
      .exec();

    res.status(200).json(payments);
  } catch (err) {
    next(createError(500, err, req, null));
  }
};

export const getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment)
      return next(await createError(404, "Payment not found!", req, null));

    res.status(200).json(payment);
  } catch (err) {
    //res.status(500).json({ error: "Failed to fetch users" });
    next(await createError(500, err, req, null));
  }
};

export const addPayment = async (req, res, next) => {
  try {
    const payment = new Payment(req.body);
    const savedPayment = await payment.save();

    res.status(201).json(savedPayment);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const deletePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment)
      return next(await createError(404, "Payment not found!", req, null));

    res.status(200).json({ message: "Payment Deleted" });
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const updatePayment = async (req, res, next) => {
  try {
    const Paymentupdate = await Payment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!Paymentupdate)
      return next(await createError(404, "Payment not found!", req, null));

    res.status(200).json(Paymentupdate);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

// const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY); // Use the imported stripe directly

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckout = async (req, res, next) => {
  try {
    const line_items = req.body.cartItems.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.productimg[1]],
            metadata: {
              id: item.id,
            },
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      };
    });

    await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "LB"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Next day air",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}?TRUE`,
      cancel_url: `${process.env.CLIENT_URL}?false`,
    });
    // const order = {
    //   userId: req.body.userId,
    //   shoe: req.body.shoe,
    //   totalAmount: item.price * 100,
    // };

    // const response = await axios.post("http://localhost:8000/order",order)
    res.send({ url: session.url });
    // console.log("Order saved:", response.data);
  } catch (err) {
    next(err);
    console.log(err);
  }
};

export async function createPaymentIntent(req, res) {
  try {
    const { amount, id, customer } = req.body;
    const stripeInstance = Stripe(process.env.STRIPE_SECRET_KEY);
    // Create a Stripe payment intent
    await stripeInstance.paymentIntents.create({
      amount,
      currency: "usd", // Change to your desired currency
      payment_method: id,
      customer: customer,
      confirm: true,
    });
    res.json({
      message: "Payment successful",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function completePayment(req, res) {
  try {
    const { paymentMethod } = req.body;

    // Use the paymentMethod ID or paymentIntent ID received from the frontend to confirm the payment
    const paymentIntent = await stripeInstance.paymentIntents.confirm(
      paymentMethod
    );

    // Handle success/failure and send response back to the frontend
    if (paymentIntent.status === "succeeded") {
      res.json({ success: true, message: "Payment successful!" });
    } else {
      res.status(500).json({ success: false, message: "Payment failed." });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Payment failed.",
        error: error.message,
      });
  }
}
