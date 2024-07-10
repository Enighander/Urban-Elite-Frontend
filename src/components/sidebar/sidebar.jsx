import React from "react";
import { Dropdown, Sidebar } from "flowbite-react";

const sidebar = () => {
  return (
    <div className="w-56 h-auto lg:ml-12 flex flex-col justify-start items-start gap-5">
      <Sidebar>
        <Sidebar.Items>
          <div className="flex justify-between items-center w-full my-2 ">
            <a
              href="#"
              className="text-center text-black text-base font-normal dark:text-white "
            >
              Woman’s Fashion
            </a>
            <button className="flex-shrink-0">
              <Dropdown placement="right-start" color="white">
                <Dropdown.Item href="#">T-Shirt</Dropdown.Item>
                <Dropdown.Item href="">Pants</Dropdown.Item>
                <Dropdown.Item href="">Short Pants</Dropdown.Item>
                <Dropdown.Item href="">Jeans</Dropdown.Item>
                <Dropdown.Item href="">Jacket</Dropdown.Item>
                <Dropdown.Item href="">Sweeter</Dropdown.Item>
              </Dropdown>
            </button>
          </div>
          <div className="flex justify-between items-center w-full">
            <a
              href="#"
              className="text-center text-black text-base font-normal dark:text-white"
            >
              Man’s Fashion
            </a>
            <Dropdown placement="right-start" color="white">
              <Dropdown.Item href="">T-Shirt</Dropdown.Item>
              <Dropdown.Item href="">Pants</Dropdown.Item>
              <Dropdown.Item href="">Short Pants</Dropdown.Item>
              <Dropdown.Item href="">Jeans</Dropdown.Item>
              <Dropdown.Item href="">Jacket</Dropdown.Item>
              <Dropdown.Item href="">Sweeter</Dropdown.Item>
            </Dropdown>
          </div>
          <div className="flex justify-between items-center w-full my-2">
            <a
              href="#"
              className="text-center text-black text-base font-normal dark:text-white"
            >
              Electronics
            </a>
            <button className="flex-shrink-0">
              <Dropdown placement="right-start" color="white">
                <Dropdown.Item href="">PC-Parts</Dropdown.Item>
                <Dropdown.Item href="">Console</Dropdown.Item>
                <Dropdown.Item href="">Headset</Dropdown.Item>
                <Dropdown.Item href="">Smartphone</Dropdown.Item>
                <Dropdown.Item href="">Accessories</Dropdown.Item>
                <Dropdown.Item href="">Etc</Dropdown.Item>
              </Dropdown>
            </button>
          </div>
          <div className="flex flex-col text-left gap-5 my-4">
            <a href="#" className="text-black text-base font-normal dark:text-white">
              Home & LifeStyle
            </a>
            <a href="#" className="text-black text-base font-normal dark:text-white">
              Sport
            </a>
            <a href="#" className="text-black text-base font-normal dark:text-white">
              Toys
            </a>
            <a href="#" className="text-black text-base font-normal dark:text-white">
              Groceries
            </a>
            <a href="#" className="text-black text-base font-normal dark:text-white">
              Health & Beauty
            </a>
          </div>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
};

export default sidebar;
