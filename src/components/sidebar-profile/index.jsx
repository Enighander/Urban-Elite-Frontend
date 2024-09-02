import React from "react";
import { MdPayment } from "react-icons/md";
import { ImProfile, ImAddressBook } from "react-icons/im";
import { SlReload } from "react-icons/sl";
import { TiCancel } from "react-icons/ti";
import { RiLockPasswordLine } from "react-icons/ri";

const SidebarProfile = () => {
  const userId = localStorage.getItem("userId");

  return (
      <div className="col-span-2 row-span-5 text-left text-xl ml-16">
        <ul className="flex flex-col list-none">
          <li>
            <h1>Manage My Account</h1>
          </li>
          <li className="flex flex-col ml-5 my-5 space-y-5">
            <a href={`/profile/user/${userId}`} className="flex text-dark group">
              <ImProfile className="mx-2 size-6" />
              <span className="group-hover:text-slate-500 mx-2">
                My Profile
              </span>
            </a>
            <a href={`/profile/user/${userId}/address-book`} className="flex text-dark group">
              <ImAddressBook className="mx-2 size-6" />
              <span className="group-hover:text-slate-500 mx-2">
                Address Book
              </span>
            </a>
            <a href={`/profile/user/${userId}/payment-option`} className="flex text-dark group">
              <MdPayment className="mx-2 size-6" />
              <span className="group-hover:text-slate-500 mx-2">
                My Payment Options
              </span>
            </a>
            <a href={`/profile/user/${userId}/change-password`} className="flex text-dark group">
              <RiLockPasswordLine className="mx-2 size-6" />
              <span className="group-hover:text-slate-500 mx-2">
                Change Password
              </span>
            </a>
          </li>
          <li className="my-2">
            <h1>Manage Orders</h1>
          </li>
          <li className="flex flex-col ml-5 my-5 space-y-5">
            <a href={`/profile/user/${userId}/order-history`} className="flex text-dark group">
              <SlReload className="mx-2 size-7" />
              <span className="group-hover:text-slate-500 mx-2">My Order</span>
            </a>
            <a href="#" className="flex text-dark group">
              <TiCancel className="mx-2 size-7" />
              <span className="group-hover:text-slate-500 mx-2">
                My Cancellations
              </span>
            </a>
          </li>
        </ul>
      </div>
  );
};

export default SidebarProfile;
