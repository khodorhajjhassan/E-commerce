export const PaymentSuccess = () => {
  const handleEmailButtonClick = () => {
    window.location.href = "https://mail.google.com/"; // Replace with the desired URL
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <img className="mt-10 w-32" src="/ok.svg" alt="" />
      <h2 className="mt-2 text-bold font-didact-gothic text-lg md:text-3xl">
        Transcation Completed Successfully
      </h2>
      <p className="mt-2 font-didact-gothic text-bold text-lg">
        Thank you for your billing
      </p>

      <button
        onClick={handleEmailButtonClick}
        className="mt-10 flex p-3 border-2 bg-green-500 rounded mt-1 hover:bg-green-600"
      >
        <img
          width="25"
          className="mt-0"
          height="25"
          src="https://img.icons8.com/ios/50/000000/reply-arrow--v1.png"
          alt="reply-arrow--v1"
        />
        We just Mailed Your Order
      </button>
    </div>
  );
};
