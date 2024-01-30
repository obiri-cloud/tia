"use client"
import React from "react";
import { useSession } from "next-auth/react";


const ProfileHeader = () => {
  const { data: session } = useSession();

  // @ts-ignore
  const user = session?.user!.data;
  console.log("user", user);
  
    
  return (
    <div className="flex justify-between items-center w-full">
      <a className="flex items-center p-2  text-white rounded-lg  hover:bg-menuHov group bg-pink-200">
        <span className=" uppercase">{user?.first_name.slice(0,2)}</span>
      </a>
      <span className="ms-3 font-light">{user?.first_name}</span>
    </div>
  );
};

export default ProfileHeader;
