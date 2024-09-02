import axios from "axios";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import NavbarLogin from "../../../components/navbar/login/index.jsx";
import SidebarProfile from "../../../components/sidebar-profile/index.jsx";
import FooterComponent from "../../../components/footer/footer.jsx";
import Error404 from "../../../components/error/404";
import {
  Breadcrumb,
  Button,
  Label,
  TextInput,
  Spinner,
  List,
} from "flowbite-react";
import { HiHome, HiCheckCircle } from "react-icons/hi";
import { useFormik } from "formik";
import Swal from "sweetalert2";

const validationSchema = Yup.object({
  username: Yup.string()
    .min(6, "Username should have a minimum of 6 characters")
    .max(30, "Username should have a maximum of 30 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  full_name: Yup.string().matches(
    /^[a-zA-Z ]+$/,
    "Fullname can only contain alphabetic characters and spaces"
  ),
  phone_number: Yup.string()
    .min(10, "Phone number should have a minimum of 10 digits")
    .max(12, "Phone number should have a maximum of 12 digits")
    .matches(/^[0-9]+$/, "Phone number should only contain digits")
    .required("Phone number is required"),
  date_of_birth: Yup.date(),
});

const UserProfile = () => {
  const userId = localStorage.getItem("userId");
  const usernameLocal = localStorage.getItem("username");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/users/${userId}`
        );
        if (response.data && response.data.user) {
          const { username, email, full_name, phone_number, date_of_birth } =
            response.data.user;
          formik.setValues({
            username,
            email,
            full_name,
            phone_number,
            date_of_birth,
          });
        } else {
          setError("Unexpected response format");
        }
      } catch (error) {
        setError("failed to fetch user data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const formik = useFormik({
    initialValues: {
      username: usernameLocal,
      email: "",
      full_name: "",
      phone_number: "",
      date_of_birth: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await axios.put(
          `${
            import.meta.env.VITE_REACT_APP_API_URL
          }/users/${userId}/updateUser`,
          values
        );
        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Update Successful",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: "Unexpected response from server.",
          });
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred during update user. Please try again later.";
        Swal.fire({
          icon: "error",
          title: "Update User Error",
          text: errorMessage,
        });
      } finally {
        setIsLoading(false);
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
      <div className="flex justify-between my-10 xl:ml-16">
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/home" icon={HiHome}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item href={`/profile/user/${userId}`}>
            My Profile
          </Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="flex justify-end text-1xl xl:mr-16">
          Welcome, <span className="mx-2">{usernameLocal}</span>
        </h1>
      </div>
      <div className="my-5">
        <div>
          <div className="p-4 my-10 grid grid-cols-6 grid-rows-4">
            <SidebarProfile />
            <div className="col-span-3 row-span-4 col-start-3 ">
              <div className=" bg-white dark:bg-gray-900 w-full h-auto rounded  p-8 relative border border-solid  border-opacity-50 shadow-2xl">
                <h2 className="text-xl font-medium mb-8 text-left">
                  Edit Your Profile
                </h2>
                <form onSubmit={formik.handleSubmit}>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="flex flex-col">
                      <Label className="text-black text-base text-left font-normal mb-2">
                        Username
                      </Label>
                      <TextInput
                        id="username"
                        type="text"
                        name="username"
                        value={formik.values.username}
                        className="w-52"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mt-6">
                    <div className="flex flex-col">
                      <Label className="text-black text-base text-left font-normal mb-2">
                        Full Name
                      </Label>
                      <TextInput
                        id="full_name"
                        type="text"
                        name="full_name"
                        placeholder="Enter your full name"
                        value={formik.values.full_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        color={formik.errors.full_name ? "failure" : "gray"}
                        helperText={
                          formik.errors.full_name && formik.touched.full_name
                            ? formik.errors.full_name
                            : null
                        }
                      />
                      <List className="text-left text-sm my-3">
                        <List.Item icon={HiCheckCircle}>
                          Fullname can only contain alphabetic characters and
                          spaces
                        </List.Item>
                      </List>
                    </div>
                    <div className="flex flex-col">
                      <Label className="text-black text-base text-left font-normal mb-2">
                        Email
                      </Label>
                      <TextInput
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        color={formik.errors.email ? "failure" : "gray"}
                        helperText={
                          formik.errors.email && formik.touched.email
                            ? formik.errors.email
                            : null
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mt-6">
                  <div className="flex flex-col">
                      <Label className="text-black text-base text-left font-normal mb-2">
                        Date of Birth
                      </Label>
                      <TextInput
                        id="date_of_birth"
                        type="date"
                        name="date_of_birth"
                        placeholder="Enter your date of birth"
                        value={formik.values.date_of_birth}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        color={formik.errors.date_of_birth ? "failure" : "gray"}
                        helperText={
                          formik.errors.date_of_birth &&
                          formik.touched.date_of_birth
                            ? formik.errors.date_of_birth
                            : null
                        }
                      />
                    </div>
                    <div className="flex flex-col">
                      <Label className="text-black text-base text-left font-normal mb-2">
                        Phone Number
                      </Label>
                      <TextInput
                        id="phone_number"
                        type="text"
                        name="phone_number"
                        placeholder="Enter your phone number"
                        value={formik.values.phone_number}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        color={formik.errors.phone_number ? "failure" : "gray"}
                        helperText={
                          formik.errors.phone_number &&
                          formik.touched.phone_number
                            ? formik.errors.phone_number
                            : null
                        }
                      />
                      <List className="text-left text-sm my-3">
                        <List.Item icon={HiCheckCircle}>
                          Phone number should have a minimum of 10 to 12 digits
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
                      {isLoading ? <Spinner /> : "Update Profile"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default UserProfile;
