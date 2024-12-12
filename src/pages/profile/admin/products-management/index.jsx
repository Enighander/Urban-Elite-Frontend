import React, { useEffect, useState } from "react";
import { Breadcrumb, Label, Button, TextInput, Spinner } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { useFormik } from "formik";
import axios from "axios";
import Swal from "sweetalert2";
import NavbarLogin from "../../../../components/navbar/login";
import SidebarProfileAdmin from "../../../../components/sidebar-profile/admin";

const ProductManagement = () => {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  return (
    <>
      <NavbarLogin />
      <div className="flex justify-between my-10 xl:ml-16 ">
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/home" icon={HiHome}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item href={``}>Admin</Breadcrumb.Item>
          <Breadcrumb.Item href={``}>Product Management</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="flex justify-end text-1xl xl:mr-16">
          Welcome, <span className="mx-2 uppercase">{username}</span>
        </h1>
      </div>
      <div className="my-5">
        <div className="p-4 my-10 grid grid-cols-6 grid-rows-4">
          <SidebarProfileAdmin />
          <div className="col-span-3 row-span-4 col-start-3">
            <div className="bg-white dark:bg-[#1F2937] w-full h-auto border border-transparent rounded-2xl p-8 relative shadow-2xl">
              <h2 className="text-xl font-medium mb-8 text-left">
                Manage Products
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductManagement;
