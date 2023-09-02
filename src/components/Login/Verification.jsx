const Verification = () => {
  return (
    <div className="flex flex-col justify-center items-center content-center">
      <div className="p-3 flex flex-col justify-center items-center content-center m-4 sm:m-8 md:m-12 lg:m-24 bg-gray-100 rounded shadow-lg w-auto h-auto max-w-3xl">
        <div className="animate-pulse rounded-full bg-green-400 p-3 m-2">
          <img
            src="./mail.svg"
            className="w-10 h-10 text-white"
            alt="Mail Icon"
          />
        </div>
        <h1 className="text-3xl font-bold m-2">Please verify your email</h1>
        <div className="m-4">
          <p>you're almost there! We sent an email</p>
          <center>
            <p className="text-xl font-bold"></p>
          </center>
        </div>
        <p className="m-4 sm:m-6 lg:m-4">
          Just click on the link in that email to complete your signup.
          <br />
          If you don't see it, you may need to <b>check your spam</b> folder.
        </p>
        <p className="m-4 sm:m-6 lg:m-4">
          Still can't find the email? No problem.
        </p>
        <button className="text-lg rounded p-3 m-4 sm:m-6 lg:m-4 text-gray-50 bg-gray-900  shadow-xl animate-pulse1  hover:bg-indigo-600">
          <span className="font-didact-gothic">Resend Verification Email</span>
        </button>
      </div>
    </div>
  );
};

export default Verification;
