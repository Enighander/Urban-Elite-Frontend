import React, { useEffect, useState } from "react";
import NavbarLogin from "../../components/navbar/login";
import Navbar from "../../components/navbar";
import FooterComponent from "../../components/footer/footer";
import { Breadcrumb, Spinner } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { FaTruckFast, FaRecycle } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Error404 from "../../components/error/404";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetail = () => {
  const { name, id, color, size } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNavbarLogin, setShowNavbarLogin] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [data, setData] = useState({
    quantity: quantity,
    product_name: name,
    productId: id,
    image_product: "",
    price: 0,
    color: color,
    size: size,
    userId: userId,
    username: username,
  });

  useEffect(() => {
    const usersToken = localStorage.getItem("token");
    if (usersToken) {
      setShowNavbarLogin(true);
    } else {
      setShowNavbarLogin(false);
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/products/details/${id}`
        );
        if (response.data && response.data.product) {
          const productData = response.data.product;
          setProduct(productData);
          setData((prevData) => ({
            ...prevData,
            productId: productData.id,
            product_name: productData.name,
            image_product: productData.image,
            color: productData.color,
            size: productData.size,
            price: productData.price,
          }));
        } else {
          setError("Unexpected response format");
        }
      } catch (error) {
        setError("Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      quantity,
    }));
  }, [quantity]);

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const handleAddCart = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/cart`,
        data
      );
      toast.success("Item added to the cart successfully");
      console.log("order created successfully", response);
    } catch (error) {
      console.error("Error Creating Order:", error);
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
      {isLoading ? (
        <div className="text-center">
          <Spinner aria-label="Center-aligned spinner" />
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : product ? (
        <div className="my-10 xl:ml-16">
          <Breadcrumb aria-label="Default breadcrumb example">
            <Breadcrumb.Item href="/home" icon={HiHome}>
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item href={`/products/categories/${product.category}`}>
              {product.category}
            </Breadcrumb.Item>
            <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
          </Breadcrumb>
          <div className="grid grid-cols-5 grid-rows-5 my-10">
            <div className="col-span-3 row-span-4">
              <div className="flex items-start justify-center">
                <img
                  className="w-[500px] 2xl:mt-5 2xl:w-[600px]"
                  src={product.image}
                  alt={product.name}
                />
              </div>
            </div>
            <div className="col-span-2 row-span-5 col-start-4 space-y-5">
              <div className="flex flex-col items-start">
                <h1 className="text-2xl">{product.name}</h1>
              </div>
              <div className="flex items-start gap-2">
                <p className="text-sm">150 Reviews</p>
                <div className="h-5 opacity-50 border border-black"></div>
                <h1 className="opacity-60 text-green-400 text-sm">
                  In Stock :
                </h1>
                <h1 className="opacity-80 text-sm text-green-400">
                  {product.stock}
                </h1>
              </div>
              <div className="flex items-start w-3/5 space-x-5">
                {product.discountPrice ? (
                  <>
                    <h1 className="text-xl text-gray-500 dark:text-gray-400 line-through">
                      {formatPrice(product.price)}
                    </h1>
                    <h1 className="text-xl text-gray-900 dark:text-white">
                      {formatPrice(product.discountPrice)}
                    </h1>
                  </>
                ) : (
                  <h1 className="text-xl text-gray-900 dark:text-white">
                    {formatPrice(product.price)}
                  </h1>
                )}
              </div>
              <h5 className="text-justify mt-5">{product.description}</h5>
              <div className="flex flex-col items-start">
                <div className="opacity-50 inline-flex w-full items-center">
                  <div className="w-7/12 border border-black dark:border-white"></div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <h1>Colours:</h1>
                <h5>{product.color}</h5>
              </div>
              <div className="flex items-start space-x-2">
                <h1>Size:</h1>
                <button className="ml-5">{product.size}</button>
              </div>
              <div className="flex items-center space-x-5">
                <div className="flex items-stretch border border-black/50 dark:border-white/50">
                  <button
                    className="w-14 h-10 flex items-center justify-center border-r border-black/50 dark:border-white/50"
                    onClick={handleDecrement}
                  >
                    -
                  </button>
                  <div className="w-10 h-10 flex items-center justify-center border-x border-black/50 dark:border-white/50">
                    <span className="dark: text-light text-xl leading-7">
                      {quantity}
                    </span>
                  </div>
                  <button
                    className="w-14 h-10 flex items-center justify-center border-l border-black/50 dark:border-white/50 "
                    onClick={handleIncrement}
                  >
                    +
                  </button>
                </div>
                <button className="w-auto h-10 flex items-center justify-center px-2 border border-solid border-black/50 dark:border-white/50">
                  Buy now
                </button>
                <button
                  className="w-auto h-10 flex items-center justify-center px-2 border border-solid border-black/50 dark:border-white/50"
                  onClick={handleAddCart}
                >
                  Add To Cart
                </button>
              </div>
              <div className="w-7/12 flex items-center px-5 py-5 border border-black/50 dark:border-white/50 space-x-2">
                <FaTruckFast className="w-10 h-5" />
                <div className="flex flex-col text-left">
                  <h5>Free Delivery</h5>
                  <a href="/">
                    Enter your postal code for delivery availability
                  </a>
                </div>
              </div>
              <div className="w-7/12 flex items-center px-5 py-5 border border-black/50 dark:border-white/50 space-x-2">
                <FaRecycle className="w-10 h-5" />
                <div className="flex flex-col text-left">
                  <h5>Return Delivery</h5>
                  <p>
                    Free 30 days delivery return. <a href="/">Details</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error404 />
      )}
      <FooterComponent />
    </>
  );
};

export default ProductDetail;
