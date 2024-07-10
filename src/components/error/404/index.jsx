import React from "react";
import { Breadcrumb, Button } from "flowbite-react";
import { HiHome } from "react-icons/hi";

const Error404 = () => {
  return (
    <>
      <div className="p-40 mx-96 mt-10">
        <div className="flex flex-col space-y-16 items-center size-full">
          <h1 className="text-center text-8xl font-medium">404 Not Found</h1>
        <p>
        Sorry, the page you are looking for could not be found.
        </p>
          <Button color="dark" href="/home" >Back to Homepage</Button>
        </div>
      </div>
    </>
  );
};

export default Error404;
