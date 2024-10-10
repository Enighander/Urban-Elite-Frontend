import React, { useState, useEffect } from "react";
import { Button, Card, Spinner } from "flowbite-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Products = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemPerPage = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_API_URL
          }/products?limit=${itemPerPage}`
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
  }, [itemPerPage]);

  const handleAddToCart = async (product) => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    
    const finalPrice = product.discountPrice
      ? product.discountPrice
      : product.price;

    const data = {
      quantity: 1,
      product_name: product.name,
      productId: product._id,
      image_product: product.image,
      price: finalPrice,
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
      <div className="lg: ml-14">
        <div className="flex">
          <h1>Our Products</h1>
        </div>
        <div className="flex justify-between">
          <h1 className="text-4xl my-5">Explore Our Products</h1>
        </div>
        <div className="flex gap-5">
          {isLoading ? (
            <div className="text-center">
              <Spinner aria-label="Center-aligned spinner" />
            </div>
          ) : error ? (
            <p>{error}</p>
          ) : products.length > 0 ? (
            products.map((product) => (
              <Card
                className="max-w-xs max-h-full"
                imgAlt={`Product ${product.name}`}
                imgSrc={product.image}
                key={product._id}
              >
                 <Link to={`/products/details/${product._id}`}>
                  <h5 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                    {product.name}
                  </h5>
                </Link>
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
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-left  text-gray-500 dark:text-gray-400 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xl font-bold text-left  text-gray-900 dark:text-white">
                        {formatPrice(product.discountPrice)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xl text-left  font-bold text-gray-900 dark:text-white">
                      {formatPrice(product.price)}
                    </span>
                  )}
                  <div className="flex justify-between">
                    <a
                      onClick={() => handleAddToCart(product)}
                      className="rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                    >
                      Add to cart
                    </a>
                    <a className="rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800">
                      Buy Now
                    </a>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
        <div className="flex justify-center">
          <Button color="light" className=" my-10 ">
            <Link to={"/products"}>View All</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Products;
