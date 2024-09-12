import React, { useEffect, useState } from "react";
import NavbarLogin from "../../components/navbar/login";
import FooterComponent from "../../components/footer/footer";
import Swal from "sweetalert2";
import {
  Breadcrumb,
  Button,
  Label,
  Radio,
  TextInput,
  Spinner,
  Modal,
  ModalBody,
  ModalHeader,
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
  const [address, setAddress] = useState([]);
  const [openModalPayment, setOpenModalPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchUserAddress = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_API_URL
          }/address/username/${username}`
        );
        if (response.data && response.data.address) {
          setAddress(response.data.address);
          formik.setFieldValue(
            "recipient_name",
            response.data.address.recipient_name
          );
          formik.setFieldValue(
            "postal_code",
            response.data.address.postal_code
          );
          formik.setFieldValue("city", response.data.address.city);
          formik.setFieldValue("address", response.data.address.address);
          formik.setFieldValue(
            "phone_number",
            response.data.address.phone_number
          );
        } else {
          console.error("invalid address data:", response.data.address);
          setAddress([]);
        }
      } catch (error) {
        console.error("failed to fetch address data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserAddress();
  }, [username]);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/banks`
        );
        if (response.data) {
          const data = response.data.banks;
          if (Array.isArray(data)) {
            setPaymentMethod(data);
          } else {
            setError("Unexpected response format");
          }
        }
      } catch (error) {
        setError("Failed to fetch data payment");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayment();
  }, []);

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
        const totalPrice = cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        const orderData = {
          userId,
          username,
          addressId: address._id,
          paymentMethod: selectedPayment,
          totalPrice,
        };
        console.log("response orderData = ", orderData);
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_URL}/order`,
          orderData
        );
        if (response.data.success) {
          Swal.fire({ icon: "success", title: "Create Order Successful" });
        } else {
          Swal.fire({
            icon: "error",
            title: "Create Order Failed",
            text: "Unexpected response from server.",
          });
        }
      } catch (error) {
        console.error("Error during order submission: ", error);
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred during the create payment. Please try again later.";
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
          <Breadcrumb.Item href={`/order`}>Order</Breadcrumb.Item>
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
                          <div className="mr-20 mt-2 row-span-2 space-y-5 text-left text-sm 2xl:text-lg 2xl:mt-4 ">
                            <div className="grid grid-cols-3 -ml-12 2xl:-ml-16">
                              <h1>ID</h1>
                              <h1 className=" 2xl:-ml-6 ">:</h1>
                              <h1 className="whitespace-nowrap flex items-center text-xs 2xl:text-lg -ml-10 2xl:-ml-20">
                                {item.productId}
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
                              <h1>$ {item.price}</h1>
                            </div>
                          </div>
                        </div>
                      ))}
                    <div className="border border-solid dark:border-slate-600 border-gray-600" />
                    <div className="flex my-5">
                      <h1 className="text-2xl">Summary</h1>
                    </div>
                    <div className="flex flex-row justify-between my-5 text-md">
                      <h1 className="">Subtotal Price</h1>
                      <h1 className="mr-14">${calculateSubtotal()}</h1>
                    </div>
                    <div className="flex flex-row justify-between my-5 text-md">
                      <h1 className="">Shipping</h1>
                      <h1 className="mr-14">$0</h1>
                    </div>
                    <div className="border border-solid dark:border-slate-600 border-gray-600" />
                    <div className="flex flex-row justify-between my-5 text-md">
                      <h1 className="">Total</h1>
                      <h1 className="mr-14">${calculateSubtotal()}</h1>
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
                              disabled
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
                              disabled
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
                            disabled
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
                              disabled
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
                              disabled
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
                    <Button onClick={() => setOpenModalPayment(true)}>
                      <CiLock className="size-5 mx-2" />
                      Select Payment Method
                    </Button>
                    <Modal
                      show={openModalPayment}
                      onClose={() => {
                        setOpenModalPayment(false);
                      }}
                    >
                      <ModalHeader>Select Payment</ModalHeader>
                      <ModalBody>
                        <div className="flex flex-col justify-between text-black dark:text-white space-y-5">
                          <h1 className="text-xl mb-5">Payment Method</h1>
                          {isLoading && <p>Loading...</p>}
                          {error && <p className="text-red-500">{error}</p>}
                          {!isLoading && !error && paymentMethod.length > 0 ? (
                            <div className="flex flex-col space-y-5">
                              {paymentMethod.map((payment) => (
                                <div key={payment._id}>
                                  <div className="flex justify-between mx-10">
                                    <div className="flex items-center space-x-10">
                                      <img
                                        className="max-w-[100px]"
                                        src={payment.logo}
                                        alt={payment.bank}
                                      />
                                    </div>
                                    <div className="flex items-center">
                                      <Radio
                                        name="paymentMethod"
                                        value={payment.bank}
                                        checked={
                                          selectedPayment === payment.bank
                                        }
                                        onChange={() =>
                                          setSelectedPayment(payment.bank)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            !isLoading &&
                            !error && <p>No payment methods available.</p>
                          )}
                          <div className="flex flex-col">
                            <h1 className="text-lg mt-5 mb-3">
                              Payment Summaries
                            </h1>
                            <div className="border border-solid dark:border-slate-600 border-gray-600" />
                            <div className="flex justify-between my-5">
                              <h2>Shipping Price</h2>
                              <h2>Free</h2>
                            </div>
                            <div className="flex justify-between">
                              <h2>Total Price</h2>
                              <h2>${calculateSubtotal()}</h2>
                            </div>
                          </div>
                          <Button
                            className="my-2"
                            onClick={formik.handleSubmit}
                          >
                            Pay Now
                          </Button>
                        </div>
                      </ModalBody>
                    </Modal>
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
