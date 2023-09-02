import { useSelector } from "react-redux";

import PayButton from "./PayButton";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const CheckOut = () => {
  const cart = useSelector((state) => state.user.cart);
  const PUBLIC_KEY =
    "pk_test_51NME2wBC4rKOPGa9VCeuiyDmgVZyJJmiaIIbUjnQ7gWDolvwWNlJXFaiQR07FKcdldGbbLGMA9CafzLyQKkxdk7V00Ow40ZIfp";

  const stripeTestPromise = loadStripe(PUBLIC_KEY);

  return (
    <div>
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32 my-10">
        <div className="px-4 pt-8">
          <p className="text-xl font-medium">Order Summary</p>
          <p className="text-gray-400">
            Check your items. And select a suitable shipping method.
          </p>
          <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
            {cart.products.map((product) => (
              <div
                key={product._id}
                className="flex flex-col rounded-lg bg-white sm:flex-row"
              >
                <img
                  className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                  src={product.productimg[0]}
                  alt=""
                />
                <div className="flex w-full flex-col px-4 py-4">
                  <span className="font-semibold">{product.name}</span>
                  <span className="float-right text-gray-400">
                    {product.size} - {product.color}
                  </span>
                  <p className="mt-auto text-lg font-normal">
                    Qty-{product.quantity}
                  </p>
                  <p className="mt-auto text-lg font-bold">{product.price}$</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 border-2 rounded-3xl bg-gray-50 px-4 pt-8 lg:mt-0">
          <p className="text-xl font-medium">Payment Details</p>
          <p className="text-gray-400">
            Complete your order by providing your payment details.
          </p>
          <div className="">
            <Elements stripe={stripeTestPromise}>
              <PayButton />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
