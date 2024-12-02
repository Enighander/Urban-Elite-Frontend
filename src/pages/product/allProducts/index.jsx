import React, { useEffect, useState } from "react";
import NavbarLogin from "../../../components/navbar/login";
import Navbar from "../../../components/navbar";
import FooterComponent from "../../../components/footer/footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Spinner, Breadcrumb, Button } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import Error404 from "../../../components/error/404";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllProducts = () => {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/products`
        );
        if (response.data) {
          const data = response.data.products;
          if (Array.isArray(data)) {
            setProducts(data);
          } else {
            setError("Unexpected response format");
          }
        }
      } catch (error) {
        setError("Failed to fetch products.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    const data = {
      quantity: 1,
      product_name: product.name,
      productId: product._id,
      image_product: product.image,
      price: product.price,
      color: product.color,
      size: product.size,
      userId: userId,
      username: username,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/cart`,
        data
      );
      toast.success("Item added to the cart successfully");
      console.log("order created successfully", response);
    } catch (error) {
      console.error("Error Creating Order:", error);
      toast.error("Failed to add item to the cart");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={5000} />
      {showNavbarLogin ? <NavbarLogin /> : <Navbar />}
      <div className="flex my-5 mx-14 gap-5">
        {isLoading ? (
          <div className="text-center">
            <Spinner aria-label="Center-aligned spinner" />
          </div>
        ) : error ? (
          <p>{error}</p>
        ) : products.length > 0 ? (
          <div>
            <Breadcrumb
              aria-label="Default breadcrumb example"
              className="my-5"
            >
              <Breadcrumb.Item href="/home" icon={HiHome}>
                Home
              </Breadcrumb.Item>
              <Breadcrumb.Item>Our Products</Breadcrumb.Item>
            </Breadcrumb>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
              {products.map((product) => (
                <Card
                  className="lg:max-w-64 max-h-full"
                  imgAlt={`Product ${product.name}`}
                  imgSrc={product.image}
                  key={product._id}
                >
                  <Link to={`/products/details/${product._id}`}>
                    <h5 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white text-left">
                      {product.name}
                    </h5>
                  </Link>
                  <div className="border border-solid border-slate-600" />
                  <div className="mb-5 mt-2.5 flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className="h-5 w-5 text-yellow-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-3 mr-2 rounded bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-cyan-800 dark:bg-cyan-200 dark:text-cyan-800">
                      5.0
                    </span>
                  </div>
                  <div className="flex flex-col justify-between space-y-5">
                  {product.discountPrice ? (
                    <div className="flex text-left space-x-3">
                      <span className="2xl:text-xl lg:text-md font-bold text-gray-900 dark:text-white">
                        {formatPrice(product.discountPrice)}
                      </span>
                      <span className="2xl:text-md lg:text-sm font-bold text-gray-500 dark:text-gray-400 line-through">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xl text-left font-bold text-gray-900 dark:text-white">
                      {formatPrice(product.price)}
                    </span>
                  )}
                  <div className="flex  justify-center space-x-2">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="rounded-lg whitespace-nowrap bg-cyan-700 2xl:w-36 lg:w-24 lg:h-10 text-center text-sm font-sm text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                    >
                      Add to carts
                    </Button>
                    <Button
                      onClick=""
                      className="rounded-lg whitespace-nowrap bg-cyan-700 2xl:w-36 lg:w-24 lg:h-10 text-center text-sm font-sm text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <Error404 />
          </div>
        )}
      </div>
      <FooterComponent />
    </>
  );
};

export default AllProducts;
