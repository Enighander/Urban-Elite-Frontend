import React from "react";
import { ImProfile, ImAddressBook } from "react-icons/im";
import { SlReload } from "react-icons/sl";
import { TiCancel } from "react-icons/ti";
import { RiLockPasswordLine } from "react-icons/ri";

const SidebarProfileAdmin = () => {
  const userId = localStorage.getItem("userId");

  return (
    <div className="col-span-2 row-span-5 text-left text-xl ml-16">
      <ul className="flex flex-col list-none">
        <li>
          <h1>Manage Admin Dashboard</h1>
        </li>
        <li className="flex flex-col ml-5 my-5 space-y-5">
          <a href={`/profile/admin/${userId}`} className="flex text-dark group">
            <ImProfile className="mx-2 size-6" />
            <span className="group-hover:text-slate-500 mx-2">Accounts</span>
          </a>
          <a
            href={`/profile/admin/${userId}/product-management`}
            className="flex text-dark group"
          >
            <ImAddressBook className="mx-2 size-6" />
            <span className="group-hover:text-slate-500 mx-2">
              Manage Products
            </span>
          </a>
          <a href={`/profile/admin/${userId}/`} className="flex text-dark group">
            <RiLockPasswordLine className="mx-2 size-6" />
            <span className="group-hover:text-slate-500 mx-2">
              Manage Categories
            </span>
          </a>

        </li>
        <li className="my-2">
          <h1>Manage Orders</h1>
        </li>
        <li className="flex flex-col ml-5 my-5 space-y-5">
          <a
            href={`/profile/admin/${userId}/order-list`}
            className="flex text-dark group"
          >
            <SlReload className="mx-2 size-7" />
            <span className="group-hover:text-slate-500 mx-2">Order List</span>
          </a>
          <a href="#" className="flex text-dark group">
            <TiCancel className="mx-2 size-7" />
            <span className="group-hover:text-slate-500 mx-2">
              Cancellations List
            </span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default SidebarProfileAdmin;
