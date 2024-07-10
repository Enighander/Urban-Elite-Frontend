import React from "react";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";
import { Footer } from "flowbite-react";
import { Label, TextInput } from "flowbite-react";
import { HiMail } from "react-icons/hi";

const FooterComponent = () => {
  return (
    <Footer container>
      <div className="w-full">
        <div className="grid w-full grid-cols-2 gap-5 px-8 py-8 md:grid-cols-5">
          <div>
            <Footer.Title title="Urban Elite" className="text-left" />
            <Footer.LinkGroup col className="text-left">
              <Footer.Link href="#">Subscribe</Footer.Link>
              <h5>Get 10% off your first order</h5>
              <div className="max-w-md">
                <div className="mb-2 block">
                  <Label htmlFor="emailUser" value="Your email" />
                </div>
                <TextInput
                  id="emailUser"
                  type="email"
                  icon={HiMail}
                  placeholder="email@gmail.com"
                  required
                />
              </div>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Support" className="text-left" />
            <Footer.LinkGroup col className="text-left">
              <Footer.Link href="#">"address"</Footer.Link>
              <Footer.Link href="#">UrbanElite@gmail.com</Footer.Link>
              <Footer.Link href="#">+628512345678</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Account" className="text-left" />
            <Footer.LinkGroup col className="text-left">
              <Footer.Link href="#">My Account</Footer.Link>
              <Footer.Link href="#">Login / Sign Up</Footer.Link>
              <Footer.Link href="#">Cart</Footer.Link>
              <Footer.Link href="#">Shop</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Quick Link" className="text-left" />
            <Footer.LinkGroup col className="text-left">
              <Footer.Link href="#">Privacy Policy</Footer.Link>
              <Footer.Link href="#">FAQ</Footer.Link>
              <Footer.Link href="#">Contact</Footer.Link>
              <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="download" className="text-left" />
            <Footer.LinkGroup col className="text-left">
              <Footer.Link href="#">iOS</Footer.Link>
              <Footer.Link href="#">Android</Footer.Link>
              <Footer.Link href="#">Windows</Footer.Link>
              <Footer.Link href="#">MacOS</Footer.Link>
            </Footer.LinkGroup>
          </div>
        </div>
        <div className="w-full bg-gray-700 px-4 py-6 sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href="#" by="Urban Elite™" year={2022} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="#" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsDribbble} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;
