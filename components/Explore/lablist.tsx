"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import LabInfoDialog from "@/app/components/explore/labinfodialog";
import { Dialog, DialogTrigger } from "../ui/dialog";
import axios, { AxiosError } from "axios";
import { errorToJSON } from "next/dist/server/render";
import secureLocalStorage from "react-secure-storage";
import { userCheck } from "@/lib/utils";
import { ILabImage } from "@/app/types";

const LabList = () => {
  const { data: session } = useSession();
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;
  

  const [labs, setLabs] = useState<ILabImage[]>();
  const [currentLab, setCurrentLab] = useState<ILabImage>();

  useEffect(() => {
    getLabs();
  }, []);

  const getLabs = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/user/image/list/`,
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
    } catch (error) {
      userCheck(error as AxiosError)
      console.error("error", error);
    }
  };

  return (
    <Dialog>
      <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
        {labs && labs.length >= -1 ? (
          labs.map((lab, i) => (
            <DialogTrigger key={i}>
              <span
                onClick={() => setCurrentLab(lab)}
                key={i}
                className="w-full flex flex-col justify-center items-center h-[250px] bg-gray-200/90  py-6"
              >
                {/* <Image
                  src={lab.image_picture ?? ""}
                  alt={lab.name}
            layout="fill"
                  className="w-[16px] h-[16px]"
                /> */}
                <h6 className="mb-0 font-bold">{lab.name}</h6>
                <img src={lab.image_picture ?? ""} alt="" className="flex-1 " />
                {/* <p className=" ">{lab.name}</p> */}
              </span>
            </DialogTrigger>
          ))
        ) : (
          <>
            {new Array(6).fill(1).map((_, i) => (
              <Skeleton key={i} className="w-full h-[200px] rounded-md" />
            ))}
          </>
        )}
      </div>
      {labs && labs.length === 0 ? (
        <div className="w-full flex justify-center h-[400px] items-center">
          <p className="text-gray-600">No images found...</p>
        </div>
      ) : null}
      {/* <Toaster /> */}
      <LabInfoDialog lab={currentLab} />
    </Dialog>
  );
};

export default LabList;

{
  /* {labs.map((lab, i) => (
          <button
            // onClick={() => goToLab(lab.label)}
            key={i}
            className="w-full flex justify-center items-center h-[250px] bg-gray-200/90 "
          >
            <Image src={lab.image_picture} alt={lab.name} fill={true}/>
          </button>
        ))} */
}
