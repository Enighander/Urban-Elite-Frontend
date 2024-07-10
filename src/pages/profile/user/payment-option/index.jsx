import React, { useState } from "react";
import {
  Breadcrumb,
  Label,
  Button,
  TextInput,
  Spinner,
  Modal,
} from "flowbite-react";
import { HiHome, HiCreditCard } from "react-icons/hi";
import { FcSimCardChip } from "react-icons/fc";
import NavbarLogin from "../../../../components/navbar/login";
import FooterComponent from "../../../../components/footer/footer";
import SidebarProfile from "../../../../components/sidebar-profile";

const PaymentOption = () => {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <NavbarLogin />
      <div className="flex justify-between my-10 xl:ml-16 ">
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/home" icon={HiHome}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item href={`/profile/user/${userId}`}>
            My Profile
          </Breadcrumb.Item>
          <Breadcrumb.Item href={`/profile/user/${userId}/payment-option`}>
            Payment Option
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
            <div className="w-full h-auto rounded p-8 relative border border-solid border-opacity-50 shadow-2xl">
              <h2 className="text-xl font-medium mb-8 text-left">
                Edit and Choose Your Payment Method
              </h2>
              <div className="grid grid-rows-1 gap-6">
                <div className="flex flex-col gap-6">
                  <div className="flex justify-center">
                    <button className="border border-solid rounded-2xl w-1/2 max-w-96 border-gray-800 m-5 mx-10 shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition duration-200">
                      <div className="flex flex-col space-y-2 p-5">
                        <div className="flex mx-2 space-x-12">
                          <h1>Visa</h1>
                          <h1>0000 0000 0000 0000</h1>
                        </div>
                        <div className="flex mx-2 space-x-5">
                          <h1>Expiries</h1>
                          <h1>09/21</h1>
                        </div>
                      </div>
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      className="m-10 p-10 max-w-1/2"
                      color="light"
                      onClick={() => setOpenModal(true)}
                    >
                      <HiCreditCard className="w-7 h-7 mx-2" />
                      <h1 className="text-lg">Create Payment Method</h1>
                    </Button>
                  </div>
                  <Modal show={openModal} onClose={() => setOpenModal(false)}>
                    <Modal.Header />
                    <Modal.Body className="bg-gray-300 dark:bg-gray-800">
                      <div className="flex flex-col border rounded-2xl border-transparent bg-gradient-to-br from-zinc-900 via-violet-600 to-pink-600 mx-20 my-5 shadow-2xl">
                        <div className="flex justify-end">
                          <h1 className="mx-5 my-5 text-white text-2xl uppercase w-auto max-w-52">
                            visa
                          </h1>
                        </div>
                        <FcSimCardChip className="w-16 h-full mx-5 mt-5 mb-3" />
                        <div className="flex space-x-4 mx-7 my-2 text-white">
                          <h1 className="text-xl">Enighander Rielev</h1>
                          <h1 className="text-xl">00/00</h1>
                        </div>
                        <div className="flex space-x-2 mx-7 text-white">
                          <p className="text-md">0000</p>
                          <p className="text-md">0000</p>
                          <p className="text-md">0000</p>
                          <p className="text-md">0000</p>
                        </div>
                      </div>
                    </Modal.Body>
                    <div className="mx-5">
                      <form>
                        <div className="grid grid-cols-2 gap-10 my-5">
                          <div className="flex flex-col">
                            <Label className="text-black text-base text-left font-normal mb-2">
                              Card Holder
                            </Label>
                            <TextInput
                              id="name"
                              type="text"
                              name="name"
                              placeholder="Enter your name"
                            />
                          </div>
                          <div className="flex flex-col">
                            <Label className="text-black text-base text-left font-normal mb-2">
                              Expiration
                            </Label>
                            <TextInput
                              id="expiration"
                              type="text"
                              name="expiration"
                              placeholder="Enter your exp date"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 my-5">
                          <div className="flex flex-col">
                            <Label className="text-black text-base text-left font-normal mb-2">
                              Card Number
                            </Label>
                            <div className="flex space-x-1">
                              <TextInput
                                id="recipient_name"
                                type="text"
                                name="recipient_name"
                                placeholder="0000"
                                maxlength="4"
                                className="w-24"
                              />
                              <TextInput
                                id="recipient_name"
                                type="text"
                                name="recipient_name"
                                placeholder="0000"
                                maxlength="4"
                                className="w-24"
                              />
                              <TextInput
                                id="recipient_name"
                                type="text"
                                name="recipient_name"
                                placeholder="0000"
                                maxlength="4"
                                className="w-24"
                              />
                              <TextInput
                                id="recipient_name"
                                type="text"
                                name="recipient_name"
                                placeholder="0000"
                                maxlength="4"
                                className="w-24"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col mx-5">
                            <Label className="text-black text-base text-left font-normal mb-2">
                              CVV
                            </Label>
                            <TextInput
                              id="cvv"
                              type="password"
                              name="ccv"
                              placeholder="000"
                              maxLength="3"
                              className="w-12"
                            />
                          </div>
                          <div className="flex flex-col my-2">
                            <Label className="text-black text-base text-left font-normal mb-2">
                              Bank Name
                            </Label>
                            <TextInput
                              id="bank"
                              type="text"
                              name="bank"
                              placeholder="Bank"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                    <Modal.Footer className="flex justify-center">
                      <div className="flex space-x-5">
                        <Button color="red" onClick={() => setOpenModal(false)}>
                          <h1 className="text-xl">Cancel</h1>
                        </Button>
                        <Button
                          onClick={() => setOpenModal(false)}
                          color="light"
                        >
                          <h1 className="text-xl">Submit</h1>
                        </Button>
                      </div>
                    </Modal.Footer>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default PaymentOption;
