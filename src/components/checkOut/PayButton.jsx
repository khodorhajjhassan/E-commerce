import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.scss";

import { clearCart } from "../../redux/cartSlice";

const CARD_OPTIONS = {
  hidePostalCode: true,
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#333",
      fontWeight: 500,
      fontFamily: "Roboto, sans-serif",
      fontSize: "18px", // Increase font size for bigger fields
      fontSmoothing: "antialiased",
      "::placeholder": { color: "#ccc" },
      transition: "all 0.2s", // Add transition for smooth hover effect
    },
    invalid: {
      iconColor: "#ff677d",
      color: "#ff677d",
    },
  },
};

const PayButton = () => {
  const [success, setSuccess] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const user = useSelector((state) => state.user.user.userDetails);
  const cart = useSelector((state) => state.user.cart);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    billingState: "",
    billingZip: "",
    cardHolder: "",
    email: "",
    billingAddress: "",
    billingCountry: "",
    billingCity: "",
    billingProvince: "",
    billingStreet: "",
    billingBuilding: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.cardHolder) {
      errors.cardHolder = "Card holder's name is required";
    }
    if (!formData.email) {
      errors.email = "Email is required";
    }
    if (!formData.billingAddress) {
      errors.billingAddress = "Billing address is required";
    }
    if (!formData.billingCountry) {
      errors.billingCountry = "Billing country is required";
    }
    if (!formData.billingCity) {
      errors.billingCity = "Billing city is required";
    }
    if (!formData.billingProvince) {
      errors.billingProvince = "Billing province is required";
    }
    if (!formData.billingBuilding) {
      errors.billingBuilding = "Billing building is required";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (!error) {
        const { id } = paymentMethod;
        const shoe = cart.products.map((item) => item);
        const response = await axios.post(
          "http://localhost:8000/payment/create-payment-intent",
          {
            amount: Math.round(cart.total * 100),
            id,
          }
        );

        if (response.statusText === "OK") {
          const userToUse =
            user && user.id ? user.id : "64b7ee9d66d578fe823fda55";
          //console.log("whats in my cart=>",cart.products)
          const res = await axios.post("http://localhost:8000/payment", {
            user: userToUse,
            amount: cart.total,
            paymentMethod: "card",
            paymentStatus: "completed",
            stripePaymentIntentId: id,
            shoe: shoe,
          });

          await axios.post("http://localhost:8000/order", {
            user: userToUse,
            totalPrice: cart.total,
            quantity: shoe.length,
            email: formData.email,
            deliveryAddress: formData.billingAddress,
            country: formData.billingCountry,
            city: formData.billingCity,
            province: formData.billingProvince,
            building: formData.billingBuilding,

            shoe: shoe,
            payment: res.data,
          });
          await axios.put("http://localhost:8000/shoe/decrement", {
            products: cart.products,
          });
          dispatch(clearCart());
          setSuccess(true);
          window.location.href = "/paymentSuccess";
        }
      } else {
        console.error(error.message);
      }

      setLoading(false);
    } catch (error) {
      console.log("error=>", error);
      setLoading(false);
    }
  };

  return (
    <>
      {!success ? (
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="email"
            className="mt-4 mb-2 block text-sm font-medium"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm  shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Email Address"
          />
          {validationErrors.email && (
            <p className="text-red-500">{validationErrors.email}</p>
          )}
          <label
            htmlFor="card-holder"
            className="mt-4 mb-2 block text-sm font-medium"
          >
            Card Holder
          </label>
          <input
            type="text"
            id="card-holder"
            value={formData.cardHolder}
            onChange={(e) =>
              setFormData({ ...formData, cardHolder: e.target.value })
            }
            className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm  shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Full-name"
          />
          {validationErrors.cardHolder && (
            <p className="text-red-500">{validationErrors.cardHolder}</p>
          )}

          <label
            htmlFor="billing-address"
            className="mt-4 mb-2 block text-sm font-medium"
          >
            Billing Address
          </label>
          <input
            type="text"
            id="billing-address"
            value={formData.billingAddress}
            onChange={(e) =>
              setFormData({ ...formData, billingAddress: e.target.value })
            }
            className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Street Address"
          />
          {validationErrors.billingAddress && (
            <p className="text-red-500">{validationErrors.billingAddress}</p>
          )}

          <div className="flex ">
            <div className="flex flex-col w-full ">
              <input
                type="text"
                id="billing-country"
                placeholder="Country"
                className="mt-1 w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                value={formData.billingCountry}
                onChange={(e) =>
                  setFormData({ ...formData, billingCountry: e.target.value })
                }
              />
              {validationErrors.billingCountry && (
                <p className="text-red-500">
                  {validationErrors.billingCountry}
                </p>
              )}
            </div>
            <div className="flex flex-col w-full">
              <input
                type="text"
                id="billing-city"
                placeholder="City"
                className="mt-1 w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                value={formData.billingCity}
                onChange={(e) =>
                  setFormData({ ...formData, billingCity: e.target.value })
                }
              />
              {validationErrors.billingCity && (
                <p className="text-red-500">{validationErrors.billingCity}</p>
              )}
            </div>
          </div>
          <div className="flex ">
            <div className="flex flex-col w-full">
              <input
                type="text"
                id="billing-province"
                placeholder="Province"
                className="mt-1 w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                value={formData.billingProvince}
                onChange={(e) =>
                  setFormData({ ...formData, billingProvince: e.target.value })
                }
              />
              {validationErrors.billingProvince && (
                <p className="text-red-500">
                  {validationErrors.billingProvince}
                </p>
              )}
            </div>
            <div className="flex flex-col w-full">
              <input
                type="text"
                id="billing-building"
                placeholder="Building"
                className="mt-1 w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                value={formData.billingBuilding}
                onChange={(e) =>
                  setFormData({ ...formData, billingBuilding: e.target.value })
                }
              />
              {validationErrors.billingBuilding && (
                <p className="text-red-500">
                  {validationErrors.billingBuilding}
                </p>
              )}
            </div>
          </div>

          <div className="FormRow mt-5 border-4 rounded p-2">
            <CardElement options={CARD_OPTIONS} />
          </div>
          <div className="mt-6 border-t border-b py-2 ">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Subtotal</p>
              <p className="font-semibold text-gray-900">{cart.total}$</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Shipping</p>
              <p className="font-semibold text-gray-900">$0.00</p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">Total</p>
            <p className="text-2xl font-semibold text-gray-900">
              {cart.total}$
            </p>
          </div>

          <button
            className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white"
            disabled={isLoading}
          >
            <div className={`loading-text ${isLoading ? "processing" : ""}`}>
              {isLoading ? "Processing" : "Pay"}
            </div>
          </button>
        </form>
      ) : (
        <div>
          <h2>Payment Success</h2>
        </div>
      )}
    </>
  );
};

export default PayButton;
