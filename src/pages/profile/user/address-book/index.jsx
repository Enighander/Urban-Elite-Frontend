import axios from "axios";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import NavbarLogin from "../../../../components/navbar/login";
import SidebarProfile from "../../../../components/sidebar-profile";
import FooterComponent from "../../../../components/footer/footer";
import Error404 from "../../../../components/error/404";
import { Breadcrumb, Label, Button, TextInput, Spinner } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { useFormik } from "formik";
import Swal from "sweetalert2";

const validationSchema = Yup.object({
  recipient_name: Yup.string()
    .matches(
      /^[a-zA-Z ]+$/,
      "Recipient name can only contain alphabetic characters and spaces"
    )
    .required("Recipient Name is required"),
  postal_code: Yup.string()
    .matches(/^\d{5}$/, "Postal code should have exactly 5 digits")
    .required("Postal code is required"),
  city: Yup.string()
    .matches(
      /^[a-zA-Z ]+$/,
      "City can only contain alphabetic characters and spaces"
    )
    .required("City is required"),
  address: Yup.string().required("Address is required"),
  phone_number: Yup.string()
    .min(10, "Phone number should have a minimum of 10 digits")
    .max(12, "Phone number should have a maximum of 12 digits")
    .matches(/^[0-9]+$/, "Phone number should only contain digits")
    .required("Phone number is required"),
});

const AddressBook = () => {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      username: username,
      recipient_name: "",
      address: "",
      postal_code: "",
      city: "",
      phone_number: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await axios.put(
          `${
            import.meta.env.VITE_REACT_APP_API_URL
          }/address/username/${username}`,
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
          "An error occurred during the update. Please try again later.";
        Swal.fire({
          icon: "error",
          title: "Update Error",
          text: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_API_URL
          }/address/username/${username}`
        );
        if (response.data && response.data.address) {
          const {
            username,
            recipient_name,
            address,
            postal_code,
            city,
            phone_number,
          } = response.data.address;
          formik.setValues({
            username: username,
            recipient_name,
            address,
            postal_code,
            city,
            username,
            phone_number,
          });
        } else {
          setError("Unexpected response format");
        }
      } catch (error) {
        setError("Failed to fetch address data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserAddress();
  }, [username]);

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
        <NavbarLogin />
        <div className="p-4 my-10">
          <Error404 />
        </div>
        <FooterComponent />
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
          <Breadcrumb.Item href={`/profile/user/${userId}/address-book`}>
            Address Book
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
            <div className="bg-white dark:bg-[#1F2937] w-full h-auto border border-transparent rounded-2xl p-8 relative shadow-2xl">
              <h2 className="text-xl font-medium mb-8 text-left">
                Edit Your Address
              </h2>
              <form onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-2 gap-10 my-5">
                  <div className="flex flex-col">
                    <Label className="text-black text-base text-left font-normal mb-2">
                      Recipient Name
                    </Label> 
                    <TextInput
                      id="recipient_name"
                      type="text"
                      name="recipient_name"
                      placeholder="Enter your recipient name"
                      value={formik.values.recipient_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      color={formik.errors.recipient_name ? "failure" : "gray"}
                      helperText={
                        formik.errors.recipient_name &&
                        formik.touched.recipient_name
                          ? formik.errors.recipient_name
                          : null
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label className="text-black text-base text-left font-normal mb-2">
                      Address
                    </Label>
                    <TextInput
                      id="address"
                      type="text"
                      name="address"
                      placeholder="Enter your address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      color={formik.errors.address ? "failure" : "gray"}
                      helperText={
                        formik.errors.address && formik.touched.address
                          ? formik.errors.address
                          : null
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-10">
                  <div className="flex flex-col">
                    <Label className="text-black text-base text-left font-normal mb-2">
                      Postal Code
                    </Label>
                    <TextInput
                      id="postal_code"
                      type="text"
                      name="postal_code"
                      placeholder="Enter your postal code"
                      value={formik.values.postal_code}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      color={formik.errors.postal_code ? "failure" : "gray"}
                      helperText={
                        formik.errors.postal_code && formik.touched.postal_code
                          ? formik.errors.postal_code
                          : null
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label className="text-black text-base text-left font-normal mb-2">
                      City
                    </Label>
                    <TextInput
                      id="city"
                      type="text"
                      name="city"
                      placeholder="Enter your city"
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      color={formik.errors.city ? "failure" : "gray"}
                      helperText={
                        formik.errors.city && formik.touched.city
                          ? formik.errors.city
                          : null
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-10 my-5">
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
                  </div>
                </div>
                <div className="flex justify-end items-center gap-8 mt-8">
                  <Button
                    type="submit"
                    className="px-12 py-4 rounded text-base font-medium"
                    color="light"
                  >
                    {isLoading ? <Spinner /> : "Update Address"}
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

export default AddressBook;
