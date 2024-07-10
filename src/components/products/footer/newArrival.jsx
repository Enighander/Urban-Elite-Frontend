import React, { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import axios from "axios";
import { Link } from "react-router-dom";
import Error404 from "../../error/404";

const NewArrival = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/products`
        );
        if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products.slice(0, 4)); // Limit to 4 products
        } else {
          setError("Unexpected response format");
        }
      } catch (error) {
        setError("Failed to fetch products.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="lg:ml-14">
      <div className="flex">
        <h1>Featured</h1>
      </div>
      <div className="flex">
        <h1 className="text-4xl my-5">New Arrival</h1>
      </div>
      <div className="container mx-auto">
        {isLoading ? (
          <div className="text-center">
            <Spinner aria-label="Center-aligned spinner" />
          </div>
        ) : error ? (
          <p>{error}</p>
        ) : products.length > 0 ? (
          <div className="flex flex-wrap">
            {products[0] && (
              <div className="relative w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
                <img src={products[0].image} alt={products[0].name} className="w-4/3 h-auto" />
                <div className="absolute bottom-1 right-3 m-4">
                  <Link to={`/product/${products[0].id}`} className="text-white text-2xl font-bold">
                    <p className="text-black">testing</p>
                  </Link>
                </div>
              </div>
            )}
            <div className="w-full lg:w-1/2 flex flex-wrap">
              {products[1] && (
                <div className="relative w-full lg:w-full px-4 mb-8 lg:mb-16">
                  <img src={products[1].image} alt={products[1].name} className="w-1/3 h-auto" />
                  <div className="absolute bottom-1 right-3 m-4">
                    <Link to={`/product/${products[1].id}`} className="text-white text-2xl font-bold">
                    <p className="text-black">testing</p>
                    </Link>
                  </div>
                </div>
              )}
              {products[2] && (
                <div className="relative w-full lg:w-1/2 px-5">
                  <img src={products[2].image} alt={products[2].name} className="w-full h-auto mb-8" />
                  <div className="absolute bottom-5 right-3 m-4">
                    <Link to={`/product/${products[2].id}`} className="text-white text-2xl font-bold">
                    <p className="text-black">testing</p>
                    </Link>
                  </div>
                </div>
              )}
              {products[3] && (
                <div className="relative w-full lg:w-1/2 px-5">
                  <img src={products[3].image} alt={products[3].name} className="w-full h-auto mb-8" />
                  <div className="absolute bottom-5 right-3 m-4">
                    <Link to={`/product/${products[3].id}`} className="text-white text-2xl font-bold">
                    <p className="text-black">testing</p>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Error404 />
        )}
      </div>
    </div>
  );
};

export default NewArrival;
