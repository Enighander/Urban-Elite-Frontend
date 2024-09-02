import React from "react";
import NavbarLogin from "../../../../components/navbar/login";
import SidebarLogin from "../../../../components/sidebar-profile";
import FooterComponent from "../../../../components/footer/footer";
import Error404 from "../../../../components/error/404";
import { Breadcrumb } from "flowbite-react";
import { HiHome, HiCheckCircle } from "react-icons/hi";
import SidebarProfile from "../../../../components/sidebar-profile";

const OrderHistory = () => {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  return (
    <>
      <NavbarLogin />
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
            <div className="bg-white dark:bg-gray-900 w-full h-auto rounded p-8 relative border border-solid border-opacity-50 shadow-2xl">
              <h2 className=" text-xl font-medium mb-8 text-left">
                Order History
              </h2>
              <div >
                <h2 className="text-left">Order#13002</h2>
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
