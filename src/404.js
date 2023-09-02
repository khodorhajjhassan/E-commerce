import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <>
      <section className="page_404 bg-white py-10 font-serif">
        <div className="container mx-auto flex justify-center">
          <div className="w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-4/12 text-center">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <div className="w-full">
              <iframe
                src="/giphy.gif"
                title="gif"
                width="480"
                height="480"
                frameBorder="0"
                className="giphy-embed"
                allowFullScreen
              ></iframe>
            </div>
            <div className="contant_box_404 mt-8">
              <h6 className="text-4xl font-bold">Look like you're lost</h6>
              <p className="text-lg mt-3">
                The page you are looking for is not available!
              </p>
              <Link
                to="/"
                className="link_404 inline-block py-2 px-4 text-white rounded mt-6"
                style={{ backgroundColor: "#f3676e" }}
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
