"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";

interface ILabListItem {
  id: number;
  name: string;
  image: number;
  ingress_url: string;
}

const UserPage = () => {
  const [labs, setLabs] = useState<ILabListItem[]>();

  const router = useRouter();
  const { data: session } = useSession();
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;


  useEffect(() => {
    getActiveLabs();
  }, []);

  const getActiveLabs = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/user/labs/list/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLabs(response.data.results);
    } catch (error) {}
  };

  const resumeLab = (data: ILabListItem) => {
    localStorage.setItem(
      "tialab_info",
      JSON.stringify({
        id: data.image,
        url: data.ingress_url,
      })
    );
    toast({
      title: "Lab Resumed",
      variant: "success",
    });
    // router.push(`/dashboard/labs?lab=${data.id}`);
  };

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="p-5 border-r flex items-center">
        <div className="">
          <h1 className="text-[40px] font-bold">
            Jump back in your live labs:
          </h1>
          <ul>
            {labs &&
              labs.map((lab, i) => (
                <li key={i}>
                  <button
                    onClick={() => resumeLab(lab)}
                    className="p-3 w-full transparent dark:text-white text-black  text-left border mb-5 block glassBorder rounded-lg "
                  >
                    {lab.name}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Link
          href="/dashboard/explore"
          className="w-auto  dark:bg-white dark:text-black bg-black text-white  hover:bg-black/9 block py-2 px-4 rounded-md hover:bg-black/90"
        >
          Start a new lab
        </Link>
      </div>
    </div>
  );
};

export default UserPage;
