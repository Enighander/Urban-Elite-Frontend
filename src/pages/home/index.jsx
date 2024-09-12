import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/index.jsx";
import NavbarLogin from "../../components/navbar/login/index.jsx";
import CarouselHeader from "../../components/carousel/carousel-header/carousel";
import Categories from "../../components/categories/categories";
import FlashSale from "../../components/products/body/flashsale";
import BestSeller from "../../components/products/header/bestseller";
import Products from "../../components/products/footer/products";
import NewArrival from "../../components/products/footer/newArrival";
import FooterComponent from "../../components/footer/footer";

const Home = () => {
  const [showNavbarLogin, setShowNavbarLogin] = useState(false);
  useEffect(() => {
    const usersToken = localStorage.getItem("token");
    if (usersToken) {
      setShowNavbarLogin(true);
    } else {
      setShowNavbarLogin(false);
    }
  }, []);

  return (
    <>
        <div className="grid">
          {/* Navbar spans across all columns */}
          <div className="col-span-5 mb-10">
            {showNavbarLogin ? <NavbarLogin /> : <Navbar />}
          </div>
          {/* Sidebar spans across 1 column */}
          {/* <div className="col-span-1 row-span-3">
            <Sidebar />
          </div> */}
          {/* CarouselHeader spans across 4 columns next to Sidebar */}
          <div className="col-span-5 row-span-4 row-start-2 m-10">
            <CarouselHeader />
          </div>
          {/* Categories section */}
          <div className="col-span-5 m-10">
            <Categories />
          </div>
          {/* FlashSale section */}
          <div className="col-span-5 m-10">
            <FlashSale />
          </div>
          {/* Additional section */}
          <div className="col-span-5 m-10">
            <BestSeller />
          </div>
          <div className="col-span-5 m-10">
            <Products />
          </div>
          {/* <div className="col-span-5 m-10">
            <NewArrival />
          </div> */}
          <div className="col-span-5 m-10">
            <FooterComponent />
          </div>
        </div>
    </>
  );
};

export default Home;
