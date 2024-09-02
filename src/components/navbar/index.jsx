import React, { useState } from "react";
import { Navbar, Button } from "flowbite-react";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import DarkModeToggle from "../theme/DarkModeToggle.jsx";

const NavbarComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header>
      <Navbar className="w-full p-5 bg-white shadow">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center xl:ml-16 lg:-ml-34">
            <Link to="/home">
              <h1 className="text-black text-2xl font-bold tracking-wide dark:text-white">
                Urban Elite
              </h1>
            </Link>
            <div className="xl:ml-10 hidden lg:flex flex-wrap space-x-8">
              <Button color="gray">
                <Link
                  to="/register"
                  className="text-black text-base font-normal dark:text-white"
                >
                  Sign Up
                </Link>
              </Button>
              <Button color="white">
                <Link
                  to="/login"
                  className="text-black text-base font-normal dark:text-white"
                >
                  Login
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center xl:ml-16 lg:-ml-34">
            <div className="flex relative space-x-2">
              <input
                type="text"
                className="pl-5 pr-3 py-1.5 bg-neutral-100 rounded-full text-xs font-normal text-black placeholder-opacity-50 w-96"
                placeholder="What are you looking for?"
              />
              <Button
                color="light"
                className="w-10 h-10 rounded-full flex items-center justify-center"
                onClick={``}
              >
                <IoSearchOutline className="w-5 h-5 " />
              </Button>
            </div>
            <div className="flex space-x-4">
              <Button
                color="gray"
                className="w-10 h-10 rounded-full flex items-center justify-center"
                to={``}
              >
                <IoCartOutline className="w-5 h-5" />
              </Button>
              <DarkModeToggle
                color="light"
                className="w-9 h-9rounded-full flex items-center justify-center"
              />
              <button className="lg:hidden" onClick={toggleDropDown}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="lg:hidden mt-4 flex flex-col space-y-2">
            <button>
              <a href="#SignUp" className="text-black text-base font-normal">
                Sign Up
              </a>
            </button>
            <button>
              <a href="#Login" className="text-black text-base font-normal">
                Login
              </a>
            </button>
          </div>
        )}
      </Navbar>
    </header>
  );
};

export default NavbarComponent;
