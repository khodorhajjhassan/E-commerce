import axios from "axios";
import { useState } from "react";

const ButtonRefund = ({
  order,
  orderid,
  updatedAt,
  RefundRequest,
  handleRefundStatus,
}) => {
  const [status, setStatus] = useState("");
  const [click, setClick] = useState(false);

  const handleClick = () => {
    setClick(!click);
    setStatus(order);
  };

  const handleRefund = async () => {
    try {
      const res = await axios.put(`http://localhost:8000/order/${orderid}`, {
        RefundRequest: "submitted",
      });
      console.log(res.data);
      handleRefundStatus(res.data);
      handleClick();
    } catch (error) {
      console.error(error);
    }
  };

  const isRefundable =
    RefundRequest === "Not submitted" &&
    new Date(updatedAt).getTime() > Date.now() - 2 * 24 * 60 * 60 * 1000 &&
    order === "delivered";

  const isRefundableSubmitted =
    RefundRequest === "submitted" && order === "delivered";

  const isRefundableAccepted =
    RefundRequest === "accepted" && order === "delivered";

  const isRefundableDeclined =
    RefundRequest === "declined" && order === "delivered";

  return (
    <div>
      {isRefundable && (
        <button
          onClick={handleClick}
          className="w-full flex font-bold rounded items-center md:p-4 p-3"
        >
          Refund order <img src="/trash.svg" className="md:w-8 w-6" alt="" />{" "}
        </button>
      )}
      {/* Refund Request: Submitted */}
      {isRefundableSubmitted && (
        <div>
          <p>Refund has been submitted for this order.</p>
        </div>
      )}

      {/* Refund Request: Accepted */}
      {isRefundableAccepted && (
        <div>
          <p>Refund request has been accepted for this order.</p>
        </div>
      )}

      {/* Refund Request: Declined */}
      {isRefundableDeclined && (
        <div>
          <p className="p-4">Refund request has been declined for this order.</p>
        </div>
      )}
      {/* Refund Request: Declined */}
      {order === "pending" && (
        <div className="p-4">
          <p>Upon Delivery you can Refund.</p>
        </div>
      )}
      <div
        className={`fixed top-0 left-0 flex justify-center items-center w-full h-screen bg-gray-500 bg-opacity-50 bordered opacity-0 z-50 duration-300 ${
          click ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="w-80 h-auto shadow-xl bg-white m-auto rounded p-4 text-center z-50 ">
          <h2 className="font-bold text-2xl italic text-gray-700 mb-5">
            Refund Products
          </h2>
          <div>
            {status !== "delivered" ? (
              <p className="font-bold italic text-red-500 mb-5">
                Sorry You cannot Refund this product until you deliver it
              </p>
            ) : (
              <div>
                <p className="font-bold italic text-green-500 mb-5">
                  You have only 48 hours to Refund this product
                </p>
                <p className="font-normal italic text-red-500 mb-5">
                  Are you sure you want to Refund?
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 justify-center">
            {status !== "delivered" ? (
              <div></div>
            ) : (
              <>
                <button
                  onClick={handleRefund}
                  className="border-2 bg-gray-700 text-white p-2 text-gray-500 rounded p-3 hover:bg-gray-900 duration-300"
                >
                  Submit
                </button>
                <button
                  onClick={() => setClick(!click)}
                  className="border-2 rounded bg-red-700 text-white p-3 text-gray-500 hover:bg-red-900 duration-300"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
        <div
          onClick={() => setClick(!click)}
          className="p-3 font-bold rounded border-2 text-white bg-gray-700 hover:bg-gray-900 duration-300 cursor-pointer absolute top-5 right-5"
        >
          X
        </div>
      </div>
    </div>
  );
};

export default ButtonRefund;
