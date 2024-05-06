"use client";
import React, { SVGProps, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { userCheck } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { setCurrentImage } from "@/redux/reducers/userSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Arrow } from "@/public/svgs/Arrow";
import { ILabImage } from "../types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useQuery } from "react-query";
import AltRouteCheck from "../components/alt-route-check";

const UserPage = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const token = session?.user.tokens?.access_token;



  const { data: images } = useQuery(["images"], () => getImages());

  const getImages = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/user/image/list/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      userCheck(error as AxiosError);
    }
  };

  const viewImage = (image: ILabImage) => {
    dispatch(setCurrentImage(image));
    router.push(`/dashboard/images?image=${image.id}`);
  };

  return (
    <div className="">
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        <div className="flex items-center">
          <span className="p-2 ">All Images</span>
          <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
        </div>
        <AltRouteCheck />
      </div>

      <div className="p-4 ">
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
          {images && images.length >= -1 ? (
            images.map((image: ILabImage, i: number) => (
              <div
                onClick={() => viewImage(image)}
                key={i}
                className={`lab-card rounded-2xl p-8 w-full pl-6 neu-shadow dark:bg-cardDarkBg dark:text-white dark:shadow-none bg-white cursor-pointer`}
              >
                <img
                  src={image.image_picture ?? ""}
                  alt=""
                  className="w-[60px] h-[60px]"
                />
                <div className="mt-[40px] ">
                  <h6 className="font-semibold leading-[140%] text-2xl app-text-clip h-[65px] max-h-[65px]">
                    {image.name}
                  </h6>
                </div>
                <span className="flex gap-[10px] items-center h-fit lg:mt-[36px] mt-[28px] font-medium ">
                  <h5 className="leading-[150%] font-medium">Go to lab</h5>
                  <Arrow className="pointer  -rotate-45 transition-all delay-150 dark:fill-white fill-black" />
                </span>
              </div>
            ))
          ) : (
            <>
              {new Array(6).fill(1).map((_, i) => (
                <Skeleton
                  key={i}
                  className="lab-card rounded-2xl p-8 lg:w-[375px] w-full  h-[200px]"
                />
              ))}
            </>
          )}

          {images && images.length === 0 ? (
            <div className="w-full flex justify-center  items-center col-span-12">
              <p className="text-gray-600 dark:text-white">No images found...</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
