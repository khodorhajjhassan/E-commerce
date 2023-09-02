import axios from "axios";
import React, { useEffect, useState } from "react";

const ButtonRate = ({ userId, orderId, shoeId }) => {
  const [click, setClick] = useState(false);
  const [rate, setRate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  const handleRate = async () => {
    const Rate = {
      user: userId,
      order: orderId,
      shoe: shoeId,
      rating: rate,
    };
    try {
      const res = await axios.post(
        "http://localhost:8000/feedback/check",
        Rate
      );
      if (res.status === 201 || res.status === 204) {
        setIsLoading(false);
        setClick(false);
        setHasRated(true);
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/feedback/feedback/${userId}/${orderId}`
        );
        if (res.data) {
          setHasRated(true);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserRating();
  }, [userId, orderId]);

  return (
    <div className="">
      <div>
        {hasRated ? (
          <div>
            <button className="font-didact-gothic text-xl rounded bg-green-700 duration-300 font-bold text-white p-3 cursor-pointer">
              Thank you for rating
            </button>
          </div>
        ) : (
          <button
            onClick={() => setClick(!click)}
            className="font-didact-gothic text-lg rounded bg-gray-700 duration-300 font-bold hover:bg-gray-900 text-white p-3 cursor-pointer"
            disabled={click}
          >
            Rate the product
          </button>
        )}
      </div>
      <div
        className={`fixed top-0 left-0 flex justify-center items-center w-full h-screen bg-gray-500 bg-opacity-50 bordered opacity-0 z-50 duration-300 ${
          click ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="w-80 h-60 shadow-xl bg-white m-auto rounded p-4 text-center z-50 ">
          <h2 className="font-bold text-2xl italic text-gray-700 mb-10">
            Rate the Product
          </h2>
          <ul className="flex items-center justify-center mb-10">
            {[1, 2, 3, 4, 5].map((starValue) => (
              <li key={starValue} value={starValue} className="cursor-pointer">
                <img
                  src={rate >= starValue ? "/staryellow.svg" : "/star.svg"}
                  className="w-8 cursor-pointer"
                  alt=""
                  onClick={() => setRate(starValue)}
                />
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4 justify-center">
            <button
              onClick={handleRate}
              className="border-2 bg-gray-700 text-white p-2 text-gray-500 rounded p-3 hover:bg-gray-900 duration-300"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
            <button
              onClick={() => setClick(!click)}
              className="border-2 rounded bg-red-700 text-white p-3 text-gray-500 hover:bg-red-900 duration-300"
            >
              Cancel
            </button>
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

export default ButtonRate;
