import React, { useEffect, useState } from "react";
import NavbarLogin from "../../components/navbar/login";
import FooterComponent from "../../components/footer/footer";
import Swal from "sweetalert2";
import {
  Breadcrumb,
  Button,
  Label,
  TextInput,
  Spinner,
  Checkbox,
  Modal,
} from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { CiLock } from "react-icons/ci";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

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

const Order = () => {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const [address, setAddress] = useState(null);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModalAddress, setOpenModalAddress] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/cart/${userId}`
        );
        if (Array.isArray(response.data.cart)) {
          setCart(response.data.cart);
        } else {
          console.error("Invalid cart data:", response.data.cart);
          setCart([]);
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        setError("Failed to load cart data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, [userId]);

  const handleCheckChange = (e) => {
    setIsChecked(e.target.checked);
  };

  useEffect(() => {
    if (isChecked) {
      const fetchUserAddress = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_REACT_APP_API_URL
            }/address/username/${username}`
          );
          if (response.data && response.data.address) {
            formik.setFieldValue(
              "recipient_name",
              response.data.address.recipient_name || ""
            );
            formik.setFieldValue(
              "postal_code",
              response.data.address.postal_code || ""
            );
            formik.setFieldValue("city", response.data.address.city || "");
            formik.setFieldValue(
              "address",
              response.data.address.address || ""
            );
            formik.setFieldValue(
              "phone_number",
              response.data.address.phone_number || ""
            );
          } else {
            console.error("Invalid address data:", response.data.address);
            setAddress(null);
          }
        } catch (error) {
          console.error("Failed to fetch address data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      // Panggil fetch address
      fetchUserAddress();
    }
  }, [isChecked, username]);

  const formikChangeAddress = useFormik({
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
    }
  });

  const formik = useFormik({
    initialValues: {
      recipient_name: "",
      address: "",
      postal_code: "",
      city: "",
      phone_number: "",
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      setIsLoading(true);
      try {
        const itemDetails = cart.map((item) => ({
          id: item._id,
          price: item.price,
          quantity: item.quantity,
          name: item.product_name,
        }));

        const orderData = {
          userId,
          username,
          item_details: itemDetails,
          recipient_name: formik.values.recipient_name,
          address: formik.values.address,
          postal_code: formik.values.postal_code,
          city: formik.values.city,
          phone_number: formik.values.phone_number,
        };

        console.log("Sending Order Data:", orderData);

        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_URL}/order`,
          orderData
        );
        if (response.data.success) {
          const snapToken = response.data.midtransToken;

          window.snap.pay(snapToken, {
            onSuccess: function (result) {
              Swal.fire({ icon: "success", title: "Payment Successful" });
              console.log("Payment Success:", result);
            },
            onPending: function (result) {
              Swal.fire({ icon: "info", title: "Payment Pending" });
              console.log("Payment Pending:", result);
            },
            onError: function (result) {
              Swal.fire({
                icon: "error",
                title: "Payment Failed",
                text: result.message || "An error occurred during payment.",
              });
              console.error("Payment Error Details:", result);
            },
            onClose: function () {
              Swal.fire({ icon: "warning", title: "Payment Canceled" });
              console.log("Payment Closed by User");
            },
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Create Order Failed",
            text: response.data.message || "Unexpected response from server.",
          });
        }
      } catch (error) {
        console.error("Error during order submission:", error);

        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An error occurred during the order process. Please try again later.";

        Swal.fire({
          icon: "error",
          title: "Order Error",
          text: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateSubtotal = () => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner aria-label="Center-aligned spinner" />
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
          <Breadcrumb.Item href="/cart">Cart</Breadcrumb.Item>
          <Breadcrumb.Item href="/order">Order</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="border border-transparent rounded-2xl m-20 p-16 shadow-xl bg-white dark:bg-slate-800">
          <div className="grid grid-cols-8 grid-rows-6 gap-5">
            <div className="flex flex-col space-y-5 col-span-5 row-span-6 w-auto 2xl:max-w-[900px]">
              <div className="border border-transparent rounded-2xl p-5 shadow-xl bg-gray-200 dark:bg-gray-900 w-auto h-auto">
                <h1 className="text-left text-2xl tracking-wide font-bold my-5">
                  Shopping Cart
                </h1>
                {cart.length === 0 ? (
                  <p>Your cart is empty</p>
                ) : (
                  <>
                    {Array.isArray(cart) &&
                      cart.map((item) => (
                        <div className="grid grid-cols-3 grid-rows-2 my-5">
                          <div className="row-span-2">
                            <img
                              className="size-32 2xl:size-40"
                              src={item.image_product}
                              alt={item.product_name}
                            />
                          </div>
                          <div className="mr-20 mt-2 row-span-2 space-y-5 text-left text-sm 2xl:text-lg 2xl:mt-4">
                            <div className="grid grid-cols-3 -ml-12 2xl:-ml-16">
                              <h1>ID</h1>
                              <h1 className=" 2xl:-ml-6 ">:</h1>
                              <h1 className="whitespace-nowrap flex items-center text-xs 2xl:text-lg -ml-10 2xl:-ml-20">
                                {item._id.slice(0, 8)}
                              </h1>
                            </div>
                            <div className="grid grid-cols-3 -ml-12 2xl:-ml-16">
                              <h1>Name </h1>
                              <h1 className="2xl:-ml-6 ">:</h1>
                              <h1 className="whitespace-nowrap -ml-10 2xl:-ml-20">
                                {item.product_name}
                              </h1>
                            </div>
                            <div className="grid grid-cols-3 -ml-12 2xl:-ml-16">
                              <h1>Color </h1>
                              <h1 className=" 2xl:-ml-6 ">:</h1>
                              <h1 className="-ml-10 2xl:-ml-20 ">
                                {item.color}
                              </h1>
                            </div>
                          </div>
                          <div className="ml-auto mt-2 row-span-2 space-y-5 text-left text-sm 2xl:text-lg 2xl:mt-4">
                            <div className="grid grid-cols-3">
                              <h1>Size </h1>
                              <h1>:</h1>
                              <h1>L</h1>
                            </div>
                            <div className="grid grid-cols-3">
                              <h1>QTY </h1>
                              <h1>:</h1>
                              <h1>{item.quantity}</h1>
                            </div>
                            <div className="grid grid-cols-3">
                              <h1>Price </h1>
                              <h1>:</h1>
                              <h1>{formatPrice(item.price * item.quantity)}</h1>
                            </div>
                          </div>
                        </div>
                      ))}
                    <div className="border border-solid dark:border-slate-600 border-gray-600" />
                    <div className="flex my-5">
                      <h1 className="text-2xl">Summary</h1>
                    </div>
                    <div className="flex flex-row justify-between my-5 2xl:text-lg text-sm">
                      <h1 className="">Subtotal Price</h1>
                      <h1 className="mr-14">
                        {formatPrice(calculateSubtotal())}
                      </h1>
                    </div>
                    <div className="flex flex-row justify-between my-5 2xl:text-lg text-sm">
                      <h1 className="">Shipping</h1>
                      <h1 className="mr-14">$0</h1>
                    </div>
                    <div className="border border-solid dark:border-slate-600 border-gray-600" />
                    <div className="flex flex-row justify-between my-5 2xl:text-lg text-sm">
                      <h1 className="">Total</h1>
                      <h1 className="mr-14">
                        {formatPrice(calculateSubtotal())}
                      </h1>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="col-span-5 row-span-3 col-start-6">
              <div className="flex flex-col col-span-3 row-span-5 w-auto xl:max-w-[600px]">
                <div className="border border-transparent rounded-2xl p-5 shadow-xl bg-gray-200 dark:bg-gray-900 w-auto h-auto">
                  <h1 className="text-left text-2xl tracking-wide font-bold my-5">
                    Delivery Address
                  </h1>
                  <div className="border border-solid dark:border-slate-600 border-gray-600" />
                  <div className="flex flex-row space-x-5 my-5">
                    <div className="flex flex-col text-left space-y-5">
                      <div className="my-2">
                        <div className="flex flex-row space-x-5">
                          <div className="flex flex-col">
                            <Label className="text-black text-base text-left font-bold mb-2">
                              Recipient Name
                            </Label>
                            <TextInput
                              className="2xl:w-[250px]"
                              {...formik.getFieldProps("recipient_name")}
                            />
                            {formik.touched.recipient_name &&
                            formik.errors.recipient_name ? (
                              <div className="text-red-500 text-sm text-left">
                                {formik.errors.recipient_name}
                              </div>
                            ) : null}
                          </div>
                          <div className="flex flex-col">
                            <Label className="text-black text-base text-left font-bold mb-2">
                              Phone Number
                            </Label>
                            <TextInput
                              className="2xl:w-[250px]"
                              {...formik.getFieldProps("phone_number")}
                            />
                            {formik.touched.phone_number &&
                            formik.errors.phone_number ? (
                              <div className="text-red-500 text-sm text-left">
                                {formik.errors.phone_number}
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex flex-col mt-3">
                          <Label className="text-black text-base text-left font-bold mb-2">
                            Address
                          </Label>
                          <TextInput
                            className="2xl:w-[520px]"
                            {...formik.getFieldProps("address")}
                          />
                          {formik.touched.address && formik.errors.address ? (
                            <div className="text-red-500 text-sm text-left">
                              {formik.errors.address}
                            </div>
                          ) : null}
                        </div>
                        <div className="flex flex-row space-x-6  my-4">
                          <div className="flex flex-col">
                            <Label className="text-black text-base text-left font-bold mb-2">
                              Postal Code
                            </Label>
                            <TextInput
                              className="2xl:w-[250px]"
                              {...formik.getFieldProps("postal_code")}
                            />
                            {formik.touched.postal_code &&
                            formik.errors.postal_code ? (
                              <div className="text-red-500 text-sm text-left">
                                {formik.errors.postal_code}
                              </div>
                            ) : null}
                          </div>
                          <div className="flex flex-col">
                            <Label className="text-black text-base text-left font-bold mb-2">
                              City
                            </Label>
                            <TextInput
                              className="2xl:w-[250px]"
                              {...formik.getFieldProps("city")}
                            />
                            {formik.touched.city && formik.errors.city ? (
                              <div className="text-red-500 text-sm text-left">
                                {formik.errors.city}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between space-x-2 ">
                    <Button
                      onClick={() => setOpenModalAddress(true)}
                      className="text-sm 2xl:text-lg"
                    >
                      Change Default Address
                    </Button>
                    <Modal
                      show={openModalAddress}
                      onClose={() => setOpenModalAddress(false)}
                    >
                      <Modal.Header>Change Default Address</Modal.Header>
                      <Modal.Body>
                        <form onSubmit={formikChangeAddress.handleSubmit}>
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
                                onChange={formikChangeAddress.handleChange}
                                onBlur={formikChangeAddress.handleBlur}
                                color={
                                  formikChangeAddress.errors.recipient_name
                                    ? "failure"
                                    : "gray"
                                }
                                helperText={
                                  formikChangeAddress.errors.recipient_name &&
                                  formikChangeAddress.touched.recipient_name
                                    ? formikChangeAddress.errors.recipient_name
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
                                onChange={formikChangeAddress.handleChange}
                                onBlur={formikChangeAddress.handleBlur}
                                color={
                                  formikChangeAddress.errors.address
                                    ? "failure"
                                    : "gray"
                                }
                                helperText={
                                  formikChangeAddress.errors.address &&
                                  formikChangeAddress.touched.address
                                    ? formikChangeAddress.errors.address
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
                                onChange={formikChangeAddress.handleChange}
                                onBlur={formikChangeAddress.handleBlur}
                                color={
                                  formikChangeAddress.errors.postal_code
                                    ? "failure"
                                    : "gray"
                                }
                                helperText={
                                  formikChangeAddress.errors.postal_code &&
                                  formikChangeAddress.touched.postal_code
                                    ? formikChangeAddress.errors.postal_code
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
                                onChange={formikChangeAddress.handleChange}
                                onBlur={formikChangeAddress.handleBlur}
                                color={
                                  formikChangeAddress.errors.city
                                    ? "failure"
                                    : "gray"
                                }
                                helperText={
                                  formikChangeAddress.errors.city &&
                                  formikChangeAddress.touched.city
                                    ? formikChangeAddress.errors.city
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
                                onChange={formikChangeAddress.handleChange}
                                onBlur={formikChangeAddress.handleBlur}
                                color={
                                  formikChangeAddress.errors.phone_number
                                    ? "failure"
                                    : "gray"
                                }
                                helperText={
                                  formikChangeAddress.errors.phone_number &&
                                  formikChangeAddress.touched.phone_number
                                    ? formikChangeAddress.errors.phone_number
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
                              {isLoading ? <Spinner /> : "Save Address"}
                            </Button>
                          </div>
                        </form>
                      </Modal.Body>
                    </Modal>
                    <div className="space-x-4 items-center">
                      <Checkbox
                        checked={isChecked}
                        onChange={handleCheckChange}
                      />
                      <span className="text-sm 2xl:text-lg">
                        Use Default Address
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-5 2xl:row-span-3 row-span-6 col-start-6 row-start-4">
              <div className="flex flex-col space-y-5 col-span-3 row-span-5 w-auto 2xl:max-w-[600px]">
                <div className="border border-transparent rounded-2xl p-5 shadow-xl bg-gray-200 dark:bg-gray-900 w-auto h-auto">
                  <div className="flex justify-between">
                    <h1 className="text-left text-2xl tracking-w ide font-bold my-5">
                      Checkout Order
                    </h1>
                  </div>
                  <div className="border border-solid dark:border-slate-600 border-gray-600" />
                  <div className="flex flex-col my-9">
                    <Button onClick={() => formik.handleSubmit()}>
                      <CiLock className="size-5 mx-2" />
                      Pay
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <FooterComponent />
    </>
  );
};

export default Order;
