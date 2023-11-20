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
    router.push(`/dashboard/labs?lab=${data.id}`);

    toast({
      title: "Lab Resumed",
      variant: "success",
    });
  };

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 h-screen">
      <div className="p-5 lg:border-r border-b w-full flex items-center">
        <div className="w-full">
          <h1 className="text-[40px] font-bold text-center">
            Jump back in your live labs:
          </h1>
          <ul>
            {labs &&
              labs.map((lab, i) => (
                <li className="active-lab-button flex gap-4  mb-5 " key={i}>
                  <button
                    onClick={() => resumeLab(lab)}
                    className="p-3 w-full transparent dark:text-white text-black  text-left border block glassBorder rounded-lg "
                  >
                    {lab.name}
                  </button>
                  <Button variant="destructive" className=" delete-button h-auto">delete</Button>
                </li>
              ))}
          </ul>
          {labs && labs.length === 0 ? (
            <div className="w-full flex justify-center mt-4 items-center">
              <p className="text-gray-600">No active labs found...</p>
            </div>
          ) : null}
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
