import { FiMenu } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import { useState } from "react";
import { TiSocialInstagram, TiSocialFacebook } from "react-icons/ti";
import { Link } from "react-router-dom";
import { useScroll } from "../hooks/useScroll";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scrolling = useScroll(100);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav
      className={`flex justify-center items-center text-white m-auto left-1/2 translate-x-[-50%] h-14 p-4 z-20
      ${
        scrolling
          ? "fixed top-0 w-full bg-black opacity-90"
          : "w-[90%] fixed top-5"
      }
      ${isOpen ? "fixed top-0 w-full bg-black opacity-90" : null}
      `}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-center flex-grow">
        <ul
          className={`md:static absolute md:flex text-center gap-6 [&>li]:cursor-pointer font-medium top-10 max-md:p-3 text-xl
        ${isOpen ? "w-full bg-black opacity-90 gap-24" : "hidden gap-6"}
        ${
          scrolling
            ? "bg-black opacity-90 top-12 w-full justify-center"
            : "md:bg-transparent"
        }
        `}
        >
          <li>
            <Link 
              to="/"
              className={`${
                isOpen ? "mb-2" : ""
              } hover:text-orange-600 font-bold uppercase block`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/about"
              className={`${
                isOpen ? "mb-2" : ""
              } hover:text-orange-600 font-bold uppercase block`}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              to="/gigs"
              className={`${
                isOpen ? "mb-2" : ""
              } hover:text-orange-600 font-bold uppercase block`}
              onClick={() => setIsOpen(false)}
            >
              Gigs
            </Link>
          </li>
          <li>
            <Link 
              to="/contact"
              className={`${
                isOpen ? "mb-2" : ""
              } hover:text-orange-600 font-bold uppercase block`}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </li>
          <div className="flex gap-2 justify-center">
            <li>
              <a 
                href="https://www.instagram.com/lunarandthegrooveofficial"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="hover:text-orange-600 block"
              >
                <TiSocialInstagram size={30} />
              </a>
            </li>
            <li>
              <a 
                href="https://www.facebook.com/profile.php?id=61556593475887"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="hover:text-orange-600 block"
              >
                <TiSocialFacebook size={30} />
              </a>
            </li>
          </div>
        </ul>
      </div>
      <div className="md:hidden">
        <button 
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <GrClose size={30} /> : <FiMenu size={30} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
