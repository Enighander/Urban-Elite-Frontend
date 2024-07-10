import React, { useState, useEffect } from "react";
import { GoArrowRight, GoArrowLeft } from "react-icons/go";
import { Button, Card, Spinner } from "flowbite-react";
import { Link } from "react-router-dom";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/categories`
        );
        if (response.data) {
          const data = response.data.categories;
          if (Array.isArray(data)) {
            setCategories(data);
          } else {
            setError("Unexpected response format");
          }
        }
      } catch (error) {
        setError("Failed to fetch categories.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="lg:ml-14">
      <div className="flex">
        <h1>Categories</h1>
      </div>
      <div className="flex justify-between">
        <h1 className="text-4xl my-5">Browse By Category</h1>
        <div className="flex xl:mr-12 gap-2">
          <Button color="light" pill className="w-14 h-10 ">
            <GoArrowLeft className="h-5 w-5" />
          </Button>
          <Button color="light" pill className="w-14 h-10">
            <GoArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-5 mt-5">
        {isLoading ? (
          <div className="text-center">
            <Spinner aria-label="Center-aligned spinner" />
          </div>
        ) : error ? (
          <p>{error}</p>
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <Card
              className="max-w-xs max-h-full dark:bg-gray-300 dark:text-black"
              key={category._id}
            >
              <Link to={`/products/categories/${category.name}`}>
                <img
                  src={category.image}
                  alt={`Category ${category.name}`}
                  className="w-10 h-10 mx-2"
                />
                <h5 className="mt-5 text-sm font-semibold tracking-tight">
                  {category.name}
                </h5>
              </Link>
            </Card>
          ))
        ) : (
          <p>No categories available</p>
        )}
      </div>
    </div>
  );
};

export default Categories;
