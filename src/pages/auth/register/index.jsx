import React from "react";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import Navbar from "../../../components/navbar/index.jsx";
import UrbanEliteLight from "../../../assets/urban-elite-lightmode.png";
import FooterComponent from "../../../components/footer/footer.jsx";
import { Button, List } from "flowbite-react";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineXMark } from "react-icons/hi2";
import Swal from "sweetalert2";

const validationSchema = Yup.object({
  username: Yup.string()
    .min(6, "Username should have a minimum of 6 characters")
    .max(30, "Username was more than 30 characters")
    .matches(
      /^[a-zA-Z0-9]+$/,
      "username can only contain alphanumeric characters"
    )
    .required("Username is required"),
  email: Yup.string()
    .email("Please enter a correct email format")
    .required("Email is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z\d])[a-z\d]{10,}$/,
      "Password must contain at least Alphanumeric at least one"
    )
    .min(10, "Password should have a minimum of 10 characters")
    .max(25, "Password should have a maximum of 25 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_URL}/users/register`,
          values
        );

        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Register Successful",
          });
          navigate("/login");
        } else {
          Swal.fire({
            icon: "error",
            title: "Register Error",
            text: "Invalid response from server.",
          });
        }
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
    },
  });

  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-5 min-h-screen ">
        <div className="col-span-3 flex justify-center flex-col items-center">
          <img
            src={UrbanEliteLight}
            alt="urban-elite"
            className="w-1/2 h-1/2 object-cover"
          />
        </div>
        <div className="col-span-2 flex justify-center items-center">
          <div className="w-auto flex flex-col gap-10 p-8">
            <div className="flex flex-col gap-6 text-left">
              <h1 className="text-black text-3xl font-medium leading-loose tracking-wider dark:text-white">
                Register to Urban Elite
              </h1>
              <h5 className="text-black text-base font-normal leading-normal dark:text-white">
                Enter your details below
              </h5>
            </div>
            <form
              className="flex flex-col gap-6"
              onSubmit={formik.handleSubmit}
            >
              <div className="flex flex-col gap-2">
                <label className="text-black text-base font-normal leading-normal dark:text-white">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-auto h-10 border-b border-black opacity-50 px-2 text-black"
                  placeholder="Enter your username"
                />
                {formik.touched.username && formik.errors.username ? (
                    <List className="text-left text-sm my-3 text-red-500">
                      <List.Item icon={HiOutlineXMark}>
                        {formik.errors.username}
                      </List.Item>
                    </List>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-black text-base font-normal leading-normal dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-auto h-10 border-b border-black opacity-50 px-2 text-black"
                  placeholder="Enter your email"
                />
                {formik.touched.email && formik.errors.email ? (
                  <List className="text-left text-sm my-3 text-red-500">
                      <List.Item icon={HiOutlineXMark}>
                        {formik.errors.email}
                      </List.Item>
                    </List>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-black text-base font-normal leading-normal dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-auto h-10 border-b border-black opacity-50 px-2 text-black"
                  placeholder="Enter your password"
                />
                {formik.touched.password && formik.errors.password ? (
                   <List className="text-left text-sm my-3 text-red-500">
                   <List.Item icon={HiOutlineXMark}>
                     {formik.errors.password}
                   </List.Item>
                 </List>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-black text-base font-normal leading-normal dark:text-white">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="w-auto h-10 border-b border-black opacity-50 px-2 text-black"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your password"
                />
                {formik.touched.confirmPassword &&
                formik.errors.confirmPassword ? (
                  <List className="text-left text-sm my-3 text-red-500">
                  <List.Item icon={HiOutlineXMark}>
                    {formik.errors.confirmPassword}
                  </List.Item>
                </List>
                ) : null}
              </div>
              <div className="flex justify-center items-center">
                <Button
                  type="submit"
                  color="dark"
                  className="px-2 rounded text-neutral-50 text-base leading-normal w-96"
                >
                  Create Account
                </Button>
              </div>
              <div className="flex justify-center items-center">
                <Button
                  color="dark"
                  className="px-2 rounded text-neutral-50 text-base leading-normal w-96"
                >
                  <FcGoogle className="w-5 h-5 mx-5" />
                  Sign Up with Google
                </Button>
              </div>
              <div className="flex justify-center items-center">
                <h5> Already Have an account?</h5>
                <Link className="m-3 underline" to="/login">
                  Log in
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

export default Register;
