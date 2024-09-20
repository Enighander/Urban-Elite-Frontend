import React, { useEffect, useState } from "react";
import NavbarLogin from "../../../../components/navbar/login";
import FooterComponent from "../../../../components/footer/footer";
import Swal from "sweetalert2";
import {
  Breadcrumb,
  Pagination,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
} from "flowbite-react";
import { HiHome } from "react-icons/hi";
import SidebarProfile from "../../../../components/sidebar-profile";
import axios from "axios";

const OrderHistory = () => {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const [order, setOrder] = useState([]);
  const [address, setAddress] = useState([]);
  const [showNavbarLogin, setShowNavbarLogin] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [openModalDetails, setOpenModalDetails] = useState(false);
  const onPageChange = (page) => setCurrentPage(page);

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      setShowNavbarLogin(true);
    } else {
      setShowNavbarLogin(false);
    }
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/order/UUID/${userId}`
        );
        if (Array.isArray(response.data.order)) {
          setOrder(response.data.order);
          console.log(response.data.order);
        } else {
          console.error("invalid order data:", response.data.order);
          setOrder([]);
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
        setOrder([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [userId]);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_API_URL
          }/address/username/${username}`
        );
        if (response.data && response.data.address) {
          setAddress(response.data.address);
          console.log(response.data.address);
        } else {
          console.log("invalid address data:", response.data.address);
          setAddress([]);
        }
      } catch (error) {
        console.error("failed to fetch address:", error);
        setAddress([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddress();
  }, [username]);

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner aria-label="Center-aligned spinner" />
      </div>
    );
  }

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setOpenModalDetails(true);
  };

  const handlePayment = async (orderId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/order/getMidtransToken`,
        { orderId }
      );
      if (response.data.success) {
        const midtransToken = response.data.midtransToken;
        if (typeof window.snap !== "undefined") {
          window.snap.pay(midtransToken, {
            onSuccess: function (result) {
              Swal.fire({ icon: "success", title: "Payment Successful" });
            },
            onPending: function (result) {
              Swal.fire({ icon: "info", title: "Payment Pending" });
            },
            onError: function (result) {
              Swal.fire({ icon: "error", title: "Payment Failed" });
            },
            onClose: function () {
              Swal.fire({ icon: "warning", title: "Payment Canceled" });
            },
          });
        } else {
          console.error("Midtrans snap.js is not available.");
          Swal.fire({
            icon: "error",
            title: "Payment Error",
            text: "Payment service is currently unavailable.",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Payment Error",
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error during payment process: ", error);
      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: "Something went wrong during payment.",
      });
    }
  };

  const PaymentStatus = ({ status }) => {
    let statusColor;
    switch (status) {
      case "pending":
        statusColor = "text-yellow-500";
        break;
      case "paid":
        statusColor = "text-green-500";
        break;
      case "failed":
        statusColor = "text-red-500";
        break;
      default:
        statusColor = "text-gray-500 dark:text-white";
    }

    return (
      <span className={`font-bold ${statusColor}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <>
      {showNavbarLogin ? <NavbarLogin /> : <Navbar />}
      <div className="flex justify-between my-10 xl:ml-16">
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/home" icon={HiHome}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item href={`/profile/user/${userId}`}>
            My Profile
          </Breadcrumb.Item>
          <Breadcrumb.Item href={`/profile/user/${userId}/change-password`}>
            My Order
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
              <h2 className=" text-xl font-medium mb-8 text-left">
                Order History
              </h2>{" "}
              {order.length === 0 ? (
                <p>your order is empty</p>
              ) : (
                <div>
                  {Array.isArray(order) &&
                    order.map((item) => (
                      <>
                        <div
                          className="flex justify-between my-10"
                          key={item._id}
                        >
                          <div className="flex flex-col space-y-4 ">
                            <h1>Order Number</h1>
                            <span className="text-left uppercase">
                              #{item._id.slice(0, 8)}
                            </span>
                          </div>
                          <div className="flex flex-col space-y-4">
                            <h1 className="text-left">Status</h1>
                            <PaymentStatus status={item.paymentStatus} />
                          </div>
                          <div className="flex flex-col space-y-4">
                            <h1>Total</h1>
                            <span>${item.totalPrice}</span>
                          </div>

                          <div className="flex items-center">
                            <div className="space-y-2">
                              <Button
                                size="xs"
                                onClick={() => handleViewDetail(item)}
                              >
                                View Details
                              </Button>
                              {item.paymentStatus === "pending" && (
                                <Button
                                  size="xs"
                                  color="yellow"
                                  onClick={() => handlePayment(item._id)}
                                >
                                  Select Payment
                                </Button>
                              )}
                            </div>

                            <Modal
                              show={openModalDetails}
                              onClose={() => setOpenModalDetails(false)}
                            >
                              <ModalHeader>Order Details</ModalHeader>

                              <ModalBody>
                                {selectedOrder && (
                                  <>
                                    <div className="flex justify-center 2xl:text-xl">
                                      <h1 className="dark: text-white">
                                        Order ID :
                                      </h1>
                                      <span className="mx-2 dark: text-white uppercase">
                                        # {selectedOrder._id.slice(0, 8)}
                                      </span>
                                    </div>
                                    <div className="flex flex-col dark: text-white">
                                      <div className="flex justify-end my-2">
                                        <h1>
                                          Status :{" "}
                                          <PaymentStatus
                                            status={selectedOrder.paymentStatus}
                                          />
                                        </h1>
                                      </div>
                                      <div className="my-2">
                                        {selectedOrder.products.map(
                                          (product) => (
                                            <div
                                              className="flex items-center"
                                              key={product._id}
                                            >
                                              <img
                                                src={product.image_product}
                                                className="w-14 h-14 object-cover"
                                              />
                                              <div className="flex flex-col mx-5 my-5 w-">
                                                <span>
                                                  {product.product_name}
                                                </span>
                                                <div className="flex space-x-10">
                                                  <span>
                                                    x {product.quantity}
                                                  </span>
                                                  <span>$ {product.price}</span>
                                                </div>
                                              </div>
                                              <div></div>
                                            </div>
                                          )
                                        )}
                                        <div className="mt-3">
                                          <div className="flex justify-between">
                                            <h2 className="text-md my-2">
                                              Sub Total
                                            </h2>
                                            <h2 className="text-md">
                                              $ {selectedOrder.totalPrice}
                                            </h2>
                                          </div>
                                          <div className="flex justify-between">
                                            <h2 className="text-md my-2">
                                              Shipment Fee
                                            </h2>
                                            <h2 className="text-md">Free</h2>
                                          </div>
                                          <div className="flex justify-between">
                                            <h2 className="text-md my-2">
                                              Total Price
                                            </h2>
                                            <h2 className="text-md">
                                              $ {selectedOrder.totalPrice}
                                            </h2>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="my-3 border border-solid" />
                                      <h1 className="text-lg my-2">
                                        Shipment info
                                      </h1>
                                      <div className="flex justify-between">
                                        <div className="flex flex-col">
                                          <span>{address.recipient_name}</span>
                                          <span>
                                            {address.address} {address.city}{" "}
                                            {address.postal_code}{" "}
                                          </span>
                                          <span>{address.phone_number}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </ModalBody>
                            </Modal>
                          </div>
                        </div>
                        <div className="mt-5 border border-solid border-slate-200 dark:border-gray-500" />
                      </>
                    ))}
                </div>
              )}
              <div className="mt-10 flex overflow-x-auto justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={100}
                  onPageChange={onPageChange}
                  showIcons
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default OrderHistory;
