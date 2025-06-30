import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import background from "/background.jpg";

const Error = () => {
  return (
    <>
      <Navbar />
      <div className="bg-black/30 w-full absolute min-h-full">
        <img
          className="w-full h-full object-cover absolute z-[-100]"
          src={background}
          alt="background"
        />
        <div className="container mx-auto px-4 py-20 mt-16">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h1 className="text-8xl md:text-9xl font-bold mb-4 text-orange-600">
              404
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Oops! Page Not Found
            </h2>
            <p className="text-xl mb-12 leading-relaxed">
              Looks like this page got lost in the groove! 
              Don't worry, you can find your way back to the music.
            </p>
            
            <div className="space-y-6">
              <Link
                to="/"
                className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors duration-200"
              >
                Back to Home
              </Link>
              
              <div className="flex justify-center gap-6 mt-8">
                <Link
                  to="/about"
                  className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-200"
                >
                  Meet the Band
                </Link>
                <Link
                  to="/gigs"
                  className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-200"
                >
                  See Our Gigs
                </Link>
                <Link
                  to="/contact"
                  className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Error;
