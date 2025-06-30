import Navbar from "../../components/Navbar";
import { TiSocialInstagram, TiSocialFacebook } from "react-icons/ti";
import background from "/background.jpg";

const Contact = () => {
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
            <h1 className="text-5xl md:text-6xl font-bold mb-8 uppercase">
              Get In Touch
            </h1>
            <p className="text-xl mb-12 leading-relaxed">
              Ready to book us for your event? Want to know more about our music? 
              We'd love to hear from you!
            </p>
            
            <div className="space-y-8">
              <div className="bg-black/50 p-8 rounded-2xl">
                <h2 className="text-3xl font-bold mb-4 text-orange-600">
                  Booking & Enquiries
                </h2>
                <p className="text-lg mb-6">
                  For booking enquiries and general questions, please reach out to us through our social media channels.
                </p>
                
                <div className="flex justify-center gap-8">
                  <a
                    href="https://www.instagram.com/lunarandthegrooveofficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-full hover:scale-105 transition-transform duration-200"
                    aria-label="Contact us on Instagram"
                  >
                    <TiSocialInstagram size={24} />
                    <span className="font-semibold">Instagram</span>
                  </a>
                  
                  <a
                    href="https://www.facebook.com/profile.php?id=61556593475887"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-blue-600 px-6 py-3 rounded-full hover:scale-105 transition-transform duration-200"
                    aria-label="Contact us on Facebook"
                  >
                    <TiSocialFacebook size={24} />
                    <span className="font-semibold">Facebook</span>
                  </a>
                </div>
              </div>
              
              <div className="bg-black/50 p-8 rounded-2xl">
                <h2 className="text-3xl font-bold mb-4 text-orange-600">
                  Performance Areas
                </h2>
                <p className="text-lg mb-4">
                  We perform across the Midlands and surrounding areas, including:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                  <div className="bg-orange-600/20 p-4 rounded-lg">
                    <h3 className="font-bold text-orange-400">Derby</h3>
                  </div>
                  <div className="bg-orange-600/20 p-4 rounded-lg">
                    <h3 className="font-bold text-orange-400">Nottingham</h3>
                  </div>
                  <div className="bg-orange-600/20 p-4 rounded-lg">
                    <h3 className="font-bold text-orange-400">Leicester</h3>
                  </div>
                  <div className="bg-orange-600/20 p-4 rounded-lg">
                    <h3 className="font-bold text-orange-400">Burton</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
