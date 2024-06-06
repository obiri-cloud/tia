"use client";
import React from "react";
import { useSession } from "next-auth/react";

const ProfileHeader = () => {
  const { data: session } = useSession();

  const user = session?.user!.data;

  return (
    <div className="flex font-medium  justify-between items-center w-full">
      <p className="flex p-1  text-white rounded-full uppercase w-7 h-7  justify-center items-center  text-sm group bg-mint">
        {user?.first_name.slice(0, 2)}
      </p>
      <span className="ms-3  capitalize">{user?.first_name}</span>
    </div>
  );
};

export default ProfileHeader;
