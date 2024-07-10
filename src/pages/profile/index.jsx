import React, { useEffect, useState } from "react";
import User from "./user/index.jsx";
import Admin from "./admin/index.jsx";

const Profile = () => {
  const userRole = localStorage.getItem("role");
  const [profileComponent, setProfileComponent] = useState(null);

  useEffect(() => {
    if (userRole === "user") {
      setProfileComponent(<User />);
    } else if (userRole === "admin") {
      setProfileComponent(<Admin />);
    }
  }, [userRole]);

  return <div>{profileComponent}</div>;
};

export default Profile;
