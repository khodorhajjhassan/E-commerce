import axios from "axios";
import { useState } from "react";

const Track = () => {
  const [track, setTrack] = useState();
  const [order, setOrder] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const getTrack = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/order/${order}`);

        setTrack(res.data);
        //console.log(res)

        //console.log(res);
      } catch (err) {
        setTrack(null);
      }
    };
    getTrack();
  };
  const convertToDate = (dateString) => {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1; // Months are 0-indexed, so we add 1 to get the correct month.
    const day = dateObject.getDate();
    return `${year}-${month < 10 ? "0" : ""}${month}-${
      day < 10 ? "0" : ""
    }${day}`;
  };

  return (
    <div>
      <div className="bg-gray-200 w-full h-full">
        <div className="w-11/12 m-auto pt-10">
          <div className="bg-white p-4 flex md:flex-row flex-col  gap-4 items-center rounded-xl shadow-xl">
            <h1 className="font-didact-gothic font-bold md:text-xl text-md ">
              Enter Your Order Id :
            </h1>

            <input
              className="border-2 rounded p-1 my-2 "
              type="text"
              onChange={(e) => setOrder(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Search
            </button>
          </div>
        </div>

        <div className="continer1 p-8 sm:p-16 ">
          {track ? (
            <div className="bg-white rounded-xl shadow-xl">
              <div>
                <div
                  className="w-full md:flex block p-8 justify-between items-center"
                  key={track._id}
                >
                  <div className="">
                    <p className="font-bold mb-4">
                      ORDER #<b className="text-blue-400">{track._id}</b>
                    </p>
                  </div>
                  <div>
                    <p className="font-bold">
                      Status :
                      <b className="text-blue-400">{track.orderStatus}</b>
                    </p>
                  </div>
                </div>

                <div
                  className="
          px-12 py-12 flex flex-col items-center  justify-center
          sm:flex-row
          "
                >
                  <div className="relative">
                    <div
                      className="
            c1 shadow-md w-16 h-16 bg-green-400 rounded-full
            flex justify-center items-center
            "
                    >
                      <img className="w-10 h-10  " src="/dollar.svg" alt="" />
                    </div>
                    <p className="absolute md:top-20 top-5  ml-20 sm:ml-auto font-bold ">
                      Payment
                    </p>
                  </div>
                  <div
                    className={`
            l1 w-2 h-10 ${
              track.orderStatus === "progress" ||
              track.orderStatus === "shipped" ||
              track.orderStatus === "delivered"
                ? "bg-green-400"
                : "bg-gray-400"
            } shadow-md
            sm:w-20 sm:h-2
            `}
                  ></div>
                  <div className="relative">
                    <div
                      className={`c2 shadow-md w-16 h-16 ${
                        track.orderStatus === "progress" ||
                        track.orderStatus === "shipped" ||
                        track.orderStatus === "delivered"
                          ? "bg-green-400"
                          : "bg-gray-400"
                      }  rounded-full flex justify-center items-center `}
                    >
                      <img className="w-10 h-10  " src="/box.svg" alt="" />
                    </div>
                    <p className="absolute md:top-20 top-5  ml-20 sm:ml-auto font-bold ">
                      Package
                    </p>
                  </div>
                  <div
                    className={`l2 w-2 h-10 ${
                      track.orderStatus === "shipped" ||
                      track.orderStatus === "delivered"
                        ? "bg-green-400"
                        : "bg-gray-400"
                    } shadow-md
            sm:w-20 sm:h-2`}
                  ></div>
                  <div className="relative">
                    <div
                      className={`c1 shadow-md w-14 h-14 ${
                        track.orderStatus === "shipped" ||
                        track.orderStatus === "delivered"
                          ? "bg-green-400"
                          : "bg-gray-400"
                      } rounded-full flex justify-center items-center `}
                    >
                      <img className="w-10 h-10  " src="/delivery.svg" alt="" />
                    </div>
                    <p className="absolute md:top-20 top-5  ml-20 sm:ml-auto font-bold ">
                      Delivery
                    </p>
                  </div>
                  <div
                    className={`l3  w-2 h-10 ${
                      track.orderStatus === "delivered"
                        ? "bg-green-400"
                        : "bg-gray-400"
                    } shadow-md
            sm:w-20 sm:h-2`}
                  ></div>
                  <div className="relative">
                    <div
                      className={`c1 shadow-md w-14 h-14  ${
                        track.orderStatus === "delivered"
                          ? "bg-green-400"
                          : "bg-gray-400"
                      } rounded-full flex justify-center items-center `}
                    >
                      <img className="w-10 h-10  " src="/arrived.svg" alt="" />
                    </div>
                    <p className="absolute md:top-20 top-5  ml-20 sm:ml-auto font-bold  ">
                      Arrival
                    </p>
                  </div>
                </div>
                <div className="bg-white mt-10 P-16 rounded-xl shadow-xl">
                  <div className="px-16 py-5 border-b">
                    <div className="mb-2">
                      <p className="font-bold">
                        Order placed on:
                        <span className="font-normal">
                          <b className="text-blue-400  ">
                            {" "}
                            {convertToDate(track.createdAt)}
                          </b>
                        </span>
                      </p>
                    </div>

                    <div>
                      <p className="font-bold">
                        Last Update Date:
                        <span className="font-normal">
                          <b className="text-blue-400 ">{" "}{convertToDate(track.updatedAt)}</b>
                          
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="flex font-didact-gothic justify-center text-2xl items-center font-bold text-red-500 mt-4">
              Order not found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Track;
