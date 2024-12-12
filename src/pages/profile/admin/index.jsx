import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarLogin from "../../../components/navbar/login";
import FooterComponent from "../../../components/footer/footer";
import Error404 from "../../../components/error/404";
import {
  Breadcrumb,
  Button,
  Label,
  TextInput,
  Spinner,
  List,
} from "flowbite-react";
import { HiHome, HiCheckCircle } from "react-icons/hi";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import SidebarProfileAdmin from "../../../components/sidebar-profile/admin";

const AdminProfile = () => {
  const userId = localStorage.getItem("userId");
  const usernameLocal = localStorage.getItem("username");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/admin/${userId}`
        );
        if (response.data && response.data.admin) {
          const { username, email } = response.data.admin;
          formik.setValues({
            username,
            email,
          });
        } else {
          setError("Unexpected response format");
        }
      } catch (error) {
        setError("failed to fetch user data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdmin();
  }, [userId]);
  return (
    <>
      <NavbarLogin />
      <div className="flex justify-between my-10 xl:ml-16">
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/home" icon={HiHome}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item href={`/profile/admin/${userId}`}>
            My Profile
          </Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="flex justify-end text-left text-1xl xl:mr-16 flex-col">
          Welcome, Admin <span className="uppercase">{usernameLocal}</span>
        </h1>
      </div>
      <div className="my-5">
        <div className="p-4 my-10 grid grid-cols-6 grid-rows-4">
          <SidebarProfileAdmin/>
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default AdminProfile;
