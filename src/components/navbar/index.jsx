import React, { useState, useRef, useEffect } from "react";
import { Navbar, Button } from "flowbite-react";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import DarkModeToggle from "../theme/DarkModeToggle.jsx";
import axios from "axios";

const NavbarComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const searchBarRef = useRef(null);

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchBar = async () => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/products/search`,
        {
          params: { name: query },
        }
      );
      const results = response.data.results;
      setSearchResults(results);
      setNotFound(results.length === 0);
    } catch (error) {
      console.error("Error fetching search items:", error);
      setNotFound(true)
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
        setSearchResults([]);
        setNotFound(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            <div className="xl:ml-10 hidden lg:flex space-x-8">
              <Button color="gray">
                <Link
                  to="/register"
                  className="text-black text-base dark:text-white"
                >
                  Sign Up
                </Link>
              </Button>
              <Button color="white">
                <Link
                  to="/login"
                  className="text-black text-base dark:text-white"
                >
                  Login
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center xl:ml-16 lg:-ml-34 relative">
            <div className="flex relative space-x-2" ref={searchBarRef}>
              <input
                type="text"
                className="pl-5 pr-3 py-1.5 bg-neutral-100 rounded-full text-sm font-normal text-black placeholder-opacity-50 w-96"
                placeholder="What are you looking for?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchBar()}
              />
              <div className="absolute top-10 left-0 bg-white shadow-2xl rounded-lg w-full z-10 dark:text-black">
                {searchResults.slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    className="p-2 border-b border-gray-200 text-sm text-left"
                  >
                    <Link
                      to={`/products/details/${item._id}`}
                      className="block hover:bg-gray-100 px-4 py-2"
                    >
                      {item.name}
                    </Link>
                  </div>
                ))}
                {notFound && (
                  <div className="p-2 text-sm text-gray-500 absolute bg-white shadow-2xl mt-2 w-full">
                    Not Found
                  </div>
                )}
                {searchResults.length > 0 && (
                  <div className="p-2 text-center">
                    <Link
                      to="/search-results"
                      className="text-blue-500 hover:underline"
                    >
                      See more
                    </Link>
                  </div>
                )}
              </div>
              <Button
                color="light"
                className="w-10 h-10 rounded-full flex items-center justify-center"
                onClick={handleSearchBar}
              >
                <IoSearchOutline className="w-5 h-5 " />
              </Button>
            </div>
            <Button
              color="gray"
              className="w-10 h-10 rounded-full flex items-center justify-center"
            >
              <IoCartOutline className="w-5 h-5" />
            </Button>
            <DarkModeToggle className="w-9 h-9 rounded-full flex items-center justify-center" />
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
        {isOpen && (
          <div className="lg:hidden mt-4 flex flex-col space-y-2">
            <Link to="/register" className="text-black text-base font-normal">
              Sign Up
            </Link>
            <Link to="/login" className="text-black text-base font-normal">
              Login
            </Link>
          </div>
        )}
      </Navbar>
    </header>
  );
};

export default NavbarComponent;
