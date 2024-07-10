import React, { useEffect, useState } from "react";
import NavbarLogin from "../../components/navbar/login";
import Navbar from "../../components/navbar";
import FooterComponent from "../../components/footer/footer";
import { Breadcrumb, Spinner, Button, TextInput } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import axios from "axios";

const CartPage = () => {
  const userId = localStorage.getItem("userId");
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNavbarLogin, setShowNavbarLogin] = useState(false);

  useEffect(() => {
    const usersToken = localStorage.getItem("token");
    if (usersToken) {
      setShowNavbarLogin(true);
    } else {
      setShowNavbarLogin(false);
    }
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/cart/${userId}`
        );
        console.log("API Response:", response.data);
        if (Array.isArray(response.data.cart)) {
          setCart(response.data.cart);
        } else {
          console.error("Invalid cart data:", response.data.cart);
          setCart([]);
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        setCart([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, [userId]);

  const handleIncrement = async (product_id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product_id === product_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
    try {
      axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/cart/increment`, {
        user_id: userId,
        product_id,
      });
    } catch (error) {
      console.error("Failed to increment quantity:", error);
    }
  };

  const handleDecrement = async (product_id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.product_id === product_id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
    try {
      axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/cart/decrement`, {
        user_id: userId,
        product_id,
      });
    } catch (error) {
      console.error("Failed to decrement quantity:", error);
    }
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
      {showNavbarLogin ? <NavbarLogin /> : <Navbar />}
      <div className="flex justify-between my-10 xl:ml-16">
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/home" icon={HiHome}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item href={`/cart`}>Cart</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="border border-transparent rounded-2xl m-20 p-16 shadow-xl bg-neutral-200 dark:bg-slate-800">
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 mb-10">
              <div className="flex flex-col items-start m-2">
                <h1 className="text-2xl">Product</h1>
              </div>
              <div className="flex flex-col items-center mt-2">
                <h1 className="text-2xl">Price</h1>
              </div>
              <div className="flex flex-col items-center m-2">
                <h1 className="text-2xl">Quantity</h1>
              </div>
              <div className="flex flex-col items-end mx-2">
                <h1 className="text-2xl">Subtotal</h1>
              </div>
            </div>
            {Array.isArray(cart) &&
              cart.map((item) => (
                <div key={item._id} className="grid grid-cols-4 gap-4 mb-10">
                  <div className="flex flex-col items-start m-2">
                    <div className="flex mt-5 space-x-5">
                      <img
                        className="w-32 h-auto shadow-xl"
                        src={item.image_product}
                        alt={item.product_name}
                      />
                      <h2 className="m-10 w-52 h-auto">{item.product_name}</h2>
                    </div>
                  </div>
                  <div className="flex flex-col items-center mt-2">
                    <div className="flex items-center mt-14 space-x-2">
                      <h2 className="text-lg">$</h2>
                      <h2 className="text-lg">{item.price}</h2>
                    </div>
                  </div>
                  <div className="flex flex-col items-center m-2">
                    <div className="flex items-center mt-14 space-x-2">
                      <Button
                        color="light"
                        onClick={() => handleDecrement(item.product_id)}
                      >
                        -
                      </Button>
                      <h2 className="text-lg">{item.quantity}</h2>
                      <Button
                        color="light"
                        onClick={() => handleIncrement(item.product_id)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end mx-2">
                    <div className="flex items-center mt-14 space-x-2">
                      <h2 className="text-lg">${item.price * item.quantity}</h2>
                    </div>
                  </div>
                </div>
              ))}

            <div className="flex justify-between mb-10">
              <Button className="p-1" outline gradientDuoTone="purpleToBlue">
                <h1 className="text-lg italic">Return To Shop</h1>
              </Button>
              <Button
                className="p-1 w-28"
                outline
                gradientDuoTone="purpleToBlue"
              >
                <h1 className="text-lg italic">Buy</h1>
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex col-span-2 my-10">
                <TextInput className="w-72" placeholder="Coupon Code" />
                <Button
                  className="h-10 mx-2"
                  outline
                  gradientDuoTone="purpleToBlue"
                >
                  Apply Coupon
                </Button>
              </div>
              <div className="border rounded-xl bg p-5 h-60 space-y-5 shadow-2xl text-left">
                <h1 className="text-left text-lg">Cart Total</h1>
                <div className="grid grid-cols-3 gap-2">
                  <h1>Subtotal</h1>
                  <h1>:</h1>
                  <h1 className="text-center">${calculateSubtotal()}</h1>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <h1>Shipping</h1>
                  <h1>:</h1>
                  <h1 className="text-center">Free</h1>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <h1>Total</h1>
                  <h1>:</h1>
                  <h1 className="text-center">${calculateSubtotal()}</h1>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <FooterComponent />
    </>
  );
};

export default CartPage;
