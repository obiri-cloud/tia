"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { User, User2 } from "lucide-react";

const ProfileHeader = () => {
  const { data: session } = useSession();

  const user = session?.user!.data;

  return (
    <div className="flex font-medium  justify-between items-center w-full">
      <p className="flex p-1  text-white rounded-full uppercase w-7 h-7  justify-center items-center  text-sm group ">
        {/* {user?.first_name.slice(0, 2)} */}
        <User className="w-5 h-5 text-black dark:text-white" />
      </p>
      <div className="ms-2   flex flex-col">
        <p className="capitalize ">{user?.first_name}</p>
        <span className="text-[10px] capitalize text-gray-400 -mt-[6px]">
          {user?.subscription_plan}
        </span>
      </div>
    </div>
  );
};

export default ProfileHeader;
