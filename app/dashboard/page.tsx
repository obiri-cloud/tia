"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import secureLocalStorage from "react-secure-storage";
import { MetroSpinner } from "react-spinners-kit";

interface ILabListItem {
  id: number;
  name: string;
  image: number;
  ingress_url: string;
  creation_date: string
}

const UserPage = () => {
  const [labs, setLabs] = useState<ILabListItem[]>();
  const [disabled, setDisabled] = useState(false);

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
      console.log("response.data.results", response.data.results);

      setLabs(response.data.results);
    } catch (error) {}
  };

  const resumeLab = (data: ILabListItem) => {
    console.log("data", data);
    
    secureLocalStorage.setItem(
      "tialab_info",
      JSON.stringify({
        id: data.image,
        url: data.ingress_url,
        creation_date: data.creation_date
      })
    );
    router.push(`/dashboard/labs?lab=${data.id}`);

    toast({
      title: "Lab Resumed",
      variant: "success",
    });
  };

  const deleteLab = async (id: number) => {
    setDisabled(true);
    let formData = JSON.stringify({ image: id });
    toast({
      title: "Hold on we are deleting your lab.",
    });
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/user/lab/delete/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 200) {
        toast({
          title: response.data.message,
          variant: "success",
        });
        setDisabled(false);
        setLabs((prev) => prev?.filter((lab) => lab.image !== id));
      } else {
        toast({
          title: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong. Try again",
        variant: "destructive",
      });
      console.error(error);
    }
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
                  <Button
                    onClick={() => resumeLab(lab)}
                    className="w-full transparent bg-black text-white  text-left border block glassBorder rounded-lg "
                  >
                    {lab.name}
                  </Button>
                  <Button
                    disabled={disabled}
                    onClick={() => deleteLab(lab.image)}
                    variant="destructive"
                    className=" delete-button h-auto disabled:bg-red-900/10"
                  >
                    {disabled ? (
                      <MetroSpinner size={20} color="#fff" loading={true} />
                    ) : (
                      <span>Delete</span>
                    )}
                  </Button>
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
