import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "flowbite-react";
import FooterComponent from "../../../components/footer/footer.jsx";
import Navbar from "../../../components/navbar/index.jsx";
import UrbanEliteDark from "../../../assets/urban-elite-darkmode.png";
import UrbanEliteLight from "../../../assets/urban-elite-lightmode.png";
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handlerUserLogin = async (e) => {
    e.preventDefault();
    try {
      const endpoints = [
        `${import.meta.env.VITE_REACT_APP_API_URL}/users/login`,
        `${import.meta.env.VITE_REACT_APP_API_URL}/admin/login`,
      ];

      let response;
      let userData;

      for (const endpoint of endpoints) {
        try {
          response = await axios.post(endpoint, {
            identifier,
            password,
          });

          if (response?.data?.user) {
            userData = response.data.user;
            break;
          } else if (response?.data?.admin) {
            userData = response.data.admin;
            break;
          }
        } catch (err) {}
      }
      if (!userData) {
        throw new Error("Invalid credentials");
      }
      const { token, username, role, _id: id } = userData;
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", id);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
      });
      navigate(role === "admin" ? "/admin-dashboard" : "/home");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred during login. Please try again later.";
      Swal.fire({
        icon: "error",
        title: "Login Error",
        text: errorMessage,
      });
    }
  };

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-5 min-h-screen">
        <div className="col-span-3 flex justify-center flex-col items-center">
          <img
            src={isDarkMode ? UrbanEliteDark : UrbanEliteLight}
            alt="Urban-Elite"
            className="w-1/2 h-1/2 object-cover"
          />
        </div>
        <div className="col-span-2 flex justify-center items-center">
          <div className="w-auto flex flex-col gap-10  p-8">
            <div className="flex flex-col gap-6 text-left">
              <h1 className="text-black text-3xl font-medium leading-loose tracking-wider dark:text-white">
                Login to Urban Elite
              </h1>
              <h5 className="text-black text-base font-normal leading-normal dark:text-white">
                Enter your details below
              </h5>
            </div>
            <form className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className=" text-black text-base font-normal leading-normal dark:text-white">
                  Email/Username
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-auto h-10 border-b border-black opacity-70 px-2 text-black"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className=" text-black text-base font-normal leading-normal dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                  className="w-auto h-10 border-b border-black opacity-70 px-2 text-black"
                  placeholder="Enter your password"
                />
              </div>
              <div className="flex flex-col justify-between items-center gap-5 w-96">
                <Button
                  type="submit"
                  color="dark"
                  onClick={handlerUserLogin}
                  className="px-2 rounded text-base leading-normal dark:text-white w-96 mt-10"
                >
                  Login
                </Button>
                <Link
                  to="/forget-password"
                  className="dark:text-blue-200 dark:hover:text-blue-400 text-base leading-normal w-96"
                >
                  Forget Password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default Login;
