import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Dropdown, Navbar } from "flowbite-react";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import Swal from "sweetalert2";
import DarkModeToggle from "../../theme/DarkModeToggle";
import axios from "axios";

const NavbarLogin = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const adminId = localStorage.getItem("adminId");
  const [isOpen, setIsOpen] = useState(false);
  const userRoleVariable = localStorage.getItem("role");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const searchBarRef = useRef(null);

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are You Sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/home");
        window.location.reload();
      }
    });
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
      setNotFound(true);
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
          <div className="flex items-center">
            <Link to="/home">
              <h1 className="text-black text-2xl font-bold tracking-wide dark:text-white lg:ml-16 2xl:-ml-20">
                Urban Elite
              </h1>
            </Link>
          </div>
          <div className="flex items-center space-x-4 ">
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
            <div className="lg:flex hidden space-x-4">
              <Button
                color="gray"
                className="w-10 h-10 rounded-full flex items-center justify-center"
                href="/cart"
              >
                <IoCartOutline className="w-5 h-5" />
              </Button>
              <Dropdown
                dismissOnClick={false}
                renderTrigger={() => (
                  <Button
                    color="gray"
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                  >
                    <CgProfile className="w-5 h-5" />
                  </Button>
                )}
              >
                {userRoleVariable === "admin" ? (
                  <Dropdown.Item href={`/profile/admin/${userId}`}>
                    Profile
                  </Dropdown.Item>
                ) : (
                  <Dropdown.Item href={`/profile/user/${userId}`}>
                    Profile
                  </Dropdown.Item>
                )}
                <Dropdown.Item>Earnings</Dropdown.Item>
                <Dropdown.Item>Settings</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Sign Out</Dropdown.Item>
              </Dropdown>
              <DarkModeToggle
                color="gray"
                className="w-9 h-9rounded-full flex items-center justify-center"
              />
            </div>
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
            <button to="#Cart">
              <h5 className="text-black text-base font-normal">Cart</h5>
            </button>
            <button to="#Profiles">
              <h5 className="text-black text-base font-normal">Profile</h5>
            </button>
            <button onClick={handleLogout}>
              <h5 className="text-black text-base font-normal">Logout</h5>
            </button>
          </div>
        )}
      </Navbar>
    </header>
  );
};

export default NavbarLogin;
