import axios from "axios";
import React, { useState } from "react";

const EditStatus = ({ orderId }) => {
  const [id, setId] = useState("");
  const [click, setClick] = useState(false);
  const [status, setStatus] = useState("");

  const openModel = () => {
    setId(orderId);
    setClick(!click);
  };

  const changeStatus = async () => {
    const SelectStatus = {
      orderStatus: status,
    };
    try {
      const res = await axios.put(
        `http://localhost:8000/order/${id}`,
        SelectStatus
      );
      setClick(false);
      setStatus(res.data.orderStatus);
      console.log("Update status success", res.data.orderStatus);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button
        onClick={openModel}
        className=" duration-300 text-indigo-600 hover:text-indigo-900"
      >
        Edit Status
      </button>
      <div
        className={`fixed top-0 left-0 flex justify-center items-center w-full h-screen bg-gray-500 bg-opacity-50 bordered opacity-0 z-50 duration-300 ${
          click ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="w-80 h-60 shadow-xl bg-white m-auto rounded p-4 text-center z-50 ">
          <h2 className="font-bold text-2xl italic text-gray-700 mb-10">
            Change Delivery Status
          </h2>
          <div className="mb-10">
            <select
              name=""
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border-2 w-full p-2"
              id=""
            >
              <option value="" disabled selected>
                Select Status
              </option>
              <option value="pending" disabled>
                Pending
              </option>
              <option value="progress">in Progress</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
          <div className="flex items-center gap-4 justify-center">
            <button
              onClick={changeStatus}
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

export default EditStatus;
