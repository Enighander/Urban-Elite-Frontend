import React, { useEffect, useState } from "react";
import Navbar from "../../../components/navbar";
import FooterComponent from "../../../components/footer/footer";
import { Button } from "flowbite-react";
import UrbanEliteDark from "../../../assets/urban-elite-darkmode.png";
import UrbanEliteLight from "../../../assets/urban-elite-lightmode.png";
import axios from "axios";
import Swal from "sweetalert2";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlerForgetPassword = async (e) => {
    e.preventDefault();
    if (email !== confirmEmail) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Email do not match.",
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP_API_URL}/users/forgot-password`,
        { email }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Password Reset",
          text: "If your email is registered, a new password will be sent to it.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Invalid response from server.",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred during password change. Please try again later.";
      Swal.fire({
        icon: "error",
        title: "Sending password Error",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
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
                Forgot Password
              </h1>
              <h5 className="text-black text-base font-normal leading-normal dark:text-white">
                Enter your details below
              </h5>
            </div>
            <form
              onSubmit={handlerForgetPassword}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <label className=" text-black text-base font-normal leading-normal dark:text-white">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-auto h-10 border-b border-black opacity-70 px-2 text-black"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className=" text-black text-base font-normal leading-normal dark:text-white">
                  Confirm Email
                </label>
                <input
                  id="confirmEmail"
                  type="email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  className="w-auto h-10 border-b border-black opacity-70 px-2 text-black"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex flex-col justify-between items-center gap-5 w-96">
                <Button
                  type="submit"
                  color="dark"
                  disabled={isLoading}
                  className="px-2 rounded text-base leading-normal dark:text-white w-96 mt-10"
                >
                  {isLoading ? "Sending..." : "Submit"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default ForgetPassword;
