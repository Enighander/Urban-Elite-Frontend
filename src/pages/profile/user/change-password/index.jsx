import axios from "axios";
import React, { useState } from "react";
import * as Yup from "yup";
import NavbarLogin from "../../../../components/navbar/login";
import SidebarProfile from "../../../../components/sidebar-profile";
import FooterComponent from "../../../../components/footer/footer";
import Error404 from "../../../../components/error/404";
import {
  Breadcrumb,
  Button,
  TextInput,
  Spinner,
  List,
  Label,
} from "flowbite-react";
import { HiHome, HiCheckCircle } from "react-icons/hi";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  oldPassword: Yup.string().required("Old password is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z\d])[a-z\d]{10,}$/,
      "Password must contain at least one alphanumeric character"
    )
    .min(10, "Password should have a minimum of 10 characters")
    .max(25, "Password should have a maximum of 25 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const ChangePassword = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // State for error handling
  const [user, setUser] = useState(null); // State for user data

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true); // Set loading state to true
      try {
        const response = await axios.put(
          `${
            import.meta.env.VITE_REACT_APP_API_URL
          }/users/${userId}/updatePassword`,
          values
        );
        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Change Password Successful",
          });
          localStorage.clear();
          navigate("/login");
        } else {
          Swal.fire({
            icon: "error",
            title: "Change Password Error",
            text: "Invalid response from server.",
          });
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred during password change. Please try again later.";
        Swal.fire({
          icon: "error",
          title: "Change Password Error",
          text: errorMessage,
        });
      } finally {
        setIsLoading(false); // Set loading state to false
      }
    },
  });

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner aria-label="Center-aligned spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Error404 />
      </div>
    );
  }

  return (
    <>
      <NavbarLogin />
      <div className="flex justify-between my-10 xl:ml-16 ">
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/home" icon={HiHome}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item href={`/profile/user/${userId}`}>
            My Profile
          </Breadcrumb.Item>
          <Breadcrumb.Item href={`/profile/user/${userId}/change-password`}>
            Change Password
          </Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="flex justify-end text-1xl xl:mr-16">
          Welcome, <span className="mx-2">{username}</span>
        </h1>
      </div>
      <div className="my-5">
          <div className="p-4 my-10 grid grid-cols-6 grid-rows-4">
            <SidebarProfile />
            <div className="col-span-3 row-span-4 col-start-3">
              <div className="w-full h-auto rounded p-8 relative border border-solid border-opacity-50 shadow-2xl">
                <h2 className=" text-xl font-medium mb-8 text-left">
                  Change Your Password
                </h2>
                <form onSubmit={formik.handleSubmit}>
                  <div className="grid grid-rows-1 gap-6">
                    <div className="flex flex-col gap-6">
                      <Label className="text-black text-base text-left font-normal mb-2">
                        Old Password
                      </Label>
                      <TextInput
                        id="oldPassword"
                        type="password"
                        name="oldPassword"
                        placeholder="Enter your old password"
                        value={formik.values.oldPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        color={formik.errors.oldPassword ? "failure" : "gray"}
                        helperText={
                          formik.errors.oldPassword &&
                          formik.touched.oldPassword
                            ? formik.errors.oldPassword
                            : null
                        }
                      />
                      <Label className="text-black text-base text-left font-normal mb-2">
                        New Password
                      </Label>
                      <TextInput
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Enter your new password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        color={formik.errors.password ? "failure" : "gray"}
                        helperText={
                          formik.errors.password && formik.touched.password
                            ? formik.errors.password
                            : null
                        }
                      />
                      <Label className="text-black text-base text-left font-normal mb-2">
                        Confirm Password
                      </Label>
                      <TextInput
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your new password"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        color={
                          formik.errors.confirmPassword ? "failure" : "gray"
                        }
                        helperText={
                          formik.errors.confirmPassword &&
                          formik.touched.confirmPassword
                            ? formik.errors.confirmPassword
                            : null
                        }
                      />
                      <List className="text-left text-sm my-3">
                        <List.Item icon={HiCheckCircle}>
                          Password must contain at least Alphanumberic at least
                          one
                        </List.Item>
                        <List.Item icon={HiCheckCircle}>
                          Password should have a minimum of 10 characters
                        </List.Item>
                      </List>
                    </div>
                  </div>
                  <div className="flex justify-end items-center gap-8 mt-8">
                    <Button
                      type="submit"
                      className="px-12 py-4 rounded text-base font-medium"
                      color="light"
                    >
                      {isLoading ? <Spinner /> : "Change Password"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      <FooterComponent />
    </>
  );
};

export default ChangePassword;
